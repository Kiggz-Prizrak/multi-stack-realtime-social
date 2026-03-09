import { apiFetch } from "./http";
import type { AuthResponse, ApiMessageResponse } from "./types";

export type LoginInput = {
  email: string;
  password: string;
};

export type SignupInput = {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: File;
};

export type MeResponse = {
  user: {
    id: number;
    email: string;
    username: string;
    firstName?: string | null;
    lastName?: string | null;
    avatar?: string | null;
    isAdmin?: boolean;
  };
};

export async function getMe() {
  return apiFetch<MeResponse>("users/me");
}

export async function signup(input: SignupInput) {
  const formData = new FormData();

  formData.append("email", input.email);
  formData.append("password", input.password);
  formData.append("username", input.username);

  if (input.firstName) formData.append("firstName", input.firstName);
  if (input.lastName) formData.append("lastName", input.lastName);
  if (input.avatar) formData.append("avatar", input.avatar);

  return apiFetch<AuthResponse>("users/signup", {
    method: "POST",
    body: formData,
  });
}

export async function login(input: LoginInput) {
  return apiFetch<AuthResponse>("users/login", {
    method: "POST",
    body: input,
  });
}

export async function logout() {
  return apiFetch<ApiMessageResponse>("users/logout", {
    method: "POST",
  });
}
