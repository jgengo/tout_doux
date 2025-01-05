import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    return redirect("/");
  }

  return <div>{children}</div>;
}
