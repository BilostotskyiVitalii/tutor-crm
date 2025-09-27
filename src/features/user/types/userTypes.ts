export interface UserProfile {
  id: string | null;
  email: string | null;
  token: string | null;
  nickName: string | null;
  createdAt: number | null;
  avatar: string | null;
  refreshToken?: string | null;
}
