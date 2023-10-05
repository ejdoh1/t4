"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
// import { useSession } from "next-auth/react";

enum Pathnames {
  HOME = "/home",
  ITEMS = "/items",
  SIGN_OUT = "/signout",
}

const isActive = (pathname: string, path: Pathnames) => {
  return pathname === path.toString() ? "active" : "";
};

const NavItems = () => {
  // const { data: sessionData } = useSession();
  const pathname = usePathname();
  if (!pathname) return null;
  if (pathname === "/") return null;

  return (
    <>
      <li>
        <Link
          className={isActive(pathname, Pathnames.HOME)}
          href={Pathnames.HOME}
        >
          Home
        </Link>
      </li>
      <li>
        <Link
          className={isActive(pathname, Pathnames.ITEMS)}
          href={Pathnames.ITEMS}
        >
          Items
        </Link>
      </li>
      <li>
        <Link
          className={isActive(pathname, Pathnames.SIGN_OUT)}
          href={Pathnames.SIGN_OUT}
        >
          Sign Out
        </Link>
      </li>
    </>
  );
};

export default NavItems;
