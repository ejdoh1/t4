"use client";
import Link from "next/link";
import { api } from "~/utils/api";
import { RedocStandalone } from "redoc";
import Loader from "~/components/common/loader";

export default function Page() {
  const docs = api.apiDocs.getDocs.useQuery({
    version: "0.0.1",
  });
  if (docs.isLoading) {
    return <Loader text="Loading API docs..." />;
  }
  if (docs.error) {
    return <div>Error: {docs.error.message}</div>;
  }
  return (
    <div>
      <div className="breadcrumbs text-sm text-gray-500">
        <ul>
          <li>
            <Link href="/docs">Docs</Link>
          </li>
          <li>
            <Link href={`/docs/v0.0.1/api`}>API</Link>
          </li>
        </ul>
      </div>
      <RedocStandalone spec={docs.data} />
    </div>
  );
}
