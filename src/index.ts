export default {
	async fetch(request, env, ctx): Promise<Response> {
		return new Response("LifeNest bot is running");
	},

	async scheduled(controller, env, ctx): Promise<void> {
		console.log("cron fired", controller.scheduledTime);
	},
} satisfies ExportedHandler<Env>;