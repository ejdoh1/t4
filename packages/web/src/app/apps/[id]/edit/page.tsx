"use client";
// import Link from "next/link";
import { useParams } from "next/navigation";
import Loader from "~/components/common/loader";
import { api } from "~/utils/api";
import AppForm from "~/components/apps/form";

// const getTruncatedTitleWithEllipsis = (title: string) => {
//   if (title.length > 20) {
//     return title.slice(0, 30) + "...";
//   }
//   return title;
// };

export default function Page() {
  const params = useParams();
  const id = params?.id as string;

  const { data, error, isLoading } = api.apps.get.useQuery({
    id,
  });

  if (isLoading) {
    return <Loader text="Loading app" />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return <AppForm title="Edit app" app={data} mode="edit" />;
}
