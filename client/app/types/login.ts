export type LoginDTO = {
  identifier: string
  password: string
}

export type LoginResponse =
  | { ok: true }
  | { ok: false; status?: number; message: string }