"use client";

import React from "react";
import { Button, Table } from "rsuite";
import EditBedModal from "./EditBedModal";
import Swal from "sweetalert2";
import { useDeleteBedMutation } from "@/redux/api/bed.api";
const { Column, HeaderCell, Cell } = Table;
import TrashIcon from "@rsuite/icons/Trash";
import { useAppSelector } from "@/redux/hook";
type TWorld = {
  worldName: string;
  charge: number;
  fees: number;
  bedName: string;
  worldId?: {
    _id: string;
    worldName: string;
  } | null;
};

type TWorldTable = {
  worldData: { data: TWorld[] };
  isLoading: boolean;
};

const BedsTable: React.FC<TWorldTable> = ({ worldData, isLoading }) => {
  const [deleteBed, { isLoading: deletaing }] = useDeleteBedMutation();

  const currentUser = useAppSelector((state) => state.auth.user);

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await deleteBed(id).unwrap();

        if (res.success) {
          Swal.fire({
            toast: true,

            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            title: "Your file has been deleted.",
            icon: "success",
          });
        }

        //

        //
      }
    });
  };

  return (
    <div className="mt-20">
      <Table
        data={worldData?.data}
        loading={isLoading}
        className="w-full"
        bordered
        cellBordered
        autoHeight
        wordWrap={"break-word"}
      >
        <Column align="center" flexGrow={2}>
          <HeaderCell>Bed Name</HeaderCell>
          <Cell dataKey="bedName" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Floor</HeaderCell>
          <Cell dataKey="floor" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Phone</HeaderCell>
          <Cell dataKey="phone" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>is Allocated</HeaderCell>
          <Cell>
            {(rowData) => (
              <span
                className={
                  rowData?.isAllocated ? "text-red-600" : "text-green-500"
                }
              >
                {rowData?.isAllocated ? "Allocated" : "Not Allocated"}
              </span>
            )}
          </Cell>
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>World Name</HeaderCell>
          <Cell>
            {(rowData) => (rowData.worldId ? rowData.worldId.worldName : "N/A")}
          </Cell>
        </Column>

        {currentUser?.role === "super-admin" && (
          <Column flexGrow={2}>
            <HeaderCell>Action</HeaderCell>
            <Cell>
              {(rowData) => (
                <div className="flex gap-2 items-center">
                  <EditBedModal item={rowData} />
                  <Button
                    appearance="primary"
                    color="red"
                    size="sm"
                    disabled={deletaing}
                    onClick={() => handleDelete(rowData._id)}
                    startIcon={<TrashIcon />}
                  />
                </div>
              )}
            </Cell>
          </Column>
        )}
      </Table>
    </div>
  );
};

export default BedsTable;
