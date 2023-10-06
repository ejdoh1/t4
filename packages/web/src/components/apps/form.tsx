"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { routes } from "@t4/constants";
import {
  createAppRequestSchema,
  type CreateAppRequest,
  type App,
} from "@t4/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

const SubmitButton = () => (
  <div className="join w-full">
    <Link href={routes.enum.apps} className="btn btn-secondary join-item w-1/2">
      Cancel
    </Link>
    <input type="submit" className="btn btn-primary join-item w-1/2" />
  </div>
);

export default function AppForm({
  title = "Create an app",
  mode = "create",
  app,
}: {
  title?: string;
  mode?: "create" | "edit" | "view";
  app?: App;
}) {
  const [animationParent] = useAutoAnimate();
  const mutationCreate = api.apps.create.useMutation();
  const mutationUpdate = api.apps.update.useMutation();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createAppRequestSchema),
    defaultValues: app,
  });

  const submitHandler: SubmitHandler<FieldValues> = async (data) => {
    const request = createAppRequestSchema.parse({
      name: data.name as string,
    } satisfies CreateAppRequest);

    try {
      mode === "create" &&
        (await toast.promise(
          mutationCreate.mutateAsync({
            request,
          }),
          {
            loading: "Creating app...",
            success: "App created",
            error: "Failed to create app",
          },
        ));

      if (mode === "edit") {
        if (!app?.id) {
          throw new Error("App id is missing");
        }
        await toast.promise(
          mutationUpdate.mutateAsync({
            id: app?.id,
            request,
          }),
          {
            loading: "Updating app...",
            success: "App updated",
            error: "Failed to update app",
          },
        );
      }
      router.push(routes.enum.apps);
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

        <div className="my-5"></div>

        {mode === "create" && <SubmitButton />}
        {mode === "edit" && <SubmitButton />}
        {mode === "view" && (
          <div className="w-full">
            <Link
              href={routes.enum.apps + "/" + app?.id + "/edit"}
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
