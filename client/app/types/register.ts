export type RegisterDTO = {
  username: string
  email: string
  password: string
}

export type RegisterResponse =
  | { ok: true }
  | { ok: false; status?: number; message: string }