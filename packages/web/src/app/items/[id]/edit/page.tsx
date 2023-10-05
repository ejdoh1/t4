"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import Loader from "~/components/common/loader";
import { api } from "~/utils/api";
import ItemForm from "~/components/items/form";

const getTruncatedTitleWithEllipsis = (title: string) => {
  if (title.length > 20) {
    return title.slice(0, 30) + "...";
  }
  return title;
};

export default function Page() {
  const params = useParams();
  const id = params?.id as string;

  const { data, error, isLoading } = api.items.get.useQuery({
    id,
  });

  if (isLoading) {
    return <Loader text="Loading item" />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="breadcrumbs text-sm text-gray-500">
      <ul>
        <li>
          <Link href="/items">Items</Link>
        </li>
        <li>
          <Link href={`/items/${id}/view`}>
            {getTruncatedTitleWithEllipsis(data.name)}
          </Link>
        </li>
        <li>Edit</li>
      </ul>
      <ItemForm title="Edit item" item={data} mode="edit" />
    </div>
  );
}
