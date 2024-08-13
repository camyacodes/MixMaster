export interface NewUser {
  name: string | File
  email: string | File
  password: string | File
}

export interface Credentials {
  email: string | File
  password: string | File
}
