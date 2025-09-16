export interface ILoginField {
  email: string;
  password: string;
}

export interface IRegField extends ILoginField {
  nickName: string;
}
