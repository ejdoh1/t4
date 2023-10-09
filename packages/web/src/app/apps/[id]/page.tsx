"use client";
import { useParams } from "next/navigation";
import Loader from "~/components/common/loader";
import { api } from "~/utils/api";
import AppForm from "~/components/apps/form";

export default function Page() {
  const params = useParams();
  const id = params?.id as string;

  const app = api.apps.get.useQuery({
    id,
  });
  const secret = api.apps.getClientSecret.useQuery({
    id,
  });

  if (app.isLoading || secret.isLoading) {
    return <Loader text="Loading app" />;
  }

  if (app.isError || secret.isError) {
    return <>Error</>;
  }

  return (
    <AppForm title="View app" app={app.data} mode="view" secret={secret.data} />
  );
}
