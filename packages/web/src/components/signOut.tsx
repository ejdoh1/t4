"use client";
import { useSession } from "next-auth/react";
import { signOut, signIn } from "next-auth/react";

export default function SignInOut() {
  const { status } = useSession();

  if (status === "unauthenticated") {
    return (
      <a
        onClick={() =>
          void signIn("cognito", {
            callbackUrl: "/home",
          })
        }
      >
        Sign in
      </a>
    );
  }

  return (
    <a
      onClick={(e) => {
        e.preventDefault();
        void (async () => {
          await signOut({
            callbackUrl: "/",
          });
        })();
      }}
    >
      Sign out
    </a>
  );
}
