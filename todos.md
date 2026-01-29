# Todos

## High Priority

- [x] Require Vercel status checks to pass before merging PRs
  - Add `required_status_checks` rule to the main branch ruleset
  - Point it at the Vercel build check name
  - Prevents merging broken code

- [x] Standardize on pnpm as the sole package manager
  - Delete `package-lock.json`
  - Add `"packageManager": "pnpm@10.28.2"` to `package.json`
  - Add `npmrc` with `engine-strict=true`
  - Avoids dual lockfile sync issues like the one we just hit

- [x] Add a `lint` script to `package.json`
  - Configure ESLint or alias to `svelte-check`
  - Both contributing docs tell contributors to follow code style but there's no linter

## Medium Priority

- [ ] Enable signed commits (GPG or SSH signing)
  - Adds `Verified` badge, proves commits came from you

- [x] Add `.nvmrc` file with `22`
  - Makes `nvm use` work without guessing the version

- [x] Add `.npmrc` with `engine-strict=true`
  - Fails fast on wrong Node version instead of subtle errors

## Low Priority

- [ ] Set up Dependabot or Renovate for automated dependency updates
- [ ] Add GitHub Actions CI to run `check` and tests on PRs
- [ ] Add CODEOWNERS file for auto-assigning reviewers
