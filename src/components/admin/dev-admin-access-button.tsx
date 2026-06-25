"use client";

import { useUser } from "@clerk/nextjs";
import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/button";

export function DevAdminAccessButton() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [pending, setPending] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  async function enableAdminAccess() {
    if (!user) {
      setMessage("Sign in first, then enable local admin access.");
      return;
    }

    setPending(true);
    setMessage(null);

    try {
      await user.updateMetadata({
        unsafeMetadata: {
          role: "ADMIN",
        },
      });
      await user.reload();
      router.refresh();
      router.push("/admin");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not enable local admin access.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-5 rounded-md border border-[#f4b63f] bg-[#fff8ec] p-4">
      <p className="text-sm font-bold text-[#2b1b12]">Local testing shortcut</p>
      <p className="mt-1 text-xs leading-5 text-[#654332]">
        This button only works in development. It marks your current Clerk user
        as an admin for local testing.
      </p>
      <Button
        type="button"
        className="mt-3"
        disabled={!isLoaded || !isSignedIn || pending}
        onClick={enableAdminAccess}
      >
        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        {pending ? "Enabling..." : "Enable admin access"}
      </Button>
      {!isSignedIn && isLoaded ? (
        <p className="mt-2 text-xs text-[#b8322b]">Sign in before using this shortcut.</p>
      ) : null}
      {message ? <p className="mt-2 text-xs text-[#b8322b]">{message}</p> : null}
    </div>
  );
}
