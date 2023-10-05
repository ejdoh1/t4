"use client";

import Card from "~/components/common/card";
import { routes } from "@t4/constants";

export default function Page() {
  return (
    <Card
      title="Items"
      description="Add, edit, and delete items."
      href={routes.enum.items}
      buttonText="Manage items"
    />
  );
}
