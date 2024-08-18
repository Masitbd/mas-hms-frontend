import { useGetMiscQuery } from "@/redux/api/miscellaneous/miscellaneousSlice";
import React, { SetStateAction } from "react";
import { SelectPicker, Table } from "rsuite";
import { Isensitivity, ITEstREsultForMicroBio } from "./initialDataAndTypes";
import { useGetSensitivityQuery } from "@/redux/api/sensitivity/sensitivitySlict";
import { ISensitivity } from "../bactrologicalInfo/typesAndInitialData";

const MicroSEnsitivityOp = (props: {
  result: ITEstREsultForMicroBio;
  setResult: React.Dispatch<SetStateAction<ITEstREsultForMicroBio>>;
}) => {
  const { result, setResult } = props;
  const { data: senditivityData, isLoading: sensitivityLoading } =
    useGetSensitivityQuery(undefined);

  const sensitivityOption = ["R", "S", "M", "W"];

  const { Cell, Column, ColumnGroup, HeaderCell } = Table;

  const hanldeChange = (
    rowData: ISensitivity,
    key: keyof ISensitivity,
    value: string
  ) => {
    const Newdata: ITEstREsultForMicroBio = JSON.parse(
      JSON.stringify(props.result)
    );
    if (result?.sensivityOptions && result?.sensivityOptions.length > 0) {
      const doesExistso = result?.sensivityOptions.find(
        (data: ISensitivity) => data.id == rowData.id
      );

      if (doesExistso) {
        const doesExists = { ...doesExistso };
        const index = result?.sensivityOptions.findIndex(
          (data: ISensitivity) => data.id == rowData.id
        );
        doesExists[key] = value;
        Newdata.sensivityOptions?.splice(index, 1, doesExists);
      } else {
        Newdata.sensivityOptions = [
          ...(Newdata.sensivityOptions as ISensitivity[]),
          {
            id: rowData.id,
            value: rowData.value,
            [key]: value,
            mic: rowData.mic,
            breakPoint: rowData.breakPoint,
          },
        ];
      }
    } else {
      Newdata.sensivityOptions = [
        {
          id: rowData.id,
          value: rowData.value,
          [key]: value,
          mic: rowData.mic,
          breakPoint: rowData.breakPoint,
        },
      ];
    }
    setResult(Newdata);
  };

  const defaultValueFinder = (
    rowData: ISensitivity,
    key: keyof ISensitivity
  ) => {
    const doesExists = result?.sensivityOptions?.find(
      (data: ISensitivity) => data.id == rowData._id
    );
    return doesExists?.[key] || "";
  };

  const handleClean = (rowData: ISensitivity) => {
    const newData: ITEstREsultForMicroBio = JSON.parse(JSON.stringify(result));
    const index = result?.sensivityOptions?.findIndex(
      (data: ISensitivity) => data.id == rowData._id
    );

    newData.sensivityOptions?.splice(index as number, 1);

    setResult(newData);
  };

  return (
    <div className="mb-5 mx-5 border rounded-md shadow-lg">
      <div className="bg-[#3498ff] text-white px-2 py-2">
        <h2 className="text-center text-xl font-semibold">
          Sensitivity Options
        </h2>
      </div>

      <div className="gird grid-cols-12 gap-5 px-2 py-2">
        <Table
          loading={sensitivityLoading}
          data={senditivityData?.data}
          rowHeight={60}
          autoHeight
        >
          <Column flexGrow={3}>
            <HeaderCell>Sensivity</HeaderCell>
            <Cell dataKey="value" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>MIC</HeaderCell>
            <Cell dataKey={"mic"} />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Interpretation</HeaderCell>
            <Cell>
              {(rowData) => {
                return (
                  <SelectPicker
                    data={sensitivityOption.map((data: string) => ({
                      label: data,
                      value: data,
                    }))}
                    searchable={false}
                    size="sm"
                    onChange={(value) => {
                      const nRowData = {
                        ...rowData,
                        id: rowData._id,
                      };
                      hanldeChange(
                        nRowData as ISensitivity,
                        "interpretation",
                        value as string
                      );
                    }}
                    defaultValue={defaultValueFinder(
                      rowData as ISensitivity,
                      "interpretation"
                    )}
                    onClean={(value) => {
                      handleClean(rowData as ISensitivity);
                    }}
                  />
                );
              }}
            </Cell>
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Break Point</HeaderCell>
            <Cell dataKey="breakPoint" />
          </Column>
        </Table>
      </div>
    </div>
  );
};

export default MicroSEnsitivityOp;
