import { describe, expect, it } from 'vitest';
import { verifyWebhookSecret } from './webhookSecret';

describe('verifyWebhookSecret', () => {
	const expected = 'super-secret-token-123';

	it('accepts a matching secret', () => {
		expect(verifyWebhookSecret(expected, expected)).toEqual({ valid: true });
	});

	it('rejects a wrong secret of the same length', () => {
		expect(verifyWebhookSecret('super-secret-token-124', expected)).toEqual({
			valid: false,
			reason: 'invalid secret',
		});
	});

	it('rejects when the header is missing (null or undefined)', () => {
		expect(verifyWebhookSecret(null, expected)).toEqual({
			valid: false,
			reason: 'missing header',
		});
		expect(verifyWebhookSecret(undefined, expected)).toEqual({
			valid: false,
			reason: 'missing header',
		});
	});

	it('rejects a secret of different length', () => {
		expect(verifyWebhookSecret('short', expected)).toEqual({
			valid: false,
			reason: 'invalid secret',
		});
		expect(verifyWebhookSecret(`${expected}-longer`, expected)).toEqual({
			valid: false,
			reason: 'invalid secret',
		});
	});

	it('rejects an empty string when expected secret is configured', () => {
		expect(verifyWebhookSecret('', expected)).toEqual({
			valid: false,
			reason: 'invalid secret',
		});
	});

	it('rejects when the expected secret is undefined or empty', () => {
		expect(verifyWebhookSecret(expected, undefined)).toEqual({
			valid: false,
			reason: 'secret not configured',
		});
		expect(verifyWebhookSecret(null, undefined)).toEqual({
			valid: false,
			reason: 'secret not configured',
		});
		expect(verifyWebhookSecret('', '')).toEqual({
			valid: false,
			reason: 'secret not configured',
		});
	});
});
