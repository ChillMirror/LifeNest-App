import { type Bot, webhookCallback } from 'grammy';
import type { BotContext } from './commands/start';
import { findUserStateByTgId } from './db/users';
import { verifyWebhookSecret } from './lib/webhookSecret';
import { createBot } from './telegram/bot';

let bot: Bot<BotContext> | undefined;
let handleWebhook: ((request: Request) => Promise<Response>) | undefined;
let activeDb: D1Database | undefined;

function getWebhookHandler(env: Env): (request: Request) => Promise<Response> {
	activeDb = env.DB;

	if (!bot || !handleWebhook) {
		bot = createBot(env.TELEGRAM_BOT_TOKEN, (tgId) => {
			if (!activeDb) {
				throw new Error('D1 database binding is not available');
			}
			return findUserStateByTgId(activeDb, tgId);
		});
		handleWebhook = webhookCallback(bot, 'cloudflare-mod');
	}

	return handleWebhook;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		if (request.method !== 'POST') {
			return new Response('LifeNest bot is running');
		}

		const token = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
		const check = verifyWebhookSecret(token, env.TELEGRAM_WEBHOOK_SECRET);

		if (!check.valid) {
			console.warn(`Webhook rejected: ${check.reason}`);
			return new Response('Forbidden', { status: 403 });
		}

		try {
			const handler = getWebhookHandler(env);
			return await handler(request);
		} catch (err) {
			const message = err instanceof Error ? `${err.name}: ${err.message}` : 'Unknown error';
			console.error(`Unhandled webhook error: ${message}`);
			return new Response('OK', { status: 200 });
		}
	},

	async scheduled(controller, env, ctx): Promise<void> {
		console.log('cron fired', controller.scheduledTime);
	},
} satisfies ExportedHandler<Env>;
