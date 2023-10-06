import React from "react";
import Link from "next/link";

const CreateButton = () => {
  return (
    <Link href="/apps/create" className="btn btn-primary btn-outline">
      Create
    </Link>
  );
};

export default CreateButton;
