export interface NewUser {
  name: string | File
  email: string | File
  password: string | File
}

export interface Credentials {
  email: string | File
  password: string | File
}

export interface ISetlist {
  _id: string
  songs: ISong[]
  name: string
  user: string
}

export interface ISong {
  intro_bpm: number
  name: string
  outro_bpm: number
  transition: string
  _id: string
}
