import { verifyWebhookSecret } from './lib/webhookSecret';

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

		return new Response('OK', { status: 200 });
	},

	async scheduled(controller, env, ctx): Promise<void> {
		console.log('cron fired', controller.scheduledTime);
	},
} satisfies ExportedHandler<Env>;
