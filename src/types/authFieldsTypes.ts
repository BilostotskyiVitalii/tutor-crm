export interface LoginField {
  email: string;
  password: string;
}

export interface RegField extends LoginField {
  nickName: string;
}
