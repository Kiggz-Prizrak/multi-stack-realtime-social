"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/context/auth-context";

export default function ProfileIndexPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;
    router.replace(`/profile/${user.id}`);
  }, [router, user?.id]);

  return null;
}
