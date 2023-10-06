"use client";

import Card from "~/components/common/card";
import { routes } from "@t4/constants";

export default function Page() {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 2xl:grid-cols-3">
      <Card
        title="Items"
        description="Create, edit, and delete items."
        href={routes.enum.items}
        buttonText="Manage items"
      />
      <Card
        title="Apps"
        description="Create, edit, and delete apps."
        href={routes.enum.apps}
        buttonText="Manage apps"
      />
      <Card
        title="Docs"
        description="View the documentation."
        href={routes.enum.docs}
        buttonText="View docs"
      />
    </div>
  );
}
