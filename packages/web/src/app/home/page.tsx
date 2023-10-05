"use client";
import ItemsTable from "~/components/items/table";
import Loader from "~/components/loader";
import { api } from "~/utils/api";

export default function Page() {
  const items = api.items.list.useQuery();

  if (items.isLoading) {
    return <Loader text="Loading items" />;
  }

  if (items.isError) {
    return <>Error</>;
  }

  return (
    <div className="xs:w-full m-auto mt-10 sm:w-full  md:w-full lg:w-3/4 xl:w-3/4">
      <ItemsTable data={items.data} />
    </div>
  );
}
