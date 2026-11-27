import { Router } from '@grammyjs/router';
import { Bot } from 'grammy';
import { type BotContext, handleStart } from '../commands/start';
import type { UserStateRow } from '../db/users';
import { resolveRouterKey } from '../lib/routerKey';
import { MESSAGES } from './messages';

export type FindUserByTgId = (tgId: number) => Promise<UserStateRow | null>;

export function createBot(token: string, findUserByTgId: FindUserByTgId): Bot<BotContext> {
	const bot = new Bot<BotContext>(token);

	bot.use(async (ctx, next) => {
		const tgId = ctx.from?.id;
		const user = tgId !== undefined ? await findUserByTgId(tgId) : null;
		ctx.user = user;
		ctx.routeKey = resolveRouterKey(user);
		await next();
	});

	bot.command('start', handleStart);

	const router = new Router<BotContext>((ctx) => ctx.routeKey);

	router.route('unregistered', async (ctx) => {
		if (ctx.chat) {
			await ctx.reply(MESSAGES.freeTextUnregistered);
		}
	});

	router.route('idle', async (ctx) => {
		if (ctx.chat) {
			await ctx.reply(MESSAGES.freeTextIdle);
		}
	});

	bot.use(router);

	bot.catch(async (err) => {
		const error = err.error;
		const message = error instanceof Error ? `${error.name}: ${error.message}` : 'Unknown error';
		console.error(`Bot error on update ${err.ctx.update.update_id}: ${message}`);

		try {
			if (err.ctx.chat) {
				await err.ctx.reply(MESSAGES.error);
			}
		} catch (replyErr) {
			const replyMsg = replyErr instanceof Error ? `${replyErr.name}: ${replyErr.message}` : 'Unknown error';
			console.error(`Failed to send error reply: ${replyMsg}`);
		}
	});

	return bot;
}
