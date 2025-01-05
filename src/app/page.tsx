import { auth } from "@/auth";
import SignIn from "@/components/sign-in";
import SignOut from "@/components/sign-out";

export default async function Root() {
  const session = await auth();

  return (
    <div className="grid h-screen place-items-center gap-3">
      <div className="text-center font-[family-name:var(--font-ibm-plex-sans)]">
        <p className="text-4xl font-bold">
          Hello{" "}
          <span className="text-primary">{session?.user?.name || "World"}</span>
        </p>
        <p className="mt-2 text-sm">work in progress</p>
        <div className="mt-4">
          {session ? <SignOut /> : <SignIn session={session} />}
        </div>
      </div>
    </div>
  );
}
