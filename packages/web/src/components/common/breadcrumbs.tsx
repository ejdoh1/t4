"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Loader from "./loader";

// match the pathname to the enum title

const truncateTitle = (title: string) => {
  if (title.length > 10) {
    return title.slice(0, 10) + "...";
  }
  return title;
};

const uppercaseFirstLetterIfNotUuid = (string: string) => {
  if (string.length === 36) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getListItem = ({ href, title }: { href: string; title: string }) => {
  if (!href.startsWith("/")) href = "/" + href;
  return (
    <li key={href}>
      <Link href={href}>
        {truncateTitle(uppercaseFirstLetterIfNotUuid(title))}
      </Link>
    </li>
  );
};

const getListItems = (pathname: string) => {
  const paths = pathname.split("/").filter((path) => path !== "");
  const listItems = paths.map((path, index) => {
    const href = paths.slice(0, index + 1).join("/");
    const title = path;
    return getListItem({ href, title });
  });
  return listItems;
};

const Breadcrumbs = () => {
  const pathname = usePathname();
  if (!pathname) return <Loader text="" />;
  return (
    <div className="breadcrumbs bg-base-200 px-5 text-sm text-gray-500">
      <ul>{getListItems(pathname)}</ul>
    </div>
  );
};

export default Breadcrumbs;
