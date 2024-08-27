"use client";
import React from "react";

import { useRouter } from "next/navigation";
import { LoginDetails } from "@/components/auth/login-details-form";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  return (
    <LoginDetails
      title="Register"
      submitTitle="Register"
      onSubmit={async ({ email, password }) => {
        if (!supabase) {
          throw new Error("Supabase has not been initialized yet");
        }
        const { error } = await supabase.auth.signUp({ email, password });

        if (error) {
          throw new Error(error.message);
        }

        router.push("/");
      }}
      secondaryActions={[
        { title: "Back", onClick: () => router.push("/auth/login") },
      ]}
    />
  );
}
