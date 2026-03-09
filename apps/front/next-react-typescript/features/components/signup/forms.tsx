"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signup } from "@/features/api/auth";
import { isApiError } from "@/features/api/error";

type SignupFormValues = {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar: FileList;
};

export function SignupForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    defaultValues: {
      email: "",
      password: "",
      username: "",
      firstName: "",
      lastName: "",
    },
  });

  function updateAvatarPreview(files?: FileList | null) {
    const file = files?.[0];

    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  }

  async function onSubmit(values: SignupFormValues) {
    setServerError(null);

    try {
      await signup({
        email: values.email,
        password: values.password,
        username: values.username,
        firstName: values.firstName || undefined,
        lastName: values.lastName || undefined,
        avatar: values.avatar?.[0],
      });

      router.push("/login");
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
          Créer un compte
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Renseigne tes informations pour rejoindre la plateforme.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-100">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Aperçu avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm text-zinc-400">Avatar</span>
            )}
          </div>

          <label className="cursor-pointer rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50">
            Choisir une image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              {...register("avatar", {
                onChange: (event) =>
                  updateAvatarPreview(event.target.files as FileList),
              })}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="mb-1.5 block text-sm font-medium text-zinc-700"
            >
              Prénom
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="John"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-900"
              {...register("firstName")}
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="mb-1.5 block text-sm font-medium text-zinc-700"
            >
              Nom
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Doe"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-900"
              {...register("lastName")}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="username"
            className="mb-1.5 block text-sm font-medium text-zinc-700"
          >
            Nom d’utilisateur
          </label>
          <input
            id="username"
            type="text"
            placeholder="johndoe"
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-900"
            {...register("username", {
              required: "Le nom d’utilisateur est requis",
              minLength: {
                value: 3,
                message: "Minimum 3 caractères",
              },
            })}
          />
          {errors.username && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.username.message}
            </p>
          )}
        </div>

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
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-zinc-700"
          >
            Mot de passe
          </label>
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
          {isSubmitting ? "Création..." : "Créer mon compte"}
        </button>

        <p className="text-center text-sm text-zinc-500">
          Déjà inscrit ?{" "}
          <Link
            href="/login"
            className="font-medium text-zinc-900 underline underline-offset-4"
          >
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  );
}
