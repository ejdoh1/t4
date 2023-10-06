import React from "react";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import { type appsSchema } from "@t4/types";
import { type z } from "zod";
import { type RowSelectionState } from "@tanstack/react-table";

const ActionsButton = ({
  rowSelection,
  setRowSelection,
  refreshApps,
  apps,
}: {
  rowSelection: RowSelectionState;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  refreshApps: () => Promise<void>;
  apps: z.infer<typeof appsSchema>;
}) => {
  const mutation = api.apps.delete.useMutation();

  const deleteApps = async (selected: string[]) => {
    await Promise.all(
      selected.map((id) => {
        return mutation.mutateAsync({
          id,
        });
      }),
    );
  };

  const handleDelete = async () => {
    // close dropdown with blur
    const elem = document.activeElement;
    if (elem instanceof HTMLElement) {
      elem.blur();
    }

    const tmp: string[] = [];
    Object.keys(rowSelection).forEach((key: string) => {
      if (rowSelection[key] === false) return;
      const app = apps[parseInt(key)];
      if (app === undefined) return;
      tmp.push(app.id);
    });

    await toast.promise(deleteApps(tmp), {
      loading: "Deleting apps...",
      success: () => {
        setRowSelection({});
        refreshApps().catch((err) => {
          console.error(err);
        });
        return "Apps deleted";
      },
      error: () => {
        return "Something went wrong";
      },
    });
  };

  return (
    <div className="dropdown dropdown-hover">
      <label tabIndex={0} className="btn btn-secondary btn-outline m-1">
        Actions
      </label>
      <ul
        tabIndex={0}
        className="menu dropdown-content rounded-box z-[1] w-52 bg-base-100 p-2 shadow"
      >
        <li>
          <a
            // if no apps are selected, grey out the button
            className={
              Object.keys(rowSelection).length === 0
                ? "btn-disabled opacity-50"
                : ""
            }
            onClick={() => {
              void (async () => {
                await handleDelete();
              })();
            }}
          >
            Delete
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ActionsButton;
