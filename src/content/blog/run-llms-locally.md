---
title: You Can Run AI Locally (And You Probably Should)
description: A practical guide to running LLMs on your own hardware with Hugging Face, Ollama, and models that actually fit on a gaming PC.
date: '2026-02-06'
image: /blog/gaming-gpu.jpg
tag: Guide
---

# You Can Run AI Locally (And You Probably Should)

Here's something that most people don't realize: you don't need to send every thought, question, and conversation to a corporate server to use AI. You can run the whole thing on your own computer. Right now. For free. And the models are genuinely good.

The general public still thinks of AI as something that lives in the cloud. You open ChatGPT or Claude or Gemini, you type something, and your data goes... somewhere. Their servers, their training pipelines, their terms of service. You agreed to it when you clicked "I accept" without reading anything. We all did.

But there's a whole parallel world of open-weight models that run entirely on your machine. Your conversations never leave your hard drive. No accounts, no subscriptions, no data harvesting. Just you and a language model sitting in your GPU's VRAM.

## The privacy problem nobody talks about

Every time you use a cloud AI service, your prompts are being sent to a data center. Depending on the provider, those conversations might be used for training, reviewed by humans for safety, stored indefinitely, or all of the above. Most providers have gotten better about this, but the fundamental dynamic hasn't changed: you're trusting a company with your data.

For casual stuff like "what's a good pasta recipe" that's whatever. But people are using AI for deeply personal things now. Journaling, therapy-adjacent conversations, processing grief, exploring identity, writing things they'd never say out loud. Sending all of that to a company's servers is... a choice. And most people don't even realize they're making it.

Running locally means none of that leaves your machine. Period.

## Enter Hugging Face

If you haven't heard of [Hugging Face](https://huggingface.co), think of it as GitHub but for AI models. It's where the open-source AI community lives. Thousands of models, datasets, and tools, all free to download and use. When a new open model drops from Meta, Google, Alibaba, Mistral, or Microsoft, it ends up on Hugging Face within hours.

The site can feel overwhelming at first. There are over 300,000 models on there. But you don't need to wade through all of them. The community does a great job of surfacing what's actually good, and the tools for running models locally have gotten ridiculously simple.

## How to actually do it

You need two things: a tool to run the model, and the model itself.

### The tools

**[Ollama](https://ollama.com)** is the easiest way to get started. Install it, open your terminal, and run:

```bash
ollama pull qwen3:8b
ollama run qwen3:8b
```

That's it. You're running an 8 billion parameter language model locally. It even exposes an API that's compatible with OpenAI's format, so apps like Utsuwa can connect to it directly.

**[LM Studio](https://lmstudio.ai)** is the option if you prefer a GUI. It has a clean interface for browsing and downloading models from Hugging Face, a built-in chat window, and a local server mode. It's particularly nice on Mac with Apple Silicon thanks to MLX optimization.

**[GPT4All](https://gpt4all.io)** is the simplest option for people who just want to chat. Download, install, pick a model, go. No terminal required.

### The models

This is where it gets fun. Here are some models that actually run well on a normal gaming PC and deliver surprisingly good output.

**For general conversation:**

| Model | Parameters | VRAM Needed (Q4) | Best For |
|-------|-----------|-------------------|----------|
| Qwen3 8B | 8B | ~5-6 GB | The all-rounder. Strong reasoning, multilingual, 128K context. Fits on any 8GB card. |
| Qwen3 14B | 14B | ~10-11 GB | Step up in quality. Needs a 12GB card but it's worth it. |
| Gemma 3 12B | 12B | ~9-10 GB | Google's entry. Multimodal (handles images too). Great quantized versions. |
| Llama 3.2 3B | 3B | ~2-3 GB | Runs on basically anything. Good for lighter tasks. |

**For coding:**

| Model | Parameters | VRAM Needed (Q4) | Best For |
|-------|-----------|-------------------|----------|
| Qwen 2.5 Coder 7B | 7B | ~5 GB | 88% on HumanEval. Competitive with GPT-4o on code tasks. Absurd for its size. |
| DeepSeek Coder V2 Lite | 14B | ~10 GB | Supports 300+ languages. Solid on 12GB cards. |

**For reasoning and math:**

| Model | Parameters | VRAM Needed (Q4) | Best For |
|-------|-----------|-------------------|----------|
| Phi-4 | 14B | ~10 GB | Microsoft's STEM specialist. Punches way above its weight on math and logic. |
| DeepSeek R1 Distill 14B | 14B | ~10 GB | Distilled from the massive 671B R1 model. Strong chain-of-thought reasoning. |

The general rule: Q4_K_M quantization is the sweet spot. You lose maybe 3-5% quality compared to the full-precision model but cut VRAM usage by 75%. For most people, that's the right trade-off.

## What GPU do you actually need?

You don't need a $2,000 GPU. Here's the real breakdown:

**8GB VRAM (RTX 3060 8GB, RTX 4060)** gets you 7-8B models comfortably. That's Qwen3 8B, Llama 3.1 8B, Mistral 7B. These are legitimately useful models that can hold a conversation, help with code, and handle most tasks you'd throw at a cloud AI.

**12GB VRAM (RTX 3060 12GB, RTX 4070)** is the sweet spot. You unlock 14B-class models like Qwen3 14B, Phi-4, and Gemma 3 12B. The jump in quality from 8B to 14B is noticeable. If you're buying a GPU with local AI in mind, aim for 12GB.

**24GB VRAM (RTX 3090, RTX 4090)** lets you run bigger models and higher quantization levels. You can fit the Qwen3 30B-A3B (a mixture-of-experts model that only activates 3B parameters per token but has 30B total) which gives you 30B-class output quality with surprisingly fast inference.

The important thing: 16GB of system RAM is the minimum. 32GB is recommended. Models that don't fully fit in VRAM can spill into system RAM, but it's 5-10x slower for those offloaded layers. You want the whole model in VRAM if possible.

## Why this matters for Utsuwa

This is exactly why we built Utsuwa the way we did. The app connects to any OpenAI-compatible API, which means it works with Ollama out of the box. You can have a fully local AI companion with a VRM avatar, voice synthesis, and personality system where absolutely nothing leaves your machine.

No subscription. No data harvesting. No terms of service that change on you. Just your hardware, your model, your companion.

The setup takes about 10 minutes:

1. Install [Ollama](https://ollama.com)
2. Pull a model: `ollama pull qwen3:14b`
3. Open Utsuwa, point it at `http://localhost:11434`
4. Talk to your companion

That's the whole thing. Your conversations stay on your drive. Your character data stays on your drive. If you want to delete everything, you delete a folder. No account deletion request, no 30-day waiting period, no "we may retain some data for legal purposes."

## The gap is closing fast

A year ago, local models were noticeably worse than the cloud offerings. That gap has shrunk dramatically. Qwen3 14B is genuinely competitive with GPT-4-class models for most everyday tasks. The coding models are scoring in the high 80s on benchmarks that cloud models dominated just months ago. And they keep getting better.

The open-source AI community moves fast. New models drop weekly. Quantization techniques keep improving. Hardware requirements keep going down. We're heading toward a world where running a great AI model locally is as normal as running a web browser.

You don't have to wait for that world. You can start today.
