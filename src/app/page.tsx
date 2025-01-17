import Image from "next/image";
import { ChevronDown } from "lucide-react";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import SignIn from "@/components/sign-in";

export default async function Root() {
  const session = await auth();

  if (session) {
    return redirect("/home");
  }

  return (
    <div className="mt-10 flex justify-center px-4">
      <div className="text-center font-[family-name:var(--font-ibm-plex-sans)]">
        <p className="text-4xl font-bold text-primary">ToutDoux</p>
        <p className="mt-2 text-xs">/tu du/ adjective — (French) very soft.</p>
        <p className="mx-auto mt-10 max-w-lg">
          Toutdoux is a simple and minimalist to-do application developed to
          respond to a simple need.
        </p>

        <Image
          src="/screenshot.png"
          alt="Toutdoux screenshot"
          width={600}
          height={400}
          className="mt-10 rounded-md border border-primary/20 bg-white p-4 shadow-sm"
        />

        <div className="mt-10 flex flex-col items-center justify-center gap-2">
          <ChevronDown className="h-8 w-8 animate-bounce text-primary" />
          <SignIn session={session} />
        </div>

        <p className="mt-16 text-sm opacity-70 transition-opacity hover:opacity-100">
          Developed by{" "}
          <a
            href="https://jgengo.fr"
            className="text-primary underline underline-offset-4"
          >
            Jordane Gengo
          </a>
        </p>
      </div>
    </div>
  );
}
