import { auth } from "@/auth";
import SignIn from "@/components/sign-in";
import { redirect } from "next/navigation";

export default async function Root() {
  const session = await auth();

  if (session) {
    return redirect("/home");
  }

  return (
    <div className="grid h-screen place-items-center gap-3">
      <div className="text-center font-[family-name:var(--font-ibm-plex-sans)]">
        <p className="text-4xl font-bold">Hello World</p>
        <p className="mt-2 text-sm">work in progress</p>
        <div className="mt-4">
          <SignIn session={session} />
        </div>
      </div>
    </div>
  );
}
