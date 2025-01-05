"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";

const SignOut = ({ session }: { session: Session | null }) => {
  if (!session) {
    return null;
  }
  return (
    <Button size="lg" onClick={() => signOut()}>
      Sign out
    </Button>
  );
};

export default SignOut;
