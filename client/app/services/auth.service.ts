import { api } from "@/app/services/api"
import axios from "axios"

import type {
  RegisterDTO,
  RegisterResponse,
} from "../types/register"

import type {
  LoginDTO,
  LoginResponse,
} from "../types/login"

/* ---------------- REGISTER ---------------- */

export async function registerUser(
  data: RegisterDTO,
): Promise<RegisterResponse> {
  try {
    const response = await api.post(
      "/auth/register",
      data,
    )

    if (response.status === 201) {
      return { ok: true }
    }

    return {
      ok: false,
      message: "Erro ao criar conta",
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return {
        ok: false,
        status: error.response?.status,
        message:
          error.response?.data?.message ||
          "Credenciais inválidas. Tente novamente.",
      }
    }

    return {
      ok: false,
      message:
        "Erro inesperado ao criar conta",
    }
  }
}

/* ---------------- LOGIN ---------------- */

export async function loginUser(
  data: LoginDTO,
): Promise<LoginResponse> {
  try {
    await api.post("/auth/login", data)

    return { ok: true }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return {
        ok: false,
        status: error.response?.status,
        message:
          error.response?.data?.message ||
          "Erro ao fazer login",
      }
    }

    return {
      ok: false,
      message:
        "Erro inesperado ao fazer login",
    }
  }
}

/* ---------------- FORGOT PASSWORD ---------------- */

export async function forgotPassword(
  identifier: string,
) {
  try {
    await api.post(
      "/auth/forgot-password",
      {
        identifier,
      },
    )

    return {
      ok: true,
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return {
        ok: false,
        status: error.response?.status,
        message:
          error.response?.data?.message ||
          "Erro ao solicitar redefinição",
      }
    }

    return {
      ok: false,
      message:
        "Erro inesperado ao solicitar redefinição",
    }
  }
}

/* ---------------- RESET PASSWORD ---------------- */

export async function resetPassword(
  token: string,
  password: string,
) {
  try {
    await api.post(
      "/auth/reset-password",
      {
        token,
        password,
      },
    )

    return {
      ok: true,
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return {
        ok: false,
        status: error.response?.status,
        message:
          error.response?.data?.message ||
          "Erro ao redefinir senha",
      }
    }

    return {
      ok: false,
      message:
        "Erro inesperado ao redefinir senha",
    }
  }
}