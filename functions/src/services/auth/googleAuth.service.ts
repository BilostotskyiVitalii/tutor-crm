import { FieldValue } from 'firebase-admin/firestore';
import { OAuth2Client } from 'google-auth-library';

import { admin, db } from '../../firebase';

import { AuthService } from './auth.service';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, OAUTH_REDIRECT_URI } = process.env;
const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, OAUTH_REDIRECT_URI);

export const GoogleAuthService = {
  generateAuthUrl() {
    return client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['profile', 'email'],
    });
  },

  async handleCallback(code: string) {
    const { tokens } = await client.getToken(code);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      throw new Error('Google auth failed');
    }

    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(payload.email);
    } catch {
      userRecord = await admin.auth().createUser({
        email: payload.email,
        displayName: payload.name,
        photoURL: payload.picture,
      });
    }

    const uid = userRecord.uid;

    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      await db.collection('users').doc(uid).set({
        email: payload.email,
        nickName: payload.name,
        avatar: payload.picture,
        provider: 'google',
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    const jwt = AuthService.createJwt(uid, payload.email);

    return {
      jwt,
      user: {
        id: uid,
        email: payload.email,
        nickName: payload.name,
        avatar: payload.picture,
      },
    };
  },
};
