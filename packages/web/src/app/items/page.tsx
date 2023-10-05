"use client";
import { type RowSelectionState } from "@tanstack/react-table";
import { useState } from "react";
import Loader from "~/components/common/loader";
import NoItems from "~/components/common/noItems";
import ActionsButton from "~/components/items/actionsButton";
import CreateButton from "~/components/items/createButton";
import ItemsTable from "~/components/items/table";
import { api } from "~/utils/api";

export default function Page() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const items = api.items.list.useQuery();

  if (items.isLoading) {
    return <Loader text="Loading items" />;
  }

  if (items.isError) {
    return <>Error</>;
  }

  if (items.data.length === 0) {
    return (
      <NoItems
        title="No items"
        description="Create an item to get started."
        href="/items/create"
        buttonText="Create item"
      />
    );
  }

  const refreshItems = async () => {
    await items.refetch();
  };

  return (
    <>
      <h1 className="mx-3 text-2xl font-bold">Items</h1>

      <div className="float-right mr-3">
        <CreateButton />
        <ActionsButton
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          refreshItems={refreshItems}
          items={items.data}
        />
      </div>
      <ItemsTable
        data={items.data}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
    </>
  );
}
