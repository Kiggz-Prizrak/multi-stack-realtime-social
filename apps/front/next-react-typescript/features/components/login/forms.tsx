"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { login } from "@/features/api/auth";
import { isApiError } from "@/features/api/error";

type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);

    try {
      await login({
        email: values.email,
        password: values.password,
      });

      router.push("/home");
      router.refresh();
    } catch (error) {
      if (isApiError(error)) {
        setServerError(error.message);
        return;
      }

      setServerError("Une erreur est survenue.");
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Connexion
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Connecte-toi pour accéder à ton espace.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-zinc-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="john@exemple.com"
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-900"
            {...register("email", {
              required: "L’email est requis",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Adresse email invalide",
              },
            })}
          />
          {errors.email && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-700"
            >
              Mot de passe
            </label>

            <Link
              href="/forgot-password"
              className="text-sm text-zinc-500 underline underline-offset-4 hover:text-zinc-900"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-900"
            {...register("password", {
              required: "Le mot de passe est requis",
              minLength: {
                value: 6,
                message: "Minimum 6 caractères",
              },
            })}
          />
          {errors.password && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {serverError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </button>

        <p className="text-center text-sm text-zinc-500">
          Pas encore de compte ?{" "}
          <Link
            href="/signup"
            className="font-medium text-zinc-900 underline underline-offset-4"
          >
            Créer un compte
          </Link>
        </p>
      </form>
    </div>
  );
}
