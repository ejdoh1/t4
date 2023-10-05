"use client";

import { signOut } from "next-auth/react";

export default function Page() {
  return (
    <div className="hero-content text-center">
      <div className="w-full">
        <p className="py-6"></p>
        <button
          className="btn btn-primary"
          onClick={() =>
            void signOut({
              callbackUrl: "/",
            })
          }
        >
          Confirm Sign Out
        </button>
      </div>
    </div>
  );
}
