# 🪺 LifeNest

**Your cozy corner for tracking life.**

LifeNest is a personal Telegram bot that helps you check in with yourself: log your mood, get gentle reminders at the times you choose, and (soon) build healthy mental habits like gratitude and thought journaling. Formerly *TrackYourLife*.

## ✨ Features

### Available / in progress

- **Mood tracking**: rate your mood from 1 to 5 and add an optional note, right in Telegram
- **Custom reminders**: pick a preset (morning / noon / evening, with or without afternoon, etc.) or choose your own times, in 5-minute steps
- **Reliable scheduling**: a cron job runs every 5 minutes with a 1-hour catch-up window, so no reminder is missed and none is sent twice
- **Passwordless accounts**: no email, no password
  - `/register`: creates your account and gives you a one-time recovery code
  - `/connect <code>`: restores your account on a new Telegram
  - `/newcode`: generates a fresh recovery code
- **Timezone-aware**: each user has their own IANA timezone (e.g. `Asia/Beirut`); everything is stored in UTC
- **Multi-user ready**: built so it can be opened to more people later

### Coming soon

- 🫙 **Gratitude jar**: save the good moments
- 💭 **Small reflections**: short daily prompts
- 🧠 **Beck's thought record**: a cognitive-behavioral tool to examine and reframe difficult thoughts

## 🧱 Tech stack

- TypeScript
- Cloudflare Workers (bot webhook + cron triggers)
- Cloudflare D1 (SQLite database)
- Telegram Bot API

## 🗄️ Data model (overview)

`users` · `telegram_accounts` · `moods` · `reminders`

Reminders store both the user's `local_time` and a UTC `fire_time` that the cron compares against, plus a `last_sent_at` column to prevent duplicates.

## 🤝 Contributing

This project follows a branch + pull request workflow: work on a feature branch, open a PR, merge into `main`. Merged branches are deleted automatically.

## 📄 License

TBD
