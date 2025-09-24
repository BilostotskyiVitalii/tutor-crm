export interface LoginField {
  email: string;
  password: string;
}

export interface IRegField extends LoginField {
  nickName: string;
}
