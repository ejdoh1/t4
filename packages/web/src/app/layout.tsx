"use client";

import React from "react";
import "~/styles/globals.css";
import Drawer from "~/components/common/drawer";
import { Toaster } from "react-hot-toast";
import { api } from "~/utils/api";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { constants } from "@t4/constants";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="cupcake">
      <Head>
        <title>{constants.enum.displayName}</title>
      </Head>
      <body>
        <Toaster />
        <SessionProvider>
          <Drawer>{children}</Drawer>
        </SessionProvider>
      </body>
    </html>
  );
}

export default api.withTRPC(RootLayout);
