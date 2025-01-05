"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";

const SignIn = ({ session }: { session: Session | null }) => {
  if (session) {
    return null;
  }
  return (
    <Button
      size="lg"
      onClick={() => signIn("google", { callbackUrl: "/home" })}
    >
      Sign in with Google
    </Button>
  );
};

export default SignIn;
