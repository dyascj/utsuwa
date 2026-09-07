import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { createDefaultCharacterState } from '../../types/character.ts';
import { parseResponse } from '../../ai/response-parser.ts';
import { StreamingSpeechBuffer } from '../tts/streaming-speech-buffer.ts';
import type { SpeechSegment } from '../voice-orchestrator.ts';

// Run the actual companion and transport modules. Only browser stores and
// persistence are replaced; the prompt, parsers, buffer and hosted xsai stream
// stay real so this test covers their event ordering together.
test('companion chat preserves native speech across direct and hosted state blocks', async (t) => {
	const root = fileURLToPath(new URL('../../../../', import.meta.url)).replace(/\/$/, '');
	const speech = { activeProvider: 'omnivoice', activeLanguage: 'en', altLanguage: 'es', enableAltLanguage: true, enableToolCalling: true };
	let direct = true;
	let llmProvider = 'openai-compatible';
	let buffer: StreamingSpeechBuffer | undefined;
	let spoken: SpeechSegment[] = [];
	const turns: ReturnType<typeof parseResponse>[] = [];
	let latest = '';
	let speechEnabled = true;
	let speechStarted = false;
	const messages: { role: string; content: string }[] = [];
	const chatStore = {
		messages, isLoading: false, error: null as string | null,
		addMessage: (role: string, content: string) => messages.push({ role, content }),
		updateLastMessage: (content: string) => { messages[messages.length - 1].content = content; },
		setLoading: (value: boolean) => { chatStore.isLoading = value; },
		setError: (value: string | null) => { chatStore.error = value; }
	};
	const fixtures = {
		chatStore,
		characterStore: { state: createDefaultCharacterState(), isReady: false },
		personaStore: { activeCard: { id: 'test', name: 'Utsuwa', systemPrompt: 'Friendly', extensions: {} } },
		settingsStore: { getProviderConfig: () => ({ apiKey: 'test-key', baseUrl: 'https://provider.invalid/v1/' }) },
		modulesStore: {
			isModuleEnabled: () => true,
			getModuleState: () => ({ enabled: speechEnabled }),
			getModuleSettings: (id: string) => id === 'speech' ? speech : { activeProvider: llmProvider, activeModel: 'test-model' }
		},
		vrmStore: { startTalking: () => {} },
		reminderStore: { upcoming: [] },
		ttsStore: {
			beginStreaming: async () => {
				speechStarted = true;
				buffer = new StreamingSpeechBuffer({ defaultLanguage: 'en', onSegment: (s) => spoken.push(s) });
				return true;
			},
			feedStreaming: (chunk: string) => buffer?.feed(chunk),
			endStreaming: async () => { buffer?.flush(); },
			cancelStreaming: () => buffer?.reset()
		},
		isTauri: () => direct,
		processCompanionTurn: async ({ companionResponse }: { companionResponse: string }) => {
			const parsed = parseResponse(companionResponse);
			turns.push(parsed);
			return { dialogue: parsed.dialogue, newMemory: parsed.stateUpdates?.newMemory, triggeredEvent: null };
		}
	};
	const globals = globalThis as unknown as Record<string, unknown>;
	globals.__utsuwaChatIntegration = fixtures;
	const replacements: Record<string, string> = {
		'$env/dynamic/private': 'export const env = {};',
		'src/lib/engine/memory': `export const retrieveRelevantContext = async () => ({ recentTurns: [], relevantFacts: [], triggeredMemories: [], recentSessions: [] });
			export const getWorkingMemory = () => ({}); export const ensureSession = async () => null;`,
		'src/lib/services/storage/keepsakes': 'export const keepImage = async () => {};',
		'src/lib/services/platform': 'export const isTauri = () => globalThis.__utsuwaChatIntegration.isTauri();',
		'src/lib/services/chat/companion-turn': 'export const processCompanionTurn = (...args) => globalThis.__utsuwaChatIntegration.processCompanionTurn(...args);'
	};
	for (const [path, name] of Object.entries({
		chat: 'chatStore', character: 'characterStore', persona: 'personaStore', settings: 'settingsStore',
		modules: 'modulesStore', vrm: 'vrmStore', reminders: 'reminderStore', tts: 'ttsStore'
	})) replacements[`src/lib/stores/${path}.svelte`] = `export const ${name} = globalThis.__utsuwaChatIntegration.${name};`;
	const server = await createServer({
		root, configFile: false, server: { middlewareMode: true }, appType: 'custom',
		resolve: { alias: [
			...Object.keys(replacements).map((key) => ({
				find: key.replace('src/lib/', '$lib/'), replacement: '\0companion-test:' + key
			})),
			{ find: '$lib', replacement: `${root}/src/lib` }
		] },
		optimizeDeps: { noDiscovery: true, entries: [] },
		plugins: [{
			name: 'companion-test-stores',
			resolveId(id) {
				if (id.startsWith('\0companion-test:')) return id;
				const key = id.startsWith(`${root}/`) ? id.slice(root.length + 1).replace(/\.ts$/, '') : id;
				if (key in replacements) return '\0companion-test:' + key;
			},
			load(id) { if (id.startsWith('\0companion-test:')) return replacements[id.slice('\0companion-test:'.length)]; }
		}]
	});
	try {
		const { sendCompanionMessage } = await server.ssrLoadModule('/src/lib/services/chat/companion-chat.ts');
		const { POST } = await server.ssrLoadModule('/src/routes/api/chat/+server.ts');
		const state = '\n```json\n{"mood_change":{"emotion":"happy","intensity_delta":2},"new_memory":"They are learning Spanish"}\n```\nDuplicate text must stay hidden.';
		const hooks = { setTyping: () => {}, setLatestResponse: (text: string) => { latest = text; }, setActiveEvent: () => {} };
		for (const transport of ['direct', 'hosted']) {
			for (const stateFirst of [true, false]) {
				await t.test(`${transport}, state ${stateFirst ? 'before' : 'after'} native calls`, async (t) => {
					direct = transport === 'direct';
					messages.length = 0; spoken = []; turns.length = 0;
					const textEvents = [...state].map((content) => ({ choices: [{ delta: { content } }] }));
					const toolEvents = ['Let me know how your interview goes.', 'Hola, buenos días.'].flatMap((text, index) => {
						const args = JSON.stringify({ text, language: index ? 'es' : 'en' });
						return [
							{ choices: [{ delta: { tool_calls: [{ index, id: `call_${index}`, type: 'function', function: { name: 'speak_segment', arguments: args.slice(0, 10) } }] } }] },
							{ choices: [{ delta: { tool_calls: [{ index, function: { arguments: args.slice(10) } }] } }] }
						];
					});
					const events = stateFirst ? [...textEvents, ...toolEvents] : [...toolEvents, ...textEvents];
					const wire = events.map((e) => `data: ${JSON.stringify(e)}\n\n`).join('') + 'data: [DONE]\n\n';
					t.mock.method(globalThis, 'fetch', async (url: string, init: RequestInit) => {
						if (url === '/api/chat') return POST({ request: new Request('http://localhost/api/chat', init) });
						assert.equal(String(url), 'https://provider.invalid/v1/chat/completions');
						return new Response(new ReadableStream({ start(controller) {
							// Split both SSE lines and UTF-8 characters across network chunks.
							const bytes = new TextEncoder().encode(wire);
							for (let i = 0; i < bytes.length; i += 11) controller.enqueue(bytes.slice(i, i + 11));
							controller.close();
						} }), { headers: { 'Content-Type': 'text/event-stream' } });
					});
					await sendCompanionMessage('Hello', [], hooks);
					assert.equal(chatStore.error, null);
					assert.deepEqual(spoken.map((s) => [s.text, s.language]), [
						['Let me know how your interview goes.', 'en'], ['Hola, buenos días.', 'es']
					]);
					assert.equal(latest, 'Let me know how your interview goes. Hola, buenos días.');
					assert.equal(messages.at(-1)?.content, latest);
					assert.equal(turns.at(-1)?.stateUpdates?.newMemory, 'They are learning Spanish');
					assert.equal(turns.at(-1)?.stateUpdates?.moodChange?.emotion, 'happy');
				});
			}
		}
		await t.test('Anthropic receives inline instructions and speech-off requests receive no tools', async (t) => {
			direct = true; llmProvider = 'anthropic';
			for (const enabled of [true, false]) {
				speechEnabled = enabled; speechStarted = false; messages.length = 0; spoken = [];
				t.mock.method(globalThis, 'fetch', async (_url: string, init: RequestInit) => {
					const body = JSON.parse(String(init.body));
					assert.equal(body.tools, undefined);
					assert.equal(body.system.includes('inline speak() commands'), enabled);
					assert.equal(body.system.includes('native tool calls'), false);
					return new Response(`data: ${JSON.stringify({ type: 'content_block_delta', delta: { text: 'speak({"text":"Hello there.","lang":"en"})' + state } })}\n\n`);
				});
				await sendCompanionMessage('Hello', [], hooks);
				assert.equal(chatStore.error, null);
				assert.equal(latest, 'Hello there.');
				assert.equal(speechStarted, enabled);
			}
		});
	} finally {
		buffer?.reset();
		await server.close();
		delete globals.__utsuwaChatIntegration;
	}
});
