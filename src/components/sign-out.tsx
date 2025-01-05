"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/libs/utils";

interface SignOutProps {
  className?: string;
}

const SignOut = ({ className }: SignOutProps) => {
  return (
    <Button onClick={() => signOut()} className={cn(className)}>
      Sign out
    </Button>
  );
};

export default SignOut;
