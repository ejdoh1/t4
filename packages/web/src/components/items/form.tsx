"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { routes } from "@t4/constants";
import {
  createItemRequestSchema,
  type CreateItemRequest,
  type Item,
} from "@t4/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

export default function ItemForm({
  title = "Create an item",
  mode = "create",
  item,
}: {
  title?: string;
  mode?: "create" | "edit" | "view";
  item?: Item;
}) {
  const [animationParent] = useAutoAnimate();
  const mutationCreate = api.items.create.useMutation();
  const mutationUpdate = api.items.update.useMutation();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createItemRequestSchema),
    defaultValues: item,
  });

  const submitHandler: SubmitHandler<FieldValues> = async (data) => {
    const request = createItemRequestSchema.parse({
      name: data.name as string,
      description: data.description as string,
    } satisfies CreateItemRequest);

    try {
      mode === "create" &&
        (await toast.promise(
          mutationCreate.mutateAsync({
            request,
          }),
          {
            loading: "Creating item...",
            success: "Item created",
            error: "Failed to create item",
          },
        ));

      if (mode === "edit") {
        if (!item?.id) {
          throw new Error("Item id is missing");
        }
        await toast.promise(
          mutationUpdate.mutateAsync({
            id: item?.id,
            request,
          }),
          {
            loading: "Updating item...",
            success: "Item updated",
            error: "Failed to update item",
          },
        );
      }
      router.push(routes.enum.items);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <h1 className="text-center text-3xl font-semibold">{title}</h1>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit(submitHandler)} ref={animationParent}>
        {/* register your input into the hook by invoking the "register" function */}
        <div>
          <label className="label">
            <span className="label-text text-base font-semibold text-gray-500">
              Name
            </span>
          </label>
          <input
            className="input input-bordered input-primary w-full"
            readOnly={mode === "view"}
            {...register("name")}
          />
        </div>

        {errors.name?.message && (
          <p className="text-sm text-red-500">{errors.name?.message}</p>
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
            readOnly={mode === "view"}
            {...register("description")}
          />
        </div>
        {/* errors will return when field validation fails  */}
        {errors.description?.message && (
          <p className="text-sm text-red-500">{errors.description?.message}</p>
        )}

        <div className="my-5"></div>

        {mode === "create" ||
          (mode === "edit" && (
            <div className="join w-full">
              <Link
                href={routes.enum.items}
                className="btn btn-secondary join-item w-1/2"
              >
                Cancel
              </Link>
              <input
                type="submit"
                className="btn btn-primary join-item w-1/2"
              />
            </div>
          ))}
        {mode === "view" && (
          <div className="w-full">
            <Link
              href={routes.enum.items + "/" + item?.id + "/edit"}
              className="btn btn-primary w-full"
            >
              Edit
            </Link>
          </div>
        )}
      </form>
    </>
  );
}
