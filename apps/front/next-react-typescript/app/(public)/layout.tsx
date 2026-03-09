export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-2">
        <section className="hidden lg:block">
          <div className="max-w-md">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
              Realtime Social Platform
            </p>

            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-zinc-900">
              Connecte-toi, publie et échange en temps réel.
            </h1>

            <p className="mt-4 text-base leading-7 text-zinc-600">
              Une base propre pour gérer l’authentification, les posts, les
              messages et les profils.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center">
          {children}
        </section>
      </div>
    </main>
  );
}
