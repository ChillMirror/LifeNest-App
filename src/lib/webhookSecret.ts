export type SecretVerificationResult =
	| { valid: true }
	| { valid: false; reason: 'secret not configured' | 'missing header' | 'invalid secret' };

export function verifyWebhookSecret(
	received: string | null | undefined,
	expected: string | undefined,
): SecretVerificationResult {
	if (!expected) {
		return { valid: false, reason: 'secret not configured' };
	}

	if (received === null || received === undefined) {
		return { valid: false, reason: 'missing header' };
	}

	const encoder = new TextEncoder();
	const receivedBytes = encoder.encode(received);
	const expectedBytes = encoder.encode(expected);

	let mismatch = receivedBytes.length ^ expectedBytes.length;

	for (let i = 0; i < expectedBytes.length; i++) {
		const r = i < receivedBytes.length ? receivedBytes[i] : 0;
		mismatch |= r ^ expectedBytes[i];
	}

	if (mismatch !== 0) {
		return { valid: false, reason: 'invalid secret' };
	}

	return { valid: true };
}
