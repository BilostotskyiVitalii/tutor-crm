import { Request } from 'express';

import { admin } from '../firebase';

export async function extractUidFromBearer(req: Request): Promise<string> {
  const authHeader = req.headers.authorization?.trim() || '';
  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    throw new Error(
      'Missing or malformed Authorization header (expected "Bearer <token>")',
    );
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    throw new Error('Empty Bearer token');
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return decoded.uid;
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Invalid ID token: ${e.message}`);
    }
    throw new Error('Invalid ID token: unknown verification error');
  }
}
