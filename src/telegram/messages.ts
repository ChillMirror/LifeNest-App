export const MESSAGES = {
	startUnregistered: [
		'Hey there 🌿 Welcome to LifeNest, your cozy little corner to check in with yourself.',
		'',
		"I'll gently remind you to log how you're feeling, and keep it all safe so you can look back whenever you like ☕",
		'',
		'To get started, pick a username and send:',
		'/register <username>',
		'',
		'It needs 8 to 24 characters: letters (a-z) and numbers only 🌙',
	].join('\n'),

	startRegistered: 'Welcome back 🌿 So nice to see you again ☕',

	freeTextUnregistered: [
		"Hmm, I don't think we've met yet 🌱",
		"To get cozy, send /register <username> and I'll set you up. Or send /start if you'd like the quick tour again ✨",
	].join('\n'),

	freeTextIdle: [
		"I'm not sure what to do with that one yet 🌿",
		"Soon you'll be able to log your mood right here ☕",
	].join('\n'),

	error: [
		'Oops, something went wrong on my side 🌧️',
		'Please try again in a moment ☕',
	].join('\n'),
} as const;
