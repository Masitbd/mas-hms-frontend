/* eslint-disable react/no-children-prop */
import React, { useState } from "react";
import { Button, Table } from "rsuite";
import NewAndPatchCDT from "./NewAndPatchCDT";
import { ENUM_MODE } from "@/enum/Mode";
import {
  IMiscellaneous,
  initalData,
  ISensitivity,
} from "./typesAndInitialData";
import {
  useDeleteMiscMutation,
  useGetMiscQuery,
} from "@/redux/api/miscellaneous/miscellaneousSlice";
import swal from "sweetalert";

const TableForCDTS = (props: { title: string }) => {
  const { title } = props;
  const { data: miscData, isLoading: miscLoading } = useGetMiscQuery({
    title: title,
  });
  const [remove, { isLoading: deleteLoading, isSuccess: deleteUsccess }] =
    useDeleteMiscMutation();
  const { Cell, Column, HeaderCell } = Table;
  const [open, setOpen] = useState(false);
  const [patchData, setPatchData] = useState<IMiscellaneous>(initalData);
  const [mode, setMode] = useState(ENUM_MODE.NEW);
  const deleteHandler = async (data: IMiscellaneous) => {
    const conf = await swal({
      title: "Are you sure?",
      text: "You will not be able to recover this data!",
      icon: "warning",
      buttons: true as unknown as boolean[],
      dangerMode: true,
    });

    if (conf && data?._id) {
      const result = await remove(data?._id as string);

      if ("data" in result) {
        swal("Success", "Deleted Successfully", "success");
      }
    }
  };
  return (
    <div>
      <div>
        <Button
          onClick={() => {
            setOpen(true);
            setMode(ENUM_MODE.NEW);
          }}
          color="blue"
          appearance="primary"
        >
          ADD {title}
        </Button>
      </div>
      <div>
        <NewAndPatchCDT
          defaultValue={patchData as IMiscellaneous}
          mode={mode}
          open={open}
          setData={setPatchData}
          setOpen={setOpen}
          title={title}
        />
      </div>
      <div>
        <Table data={miscData?.data} rowHeight={70} autoHeight>
          <Column flexGrow={2}>
            <HeaderCell children="Title" />
            <Cell dataKey="title" />
          </Column>
          <Column flexGrow={3}>
            <HeaderCell children="Value" />
            <Cell dataKey="value" />
          </Column>
          <Column flexGrow={4}>
            <HeaderCell children="Action" />
            <Cell>
              {(rowData: IMiscellaneous) => (
                <>
                  <Button
                    onClick={() => {
                      setPatchData(rowData);
                      setMode(ENUM_MODE.EDIT);
                      setOpen(true);
                    }}
                    className="mr-2"
                    appearance="primary"
                    color="blue"
                  >
                    Edit
                  </Button>
                  <Button
                    appearance="primary"
                    color="red"
                    onClick={() => {
                      deleteHandler(rowData);
                    }}
                  >
                    Delete
                  </Button>
                </>
              )}
            </Cell>
          </Column>
        </Table>
      </div>
    </div>
  );
};

export default TableForCDTS;
