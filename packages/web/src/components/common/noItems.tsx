import Link from "next/link";

export default function NoItems({
  title = "Welcome",
  description = "Get started by creating your first item.",
  href = "/items/create",
  buttonText = "Create an item",
}: {
  title: string;
  description: string;
  href: string;
  buttonText: string;
}) {
  // button to navigate to create recipe page
  return (
    <div className="hero-content text-center">
      <div className="max-w-md">
        <h1 className="text-5xl font-bold">{title}</h1>
        <p className="py-6">{description}</p>
        <Link href={href} className="btn btn-primary">
          {buttonText}
        </Link>
      </div>
    </div>
  );
}
