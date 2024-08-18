import { useGetMiscQuery } from "@/redux/api/miscellaneous/miscellaneousSlice";
import { useGetSpecimenQuery } from "@/redux/api/specimen/specimenSlice";
import { ISpecimen } from "@/types/allDepartmentInterfaces";
import React, { SetStateAction, useEffect, useState } from "react";
import { Checkbox, Radio, SelectPicker } from "rsuite";
import SelectPickerForBactroINfo from "./SelectPickerForBactroINfo";
import { ITEstREsultForMicroBio } from "./initialDataAndTypes";
import { resultSetterForMicroBio } from "./functions";
import Loading from "@/app/loading";

const MIcro1stSection = (props: {
  result: ITEstREsultForMicroBio;
  setResult: React.Dispatch<SetStateAction<ITEstREsultForMicroBio>>;
  testLoading: boolean;
}) => {
  const { result, setResult } = props;
  const { data: specimenData, isLoading: specimenLoading } =
    useGetSpecimenQuery(undefined);

  if (props.testLoading) {
    return <Loading />;
  }
  return (
    <div className="grid grid-cols-12 gap-2 px-2 my-2 ">
      <div>
        <h3 className="font-semibold">Specimen: </h3>
      </div>
      <div className="col-span-6">
        <SelectPicker
          block
          data={specimenData?.data.map((data: ISpecimen) => ({
            label: data?.label,
            value: data?.label,
          }))}
          loading={specimenLoading}
          onChange={(value) =>
            resultSetterForMicroBio(
              "specimen",
              value as string,
              props.result,
              props.setResult
            )
          }
          defaultValue={props.result?.specimen}
        />
      </div>

      <div className="grid grid-cols-12 gap-2 col-start-2 col-span-6 border border-stone-300 py-2 px-2 rounded-md">
        <h3 className="col-span-2 font-semibold">Duration</h3>
        <div className="col-span-4">
          <SelectPickerForBactroINfo
            title="duration"
            result={result}
            setResult={setResult}
            key={1000}
          />
        </div>
        <h3 className="col-span-2 font-semibold"> Temperature</h3>
        <div className="col-span-4">
          <SelectPickerForBactroINfo
            title="Temperature"
            result={result}
            setResult={setResult}
          />
        </div>

        <div className="col-span-2 font-semibold">Condition</div>
        <div className="col-span-10">
          <SelectPickerForBactroINfo
            title="Condition"
            result={result}
            setResult={setResult}
          />
        </div>
      </div>

      <div className="row-start-3 font-semibold">Growth</div>
      <div className="row-start-3">
        <Checkbox
          onChange={(value, dd) =>
            resultSetterForMicroBio("growth", dd as boolean, result, setResult)
          }
          defaultChecked={result?.growth}
        />
      </div>
    </div>
  );
};

export default MIcro1stSection;
