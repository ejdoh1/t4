"use client";

import Card from "~/components/common/card";

export default function Page() {
  return (
    <Card
      title="Documentation"
      description="latest (v0.0.1)"
      href={"/docs/v0.0.1"}
      buttonText="Visit"
    />
  );
}
