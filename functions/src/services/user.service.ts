import { admin, db } from '../firebase';

import { AuthService } from './auth/auth.service';

type UserUpdates = {
  email?: string;
  nickName?: string;
  avatar?: string | null;
};

type UpdatedUser = {
  id: string;
  email?: string;
  nickName?: string;
  avatar?: string | null;
};

export const UserService = {
  async update(uid: string, updates: UserUpdates): Promise<{ user: UpdatedUser; jwt?: string }> {
    const userUpdates: UpdatedUser = { id: uid };
    const dbUpdates: Partial<UserUpdates> = {};

    if (updates.email) {
      await admin.auth().updateUser(uid, { email: updates.email });
      userUpdates.email = updates.email;
      dbUpdates.email = updates.email;
    }

    if (updates.nickName) {
      await admin.auth().updateUser(uid, { displayName: updates.nickName });
      userUpdates.nickName = updates.nickName;
      dbUpdates.nickName = updates.nickName;
    }

    if (updates.avatar !== undefined) {
      dbUpdates.avatar = updates.avatar;
      userUpdates.avatar = updates.avatar;
    }

    if (Object.keys(dbUpdates).length > 0) {
      await db.collection('users').doc(uid).update(dbUpdates);
    }

    const jwt = updates.email ? AuthService.createJwt(uid, updates.email) : undefined;

    return { user: userUpdates, jwt };
  },
};
