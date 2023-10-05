import React from "react";
import NavItems from "./navItems";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { constants } from "@t4/constants";

const Drawer = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  if (pathname === "/") {
    return <>{children}</>;
  }

  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar w-full bg-base-300">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2 text-lg font-bold">
            {/* link to home */}
            <Link href="/home" className="font-bold">
              {constants.enum.displayName}
            </Link>
          </div>
          <div className="hidden flex-none lg:block">
            <ul className="menu menu-horizontal">
              {/* Navbar menu content here */}
              <NavItems />
            </ul>
          </div>
        </div>
        <div className="xs:w-full m-auto mt-10 sm:w-full  md:w-full lg:w-3/4 xl:w-3/4">
          {children}
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu h-full w-80 bg-base-200 p-4">
          {/* Sidebar content here */}
          <NavItems />
        </ul>
      </div>
    </div>
  );
};

export default Drawer;
