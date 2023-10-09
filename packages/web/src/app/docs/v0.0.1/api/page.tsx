"use client";
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
  return <RedocStandalone spec={docs.data} />;
}
