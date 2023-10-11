"use client";

import Card from "~/components/common/card";

export default function Page() {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 2xl:grid-cols-3">
      <Card
        title="API Docs"
        description="View the API documentation."
        href={"/docs/v0.0.1/api"}
        buttonText="Visit"
      />
      <Card
        title="Using the API"
        description="Learn how to use the API."
        href={"/docs/v0.0.1/using-the-api"}
        buttonText="Visit"
      />
    </div>
  );
}
