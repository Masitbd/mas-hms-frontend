import Loading from "@/app/loading";
import { useGetSpecimenQuery } from "@/redux/api/specimen/specimenSlice";
import { ISpecimen } from "@/types/allDepartmentInterfaces";
import React, { useState } from "react";
import { Button, SelectPicker } from "rsuite";
import NewAndPatchCDT from "./NewAndPatchCDT";
import {
  IMiscellaneous,
  initalData,
  ISensitivity,
} from "./typesAndInitialData";
import { ENUM_MODE } from "@/enum/Mode";
import {
  useDeleteMiscMutation,
  useGetMiscQuery,
} from "@/redux/api/miscellaneous/miscellaneousSlice";
import swal from "sweetalert";

const SWD = () => {
  const { data: specimenData, isLoading: specimenDataLoading } =
    useGetSpecimenQuery(undefined);
  const [selectdSpecimen, setSelectedSpecimen] = useState("");
  const [defaultValue, setDefaultValue] = useState<IMiscellaneous>(initalData);
  const [mode, setMode] = useState(ENUM_MODE.NEW);
  const [open, setOpen] = useState(false);

  const { data: miscData, isLoading: miscDataLoading } = useGetMiscQuery({
    title: selectdSpecimen,
  });

  const [remove, { isLoading: removeLoading, isError: removeError }] =
    useDeleteMiscMutation();
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
  if (specimenDataLoading) {
    return <Loading />;
  }
  return (
    <div>
      <div className="grid grid-cols-5">
        <div>
          <h3>Specimens:</h3>
          <SelectPicker
            cleanable={false}
            data={specimenData?.data.map((data: ISpecimen) => {
              return { label: data.label, value: data.label };
            })}
            loading={specimenDataLoading}
            onSelect={(value) => setSelectedSpecimen(value)}
            block
          />
        </div>
      </div>

      <div>
        {selectdSpecimen?.length == 0 ? (
          <div className="w-full flex h-96 justify-center items-center">
            <h3 className="font-bold text-lg">Please Select a Specimen</h3>
          </div>
        ) : (
          <div>
            <div className="mt-5">
              {miscData?.data?.length == 0 ? (
                <Button
                  appearance="primary"
                  color="blue"
                  onClick={() => {
                    setMode(ENUM_MODE.NEW);
                    setOpen(true);
                  }}
                >
                  Add Description
                </Button>
              ) : (
                <>
                  <div className="grid grid-cols-12  gap-5">
                    <Button
                      appearance="primary"
                      color="blue"
                      onClick={() => {
                        setMode(ENUM_MODE.EDIT);
                        setOpen(true);
                        setDefaultValue(miscData?.data[0]);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      appearance="primary"
                      color="red"
                      onClick={() => deleteHandler(miscData?.data[0])}
                    >
                      Delete
                    </Button>
                  </div>
                  <div className="border rounded-lg border-stone-300 mt-2 mr-5 py-10 px-5">
                    {miscData?.data[0].value}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div>
        {" "}
        <NewAndPatchCDT
          defaultValue={defaultValue}
          mode={mode}
          open={open}
          setData={setDefaultValue}
          setOpen={setOpen}
          title={selectdSpecimen}
        />
      </div>
    </div>
  );
};

export default SWD;
