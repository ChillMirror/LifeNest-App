import type { Context } from 'grammy';
import type { UserStateRow } from '../db/users';
import { MESSAGES } from '../telegram/messages';

export interface BotContext extends Context {
	user: UserStateRow | null;
	routeKey: 'unregistered' | 'idle';
}

export async function handleStart(ctx: BotContext): Promise<void> {
	if (!ctx.user) {
		await ctx.reply(MESSAGES.startUnregistered);
		return;
	}

	await ctx.reply(MESSAGES.startRegistered);
}
