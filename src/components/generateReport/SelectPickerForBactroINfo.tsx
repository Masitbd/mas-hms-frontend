import { useGetMiscQuery } from "@/redux/api/miscellaneous/miscellaneousSlice";
import React, { SetStateAction } from "react";
import { SelectPicker } from "rsuite";
import { IMiscellaneous } from "../bactrologicalInfo/typesAndInitialData";
import { Isensitivity, ITEstREsultForMicroBio } from "./initialDataAndTypes";
import { resultSetterForMicroBio } from "./functions";
import Loading from "@/app/loading";

const SelectPickerForBactroINfo = (props: {
  title: string;
  size?: string;
  defaultValue?: string;
  result: ITEstREsultForMicroBio;
  setResult: React.Dispatch<SetStateAction<ITEstREsultForMicroBio>>;
}) => {
  const { data, isLoading } = useGetMiscQuery({ title: props.title });

  return (
    <SelectPicker
      defaultValue={props.result[props.title.toLowerCase()]}
      loading={isLoading}
      data={data?.data.map((data: IMiscellaneous) => ({
        label: data.value,
        value: data.value,
      }))}
      block
      onChange={(value) =>
        resultSetterForMicroBio(
          props.title.toLocaleLowerCase(),
          value as string,
          props.result,
          props.setResult
        )
      }
    />
  );
};

export default SelectPickerForBactroINfo;
