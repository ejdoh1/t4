import Link from "next/link";

const Card = ({
  title,
  description,
  href,
  buttonText,
}: {
  title: string;
  description: string;
  href: string;
  buttonText: string;
}) => {
  return (
    <div className="card card-compact w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
        <div className="card-actions justify-end">
          <Link href={href} className="btn btn-primary">
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
