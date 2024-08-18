import React, { SetStateAction } from "react";
import { Input, SelectPicker } from "rsuite";
import { ITEstREsultForMicroBio } from "./initialDataAndTypes";
import { resultSetterForMicroBio } from "./functions";
import { useGetMiscQuery } from "@/redux/api/miscellaneous/miscellaneousSlice";
import { IMiscellaneous } from "../bactrologicalInfo/typesAndInitialData";

const MicroGrowthOption = (props: {
  result: ITEstREsultForMicroBio;
  setResult: React.Dispatch<SetStateAction<ITEstREsultForMicroBio>>;
}) => {
  const compareValue = ["<", ">", "="];
  const { data: bacteriaData, isLoading: bacteriaLoading } = useGetMiscQuery({
    title: "bacteria",
  });
  return (
    <div className="mb-5 mx-5 border rounded-md shadow-lg">
      <div className="bg-[#3498ff] text-white px-2 py-2">
        <h2 className="text-center text-xl font-semibold">Growth Options</h2>
      </div>

      <div className="gird grid-cols-12 gap-5 px-2 py-2">
        <div className="col-span-6 grid grid-cols-12">
          <h3 className="font-semibold col-span-2">Colony Counts :</h3>
          <div className="col-span-5">
            {" "}
            <code className="text-lg">1 X {"  "}</code>
            <SelectPicker
              searchable={false}
              data={compareValue.map((value: string) => ({
                label: value,
                value: value,
              }))}
              cleanable={false}
              onChange={(value) => {
                props.setResult((prevValue: any) => {
                  return {
                    ...prevValue,
                    colonyCount: { ...prevValue.colonyCount, base: value },
                  };
                });
              }}
              defaultValue={props?.result?.colonyCount?.base}
            />
            <code className="text-xl">
              {" "}
              {"  "}10{"  "}
            </code>
            <sup className="inline-block w-16 ">
              {" "}
              <Input
                size="xs"
                type="number"
                onChange={(value) => {
                  props.setResult((prevValue: any) => {
                    return {
                      ...prevValue,
                      colonyCount: { ...prevValue.colonyCount, power: value },
                    };
                  });
                }}
                defaultValue={props?.result?.colonyCount?.power}
              />
            </sup>
            <code className="text-xl">
              {" "}
              {"  "}/Ml{"  "}
            </code>
          </div>
          <div className="col-span-5 grid grid-cols-12 ">
            <h3 className="font-semibold col-span-2">Bacterias</h3>
            <div className="col-span-10">
              <SelectPicker
                block
                loading={bacteriaLoading}
                data={bacteriaData?.data.map((data: IMiscellaneous) => ({
                  label: data.value,
                  value: data.value,
                }))}
                onChange={(value) =>
                  resultSetterForMicroBio(
                    "bacteria",
                    value as string,
                    props.result,
                    props.setResult
                  )
                }
                defaultValue={props.result?.bacteria}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicroGrowthOption;
