# LifeNest – Architecture

LifeNest is a personal Telegram bot for mood tracking, with a chill and cosy tone. It starts as a single-user tool and may be opened to several users later. The bot and all its commands and messages are **in English only**.

## Stack

- **Runtime**: Cloudflare Workers (TypeScript)
- **Telegram library**: grammY, with `@grammyjs/router` for routing
- **Database**: Cloudflare D1 (SQLite)
- **Scheduling**: Cloudflare Cron Trigger, every 5 minutes
- **No Workers KV, no `@grammyjs/conversations`** (see "Conversation state")

## Environments

Two fully separate environments, defined in `wrangler.toml` (`[env.dev]` and `[env.production]`):

| | dev | production |
| --- | --- | --- |
| Telegram bot | dev bot | prod bot |
| D1 database | `lifenest-db-dev` | `lifenest-db-prod` |
| Secrets | own bot token and webhook secret | own bot token and webhook secret |

Secrets are set with `wrangler secret put` and never committed. The cron trigger is only required in production; in dev it can be tested with `wrangler dev --test-scheduled`.

## Data flow

```text
Telegram --webhook--> Worker (fetch)      --> D1
                      Worker (scheduled)  --> D1 --> Telegram API (sendMessage)
```

One Worker per environment with two entry points: `fetch` (Telegram webhook, verified with a secret) and `scheduled` (reminders).

## Repo structure

```text
src/
  index.ts      # exports fetch + scheduled only
  telegram/     # Telegram client, update parsing, inline keyboards
  commands/     # register, connect, newcode, mood, reminders, ...
  db/           # all D1 access, one function per operation
  cron/         # reminder logic
  lib/          # pure helpers: dates/timezones, 5-minute rounding, code hashing
migrations/     # versioned SQL migrations for D1
wrangler.toml
```

**Portability rule**: only `index.ts` and `db/` may depend on Cloudflare APIs. Business logic (`cron/`, `lib/`) is made of pure functions that touch neither D1 nor Telegram directly, so it can be unit-tested and moved to another host later.

## Database

Tables: `users`, `telegram_accounts`, `moods`, `reminders` (exact columns defined in the migrations).

- **Dates**: always stored in UTC+0. Mood datetime format is `yyyymmddhhmmss`.
- **Time zones**: each user has a personal time zone in `users`, stored as an IANA name (e.g. `Asia/Beirut`), not a fixed offset.
- **moods**: rating from 1 to 5, UTC datetime, optional description. More fields may be added.
- **reminders**: several rows per user. Columns include `local_time` (chosen time, in the user's time zone), `fire_time` (UTC, compared by the cron) and `last_sent_at`. `fire_time` is recomputed daily. Index on `fire_time`.
- Reminder presets (morning 08:00, noon 12:00, afternoon 15:00, evening 22:00; combinations morning/noon/evening, morning/noon/afternoon/evening, morning/evening, noon/evening; or free custom times) live **in the code only**, not in the database.

## Accounts

No Telegram-ID-only identity. Each account is protected by a recovery code:

- `/register` creates the account and shows a recovery code **once**.
- `/connect <code>` links a new Telegram account to an existing one.
- `/newcode` generates a new recovery code.
- Recovery codes are stored **hashed**, never in clear text.

## Reminders and cron

- The cron runs every 5 minutes and selects reminders that are due.
- Reminder times are multiples of 5 minutes. Rounding happens in Telegram **before** database insertion: the bot proposes the rounded time and the user accepts it. The database does no rounding.
- A catch-up window of 1 hour plus `last_sent_at` guarantees no missed reminder and no duplicate.
- Each pass sends at most about 40 messages. Anything not sent is picked up by the next pass thanks to the catch-up window.

## Conversation state

Multi-step flows (mood rating then description, time zone choice, reminder setup, and later the Beck table) use:

- inline keyboards with explicit `callback_data`;
- a small `state` stored in D1 for the steps where free text is expected;
- the grammY router dispatching on that state.

The Workers runtime is stateless, so no state is kept in memory between messages.

## Free plan constraints (Cloudflare)

- Max 50 subrequests per invocation, all services combined (every D1 query and every Telegram call counts). Use `db.batch()`, which counts as one.
- Max 6 simultaneous D1 connections per invocation: limit `Promise.all` to 6 parallel queries.
- Avoid noisy `console.log` in loops, especially in the cron.

## Git workflow

One branch per task, commits on the branch, pull request, merge into `main`. Merged branches are deleted automatically on the remote. Keep each PR small and focused.

## Roadmap

1. Project scaffold and D1 bindings for both environments
2. SQL migrations (tables and `fire_time` index)
3. Telegram webhook, router and `/start`
4. Accounts: `/register`, `/connect`, `/newcode`
5. Time zone setup and mood logging
6. Reminders configuration and cron
7. Polish: history/stats, error handling, production deployment

Later, once the project is nearly finished: `gratitudeJar()`, `smallReflection()` and the Beck table (Beck's columns, a psychology tool).
