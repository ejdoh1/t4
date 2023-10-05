"use client";

import Card from "~/components/common/card";
import { routes } from "@t4/constants";

export default function Page() {
  return (
    <Card
      title="API Docs"
      description="View the API documentation."
      href={"/docs/v0.0.1/api"}
      buttonText="Visit"
    />
  );
}
