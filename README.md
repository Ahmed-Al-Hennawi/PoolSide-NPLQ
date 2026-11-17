# Poolside

Version 1.0.0 · A mobile-friendly study application with 42 lessons, 60 original practice questions, interview preparation, a two-day revision plan, sign-in, durable study progress and scored assessment history.

## Stack and structure

- React 19 and TypeScript, with Vinext / Vite server rendering.
- Cloudflare Workers for application routes and server-side assessment grading.
- Cloudflare D1 and Drizzle for durable, user-scoped attempts and lesson progress.
- Sites-managed ChatGPT sign-in; no separate password database.
- `app/`: pages and API endpoints.
- `components/`: landing/shared navigation, learning, practice runner, dashboard and interview UI.
- `lib/content/learning.json`: original paraphrased study material.
- `lib/content/questions.json`: server-only question bank, answer keys and explanations.
- `lib/assessment.ts`: grading, answer validation and question sanitisation.
- `db/schema.ts` and `drizzle/`: database schema and immutable migration history.
- `public/fonts/`: locally hosted OFL-licensed fonts and their licences.

Original screenshots, PDF, OCR and incidental screen text stay outside this checkout. The original pool illustration is code-native SVG. No remote images, analytics or payment SDKs are used.

## Local development

Requires Node.js 22.13 or newer.

```sh
npm run install:ci
npm run dev -- --hostname 127.0.0.1
```

Open http://127.0.0.1:5173. Guest mock tests are enabled by default. Local sign-in uses a development account; the hosted site uses ChatGPT sign-in. Production identity must come from the hosting platform.

Generate schema changes with `npm run db:generate`. Build to emit the local Worker configuration. Apply each pending local migration once:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_early_clea.sql
```

Hosting: Cloudflare Workers and D1 through Sites. The project ID and database binding are in `.openai/hosting.json`. Production migrations are applied by the hosting platform; local records are not deployed.

## Turn guest mock tests on or off

Open `lib/settings.ts`. Guest tests are temporarily enabled with:

```ts
export const ALLOW_GUEST_MOCK_TESTS = true;
```

Change `true` to `false` to require sign-in again. Save the file, stop the local
server with Control+C, then restart it with `npm run dev -- --hostname 127.0.0.1`.
Refresh the browser. For the hosted website, rebuild and redeploy the changed source
through Sites; changing a local file alone does not update the live version.

This one setting controls both the test buttons and the server endpoints. Turning
it off also blocks access to existing guest tests. Signed-in tests and account
history continue to work. Guest tests use a private browser cookie and expire after
24 hours, with expired records deleted on the next test start. Guests can submit,
see scores and reveal explanations, but tests do not transfer into an account.
The hosted site's separate private-access gate is unchanged by this setting.

## Checks

```sh
npm run typecheck
npm test
node scripts/check-content.mjs
npm run build
```

`npm test` checks grading and answer validation. `node scripts/check-api.mjs` exercises the locally built Worker on loopback (including disposable test records). See the script for its port and fixture details.

## Assessment model

The supplied May 2026 sample has two written papers, safety (Section 1) and first aid (Section 3), each 24 questions / 36 minutes / 17 correct as its pass threshold. Poolside uses that threshold only as a practice benchmark. The combined rehearsal allows 72 minutes and grades each paper separately. The rescue set is explicitly additional knowledge practice; it is not a practical assessment.

Question order is shuffled. On starting, the server snapshots the selected questions, records an absolute deadline, and returns no answer keys. Answers save on selection. The server validates ownership and answer indices, enforces the deadline, computes the score and prevents editing submitted attempts. The timer continues if the page closes. Expired attempts are finalised when opened. Flag markers are temporary page state.

## Privacy and operational scope

New deployment is private to its owner. The application stores a site-specific user ID, lesson completion and test records. It receives email/name from authentication for display only. Results and progress can be exported or deleted from the dashboard. Deletion does not remove the ChatGPT account or platform operational logs.

Policy pages describe this private personal-study version accurately. Before public or commercial launch, supply real operator/contact details, review provider agreements and applicable obligations, and arrange a full accessibility and security review. No claim of legal compliance or official RLSS endorsement is made. Use current approved training and local NOP/EAP for practical work.

## Release

The initial release is tagged `v1.0.0`. See [CHANGELOG.md](CHANGELOG.md) for the release notes.

Only application source, configuration, migrations, tests, documentation and required assets belong in this repository. Training screenshots, reference PDFs, local databases, secrets, dependency folders and generated builds stay outside Git.
