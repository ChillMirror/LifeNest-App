import { describe, expect, it } from 'vitest';
import { resolveRouterKey } from './routerKey';

describe('resolveRouterKey', () => {
	it('returns "unregistered" when no user row exists', () => {
		expect(resolveRouterKey(null)).toBe('unregistered');
		expect(resolveRouterKey(undefined)).toBe('unregistered');
	});

	it('returns "idle" when user row has state NULL', () => {
		expect(resolveRouterKey({ state: null })).toBe('idle');
	});

	it('falls back to "idle" when user row has an unknown state value', () => {
		expect(resolveRouterKey({ state: 'unknown_state' })).toBe('idle');
		expect(resolveRouterKey({ state: 'awaiting_something' })).toBe('idle');
		expect(resolveRouterKey({ state: '' })).toBe('idle');
	});
});
