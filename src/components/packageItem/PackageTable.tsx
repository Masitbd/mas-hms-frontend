import React from "react";
import { Table } from "rsuite";
import { Cell, HeaderCell } from "rsuite-table";
import Column from "rsuite/esm/Table/TableColumn";
import EditPackageModal from "./EditPackageModal";

export type TPackage = {
  _id: string;
  name: string;
  price: number;
};

type TPackageTable = {
  item: {
    data: TPackage[];
  };
  isLoading: boolean;
};

const PackageTable: React.FC<TPackageTable> = ({ item, isLoading }) => {
  return (
    <div className="mt-20">
      <Table
        data={item?.data}
        loading={isLoading}
        className="w-full"
        bordered
        cellBordered
        autoHeight
        wordWrap={"break-word"}
      >
        <Column align="center" flexGrow={2}>
          <HeaderCell>Package Name</HeaderCell>
          <Cell dataKey="name" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Price</HeaderCell>
          <Cell dataKey="price" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Action </HeaderCell>
          <Cell align="center">
            {(rowdate: TPackage) => (
              <div className="flex items-center gap-2">
                {/* <Button
                  appearance="primary"
                  color="red"
                  disabled={deletaing}
                  onClick={() => handleDelete(rowdate._id)}
                  startIcon={<TrashIcon />}
                /> */}

                <EditPackageModal item={rowdate} />
              </div>
            )}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default PackageTable;
