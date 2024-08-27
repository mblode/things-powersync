"use client";
import { LoginDetails } from "@/components/auth/login-details-form";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import React from "react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  return (
    <LoginDetails
      title="Login"
      submitTitle="Login"
      onSubmit={async (values) => {
        if (!supabase) {
          throw new Error("Supabase has not been initialized yet");
        }
        const { error } = await supabase.auth.signInWithPassword(values);

        if (error) {
          throw new Error(error.message);
        }

        router.push("/");
      }}
      secondaryActions={[
        {
          title: "Register",
          onClick: () => {
            router.push("/auth/register");
          },
        },
      ]}
    />
  );
}
