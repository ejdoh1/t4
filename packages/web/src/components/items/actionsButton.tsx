import React from "react";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import { type itemsSchema } from "@t4/types";
import { type z } from "zod";
import { type RowSelectionState } from "@tanstack/react-table";

const ActionsButton = ({
  rowSelection,
  setRowSelection,
  refreshItems,
  items,
}: {
  rowSelection: RowSelectionState;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  refreshItems: () => Promise<void>;
  items: z.infer<typeof itemsSchema>;
}) => {
  const mutation = api.items.delete.useMutation();

  const deleteItems = async (selected: string[]) => {
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
      const item = items[parseInt(key)];
      if (item === undefined) return;
      tmp.push(item.id);
    });

    await toast.promise(deleteItems(tmp), {
      loading: "Deleting items...",
      success: () => {
        setRowSelection({});
        refreshItems().catch((err) => {
          console.error(err);
        });
        return "Items deleted";
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
            // if no items are selected, grey out the button
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
