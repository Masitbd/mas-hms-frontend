"use client";

import {
  useGetMarginDataQuery,
  usePatchMiscMutation,
  usePostMiscMutation,
} from "@/redux/api/miscellaneous/miscellaneousSlice";
import { useEffect, useState } from "react";
import { Button, InputNumber, Message, toaster } from "rsuite";

const MarginPage = () => {
  const [postMargin, { isLoading, isSuccess }] = usePostMiscMutation();

  const [patchMargin, { isLoading: updating, isSuccess: patchSuccess }] =
    usePatchMiscMutation();

  const { data: marginInfo, isSuccess: fetchSuccess } = useGetMarginDataQuery(
    undefined
  ) as any;

  console.log("mmfa", marginInfo);

  // Initialize margin state with fetched values or default to [0, 0, 0, 0]

  const [updateMargin, setUpdateMargin] = useState([0, 0, 0, 0]);

  const [newMargin, setNewMargin] = useState([0, 0, 0, 0]);

  useEffect(() => {
    if (fetchSuccess && marginInfo) {
      const fetchedMargin = marginInfo.data?.value
        .split(",")
        .map((val: any) => Number(val.trim()));

      if (fetchedMargin && fetchedMargin.length === 4) {
        setUpdateMargin(fetchedMargin); // Initialize update margin with fetched data
      }
    }
  }, [fetchSuccess, marginInfo]);

  const marginChangeHandler = (
    value: number,
    index: number,
    isUpdate: boolean
  ) => {
    if (isUpdate) {
      const data = [...updateMargin];
      data[index] = value;
      setUpdateMargin(data);
    } else {
      const data = [...newMargin];
      data[index] = value;
      setNewMargin(data);
    }
  };

  const handleUpdateSubmit = async () => {
    const marginData = {
      title: "margin",
      value: updateMargin.join(", "),
    };

    const id = marginInfo?.data?._id;

    await patchMargin({ data: marginData, id }).unwrap();
  };

  const handleNewSubmit = async () => {
    const marginData = {
      title: "newMargin",
      value: newMargin.join(", "),
    };

    await postMargin(marginData).unwrap();
  };

  useEffect(() => {
    if (isSuccess) {
      toaster.push(
        <Message type="success">Margin Updated/Added Successfully</Message>,
        {
          duration: 3000,
        }
      );
      // Reset new margin after successful submission
      setNewMargin([0, 0, 0, 0]);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (patchSuccess) {
      toaster.push(
        <Message type="success">Margin Updated Successfully</Message>,
        {
          duration: 3000,
        }
      );
    }
  }, [patchSuccess]);

  return (
    <div>
      <h1 className="text-lg font-bold bg-[#3498ff] text-white p-2 rounded-md mt-10 w-full max-w-md mx-auto text-center">
        Update Page Margin
      </h1>

      <div className="w-full flex gap-5 justify-center mx-auto items-center mt-20 px-10">
        <InputNumber
          placeholder="Margin Left"
          value={updateMargin[0]} // Use value instead of defaultValue
          onChange={(v) => marginChangeHandler(Number(v), 0, true)}
        />

        <InputNumber
          placeholder="Margin Top"
          value={updateMargin[1]} // Use value instead of defaultValue
          onChange={(v) => marginChangeHandler(Number(v), 1, true)}
        />
        <InputNumber
          placeholder="Margin Right"
          value={updateMargin[2]} // Use value instead of defaultValue
          onChange={(v) => marginChangeHandler(Number(v), 2, true)}
        />
        <InputNumber
          placeholder="Margin Bottom"
          value={updateMargin[3]} // Use value instead of defaultValue
          onChange={(v) => marginChangeHandler(Number(v), 3, true)}
        />

        <Button
          disabled={isLoading}
          appearance="primary"
          onClick={handleUpdateSubmit}
          className="w-52"
        >
          Update
        </Button>
      </div>

      <div className="w-full max-w-md flex flex-col gap-5 justify-center mx-auto items-center mt-20">
        <h1 className="text-lg font-bold bg-[#3498ff] text-white p-2 rounded-md">
          Add New Page Margin
        </h1>
        <InputNumber
          placeholder="Margin Left"
          onChange={(v) => marginChangeHandler(Number(v), 0, false)}
        />

        <InputNumber
          placeholder="Margin Top"
          onChange={(v) => marginChangeHandler(Number(v), 1, false)}
        />
        <InputNumber
          placeholder="Margin Right"
          onChange={(v) => marginChangeHandler(Number(v), 2, false)}
        />
        <InputNumber
          placeholder="Margin Bottom"
          onChange={(v) => marginChangeHandler(Number(v), 3, false)}
        />

        <Button
          disabled={isLoading}
          appearance="primary"
          onClick={handleNewSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default MarginPage;
