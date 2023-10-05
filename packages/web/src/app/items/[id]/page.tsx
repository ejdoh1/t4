"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
// import ProductViewForm from "~/components/productViewForm";
import { api } from "~/utils/api";

const getTruncatedTitleWithEllipsis = (title: string) => {
  if (title.length > 20) {
    return title.slice(0, 30) + "...";
  }
  return title;
};

export default function Page() {
  const params = useParams();
  //   const parsedParams = paramsSchema.parse(params);
  const id = params?.id as string;

  // const { data, error, isLoading } = api.items.get.useQuery({
  //   slug: id,
  // });

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>{error.message}</div>;
  // }

  return (
    <div className="m-auto mb-10 mt-10 w-full lg:w-3/4 xl:w-3/4">
      <div className="breadcrumbs text-sm text-gray-500">
        <ul>
          <li>
            <Link href="/items">Items</Link>
          </li>
          <li>
            <Link href={`/items/${id}`}>
              {getTruncatedTitleWithEllipsis(data.name)}
            </Link>
          </li>
          <li>View</li>
        </ul>
      </div>
      {/* <ProductViewForm data={data} /> */}
    </div>
  );
}
