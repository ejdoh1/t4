"use client";

import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { createItemRequestSchema, type CreateItemRequest } from "@t4/types";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import { routes } from "@t4/constants";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function CreateItemForm() {
  const [animationParent] = useAutoAnimate();
  const mutation = api.items.create.useMutation();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createItemRequestSchema),
  });

  const submitHandler: SubmitHandler<FieldValues> = async (data) => {
    const request = createItemRequestSchema.parse({
      name: data.name as string,
      description: data.description as string,
    } satisfies CreateItemRequest);

    try {
      await toast.promise(mutation.mutateAsync(request), {
        loading: "Creating item...",
        success: "Item created",
        error: "Failed to create item",
      });
      router.push(routes.enum.items);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <h1 className="text-center text-3xl font-semibold">Create an item</h1>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit(submitHandler)} ref={animationParent}>
        {/* register your input into the hook by invoking the "register" function */}
        <div>
          <label className="label">
            <span
              className="label-text text-base font-semibold text-gray-500
            "
            >
              Name
            </span>
          </label>
          <input
            className="input input-bordered input-primary w-full"
            {...register("name")}
          />
        </div>

        {errors.name?.message && (
          <p className="text-sm text-red-500">
            {errors.name?.message as string}
          </p>
        )}

        <div>
          <label className="label">
            <span className="label-text text-base font-semibold text-gray-500">
              Description
            </span>
          </label>
          {/* include validation with required or other standard HTML validation rules */}
          <textarea
            className="textarea textarea-bordered textarea-primary w-full"
            rows={3}
            {...register("description")}
          />
        </div>
        {/* errors will return when field validation fails  */}
        {errors.description?.message && (
          <p className="text-sm text-red-500">
            {errors.description?.message as string}
          </p>
        )}

        <div className="my-5"></div>

        <div className="join w-full">
          <Link
            href={routes.enum.items}
            className="btn btn-secondary join-item w-1/2"
          >
            Cancel
          </Link>
          <input type="submit" className="btn btn-primary join-item w-1/2" />
        </div>
      </form>
    </>
  );
}
