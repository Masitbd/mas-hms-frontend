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
      title: "margin",
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
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">
            Financial Report And Invoice margin
          </h2>
        </div>
        <div className="my-5">
          {!marginInfo?.data ? (
            <div className="w-full max-w-md flex flex-col gap-5 justify-center mx-auto items-center mt-20">
              <h1 className="text-lg font-bold bg-[#3498ff] text-white p-2 rounded-md">
                Add New Margin
              </h1>
              <label>Left</label>
              <InputNumber
                placeholder="Margin Left"
                onChange={(v) => marginChangeHandler(Number(v), 0, false)}
              />

              <label>Top</label>
              <InputNumber
                placeholder="Margin Top"
                onChange={(v) => marginChangeHandler(Number(v), 1, false)}
              />
              <label>Right</label>
              <InputNumber
                placeholder="Margin Right"
                onChange={(v) => marginChangeHandler(Number(v), 2, false)}
              />
              <label>Bottom</label>
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
          ) : (
            <>
              <h1 className="text-lg font-bold bg-[#3498ff] text-white p-2 rounded-md mt-10 w-full max-w-md mx-auto text-center">
                Update Page Margin
              </h1>

              <div className="w-full flex gap-5 justify-center mx-auto items-center mt-20 px-10">
                <div>
                  <label>Left</label>
                  <InputNumber
                    placeholder="Margin Left"
                    value={updateMargin[0]} // Use value instead of defaultValue
                    onChange={(v) => marginChangeHandler(Number(v), 0, true)}
                  />
                </div>

                <div>
                  <label>Top</label>
                  <InputNumber
                    placeholder="Margin Top"
                    value={updateMargin[1]} // Use value instead of defaultValue
                    onChange={(v) => marginChangeHandler(Number(v), 1, true)}
                  />
                </div>

                <div>
                  <label>Right</label>
                  <InputNumber
                    placeholder="Margin Right"
                    value={updateMargin[2]} // Use value instead of defaultValue
                    onChange={(v) => marginChangeHandler(Number(v), 2, true)}
                  />
                </div>

                <div>
                  <label>Bottom</label>
                  <InputNumber
                    placeholder="Margin Bottom"
                    value={updateMargin[3]} // Use value instead of defaultValue
                    onChange={(v) => marginChangeHandler(Number(v), 3, true)}
                  />
                </div>

                <div>
                  <br />
                  <Button
                    disabled={isLoading}
                    appearance="primary"
                    onClick={handleUpdateSubmit}
                    className="w-52"
                  >
                    Update
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarginPage;
