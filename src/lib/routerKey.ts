export type RouteKey = 'unregistered' | 'idle';

export interface UserStateInput {
	state: string | null;
}

const KNOWN_STATES = new Set<RouteKey>(['idle']);

export function resolveRouterKey(user: UserStateInput | null | undefined): RouteKey {
	if (!user) {
		return 'unregistered';
	}

	if (user.state === null) {
		return 'idle';
	}

	if (KNOWN_STATES.has(user.state as RouteKey)) {
		return user.state as RouteKey;
	}

	return 'idle';
}
