import 'server-only';

import crypto from 'crypto';

import { env } from '@/env/server';

const ENCRYPTION_KEY = env.VERIFICATION_SECRET;
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

function getKey(salt: Buffer): Buffer {
	return crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, ITERATIONS, KEY_LENGTH, 'sha256');
}

export function encrypt(text: string): string {
	if (!text) return '';

	try {
		// Generate a random salt
		const salt = crypto.randomBytes(SALT_LENGTH);
		// Generate a random initialization vector
		const iv = crypto.randomBytes(IV_LENGTH);
		// Generate key using the salt
		const key = getKey(salt);

		// Create cipher
		const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

		// Encrypt the text
		const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

		// Get the auth tag
		const tag = cipher.getAuthTag();

		// Combine everything into a single buffer
		const result = Buffer.concat([salt, iv, tag, encrypted]);

		// Return as base64 string
		return result.toString('base64');
	} catch (error) {
		console.error('Encryption error:', error);
		throw new Error('Failed to encrypt data');
	}
}

export function decrypt(encryptedText: string): string {
	if (!encryptedText) return '';

	try {
		// Convert from base64
		const buffer = Buffer.from(encryptedText, 'base64');

		// Validate buffer length
		const minLength = SALT_LENGTH + IV_LENGTH + TAG_LENGTH;
		if (buffer.length < minLength) {
			throw new Error('Invalid encrypted data length');
		}

		// Extract the salt, iv, tag and encrypted data
		const salt = buffer.subarray(0, SALT_LENGTH);
		const iv = buffer.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
		const tag = buffer.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
		const encrypted = buffer.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

		// Generate key using the salt
		const key = getKey(salt);

		// Create decipher
		const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
		decipher.setAuthTag(tag);

		// Decrypt the text
		const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

		// Return as string
		return decrypted.toString('utf8');
	} catch (error) {
		console.error('Decryption error:', error);
		return '';
	}
}
