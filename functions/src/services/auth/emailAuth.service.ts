import { FieldValue } from 'firebase-admin/firestore';

import { admin, db } from '../../firebase';
import { axsAuth } from '../../utils/axsAuth';

import { AuthService } from './auth.service';

export const EmailAuthService = {
  async register(email: string, password: string, nickName: string) {
    const user = await admin.auth().createUser({
      email,
      password,
      displayName: nickName,
    });

    await db.collection('users').doc(user.uid).set({
      email,
      nickName,
      createdAt: FieldValue.serverTimestamp(),
      provider: 'email',
      avatar: null,
    });

    await axsAuth.post('accounts:signInWithPassword', {
      email,
      password,
      returnSecureToken: true,
    });

    const jwt = AuthService.createJwt(user.uid, email);

    return {
      user: {
        id: user.uid,
        email,
        nickName,
        avatar: null,
      },
      jwt,
    };
  },

  async login(email: string, password: string) {
    const { data } = await axsAuth.post('accounts:signInWithPassword', {
      email,
      password,
      returnSecureToken: true,
    });

    const jwt = AuthService.createJwt(data.localId, email);

    return { jwt, uid: data.localId };
  },
};
