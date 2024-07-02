// import { ENUM_MODE } from "@/enum/Mode";

import { ENUM_MODE } from "@/enum/Mode";
import { EmptyTableData } from "./initialDataAndTypes";

// export const handleEditState = <T>(SL: number, data:T[], setterFunction:) => {
//   const nextData = [...data];
//   const activeItem = Object.assign({}, nextData[SL]);

//   if (activeItem) {
//     activeItem.status = activeItem.status ? "" : ENUM_MODE.EDIT;
//     nextData[SL] = activeItem;
//     setTableData(nextData);
//   }
// };
export function EmptyTableDataObject(this: any, tableData: EmptyTableData[]) {
  return {
    test: "",
    investigation: "",
    normalValue: "",
    unit: "",
    remark: "",
    status: ENUM_MODE.NEW,
    SL: tableData?.length ? tableData.length + 1 : 1,
    reportTypeGroup: "",
    defalultValue: [],
  };
}
