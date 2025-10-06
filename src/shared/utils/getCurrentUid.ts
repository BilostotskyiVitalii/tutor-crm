import { auth } from '@/app/firebase';

export function getCurrentUid(): string {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user logged in');
  }
  return user.uid;
}
