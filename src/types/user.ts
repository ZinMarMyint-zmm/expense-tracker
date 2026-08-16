export interface User{
    id: string,
    name: string,
    email: string,
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface CreateUserInput{
    name: string,
    email: string,
    password:string
}