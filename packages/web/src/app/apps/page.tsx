"use client";
import { type RowSelectionState } from "@tanstack/react-table";
import { useState } from "react";
import Loader from "~/components/common/loader";
import NoItems from "~/components/common/noItems";
import ActionsButton from "~/components/apps/actionsButton";
import CreateButton from "~/components/apps/createButton";
import ItemsTable from "~/components/apps/table";
import { api } from "~/utils/api";

export default function Page() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const apps = api.apps.list.useQuery();

  if (apps.isLoading) {
    return <Loader text="Loading apps" />;
  }

  if (apps.isError) {
    return <>Error</>;
  }

  if (apps.data.length === 0) {
    return (
      <NoItems
        title="No apps"
        description="Create an app to get started."
        href="/apps/create"
        buttonText="Create app"
      />
    );
  }

  const refreshItems = async () => {
    await apps.refetch();
  };

  return (
    <>
      <h1 className="mx-3 text-2xl font-bold">Apps</h1>

      <div className="float-right mr-3">
        <CreateButton />
        <ActionsButton
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          refreshItems={refreshItems}
          items={apps.data}
        />
      </div>
      <ItemsTable
        data={apps.data}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
    </>
  );
}
