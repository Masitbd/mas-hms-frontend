"use client";

import React from "react";
import { Button, Table } from "rsuite";
import EditWorldModal from "./EditWorldModal";
import Swal from "sweetalert2";
import { useDeleteWorldsMutation } from "@/redux/api/world.api";
const { Column, HeaderCell, Cell } = Table;
import TrashIcon from "@rsuite/icons/Trash";

export type TWorld = {
  _id: string;
  worldName: string;
  charge: number;
  fees: number;
};

type TWorldTable = {
  worldData: { data: TWorld[] };
  isLoading: boolean;
};

const WoroldTable: React.FC<TWorldTable> = ({ worldData, isLoading }) => {
  const [deleteWorld, { isLoading: deletaing }] = useDeleteWorldsMutation();

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
        const res = await deleteWorld(id).unwrap();

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
          <HeaderCell>Bed Category Name</HeaderCell>
          <Cell dataKey="worldName" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Bed Charge</HeaderCell>
          <Cell dataKey="charge" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Admission Fees </HeaderCell>
          <Cell dataKey="fees" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Action </HeaderCell>
          <Cell align="center">
            {(rowdate: TWorld) => (
              <div className="flex items-center gap-2">
                <Button
                  appearance="primary"
                  color="red"
                  disabled={deletaing}
                  onClick={() => handleDelete(rowdate._id)}
                  startIcon={<TrashIcon />}
                />

                <EditWorldModal item={rowdate} />
              </div>
            )}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default WoroldTable;
