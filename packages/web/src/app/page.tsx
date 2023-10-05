"use client";

import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Page() {
  const { status } = useSession();

  return (
    <div className="hero bg-base-200 h-screen">
      <div className="hero-content text-center">
        <div className="w-full">
          <h1 className="text-5xl font-extrabold sm:text-[5rem]">
            Manage <span className="text-primary">Items</span>{" "}
            <span className="text-secondary">like</span>{" "}
            <span className="text-accent">never before</span>
          </h1>
          <p className="py-6"></p>
          {status === "loading" && (
            <button className="btn btn-primary w-32">
              <span className="loading loading-sm" />
            </button>
          )}
          {status === "authenticated" && (
            <Link className="btn btn-primary w-32" href="/home">
              Home
            </Link>
          )}
          {status === "unauthenticated" && (
            <button
              className="btn btn-primary w-32"
              onClick={() =>
                void signIn("cognito", {
                  callbackUrl: "/home",
                })
              }
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
