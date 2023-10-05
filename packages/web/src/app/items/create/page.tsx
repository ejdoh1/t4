// "use client";
import Link from "next/link";
import CreateItemForm from "~/components/items/createForm";

export default function Page() {
  return (
    <div>
      <div className="breadcrumbs text-sm text-gray-500">
        <ul>
          <li>
            <Link href="/home">Items</Link>
          </li>
          <li>Create</li>
        </ul>
      </div>
      <CreateItemForm />
    </div>
  );
}
