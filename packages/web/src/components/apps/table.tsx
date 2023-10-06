import { type Item } from "@t4/types";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type RowSelectionState,
} from "@tanstack/react-table";
import * as React from "react";
import IndeterminateCheckbox from "../common/indeterminateCheckbox";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useRouter } from "next/navigation";

export default function ItemsTable({
  data,
  rowSelection,
  setRowSelection,
}: {
  data: Item[];
  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState> | undefined;
}) {
  const router = useRouter();
  const [animationParent] = useAutoAnimate();
  const [hoveredRowId, setHoveredRowId] = React.useState<string | undefined>(
    undefined,
  );
  const columns = React.useMemo<ColumnDef<Item>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "Description",
        accessorKey: "description",
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="table">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody ref={animationParent}>
        {table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            // on hover, show the row's checkbox
            onMouseEnter={() => setHoveredRowId(row.id)}
            onMouseLeave={() => setHoveredRowId(undefined)}
            // show as dark if hovered and clickable
            className={
              hoveredRowId === row.id ? "cursor-pointer bg-base-300" : ""
            }
            onClick={(e) => {
              // make sure we're not clicking on the checkbox
              if (e.target instanceof HTMLInputElement) {
                return;
              }
              // if clicked Link, don't do anything
              if (e.target instanceof HTMLAnchorElement) {
                return;
              }

              if (hoveredRowId === row.id) {
                router.push(`/items/${row.original.id}/view`);
              }
            }}
          >
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        {table.getFooterGroups().map((footerGroup) => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.footer,
                      header.getContext(),
                    )}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    </table>
  );
}