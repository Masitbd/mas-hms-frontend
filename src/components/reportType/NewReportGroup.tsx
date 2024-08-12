import ReportGroupForm from "@/components/reportType/ReportGroupForm";
import { ENUM_MODE } from "@/enum/Mode";
import {
  usePatchGroupMutation,
  usePostGroupMutation,
} from "@/redux/api/reportTypeGroup/reportTypeGroupSlice";
import React, { useEffect, useRef } from "react";
import { Button } from "rsuite";
import swal from "sweetalert";
import {
  INewReportGroupProps,
  IReportGroupFormData,
  initialFormData,
  newGroupModel,
} from "./initialDataAndTypes";

const NewReportGroup = (props: INewReportGroupProps) => {
  const { formData, mode, setFormData, setMode } = props;
  const reportType = formData?.resultType;
  const ref: React.MutableRefObject<any> = useRef();
  const [
    postGroup,
    { isLoading: postGroupLoading, isSuccess: postGroupSuccess },
  ] = usePostGroupMutation();

  const [
    patch,
    { isSuccess: PatchSuccess, isLoading: patchLoading, isError: patchError },
  ] = usePatchGroupMutation();
  // let element;
  // switch (reportType) {
  //   case "parameter":
  //     element = (
  //       <ForParameterBased
  //         defaultMode="new"
  //         setTestFromData={setFormData}
  //         testFromData={formData}
  //       />
  //     );

  //     break;

  //   case "descriptive":
  //     element = (
  //       <ForDescriptiveBased
  //         setTestFromData={setFormData}
  //         testFromData={formData}
  //       />
  //     );
  //     break;

  //   case "bacterial":
  //     element = (
  //       <ForMicroBiology
  //         mode="new"
  //         setTestFromData={setFormData}
  //         testFromData={formData}
  //       />
  //     );
  //     break;

  //   default:
  //     element = (
  //       <div className="w-full h-[50vh] flex items-center justify-center border rounded-md font-bold text-2xl ">
  //         Select A report Group and report type
  //       </div>
  //     );
  //     break;
  // }

  // Handler function
  const formSbmitHandlerFunction = async () => {
    if (ref.current.check()) {
      if (mode == ENUM_MODE.NEW) {
        const { group, resultType, department, reportGroup } = formData;

        await postGroup({ group, resultType, department, reportGroup });
      }
      if (mode == ENUM_MODE.EDIT) {
        const { group, resultType, department, reportGroup } = formData;

        const result = await patch({
          data: {
            group,
            resultType,
            department,
            reportGroup,
          },
          id: formData._id,
        });
        if ("data" in result) {
          swal("Success", "Updated Successfully", "success");
          setMode && setMode(ENUM_MODE.NEW);
        } else {
          swal("Error", "something went wrong", "error");
        }
      }
    }
  };
  useEffect(() => {
    if (postGroupSuccess) {
      swal("Success", "Posted successfully", "success");
      setFormData(initialFormData);
    }
  }, [postGroupSuccess]);
  return (
    <div>
      <div className="">
        <ReportGroupForm
          hanlderFunction={setFormData}
          formData={formData as IReportGroupFormData}
          mode={mode}
          model={newGroupModel}
          forwordedRef={ref}
        />
      </div>
      {/* <div>{element}</div> */}
      <div className="flex w-full justify-end p-5">
        <Button
          appearance="primary"
          color="red"
          size="lg"
          className="mx-2"
          disabled={!reportType}
          onClick={() => {
            setMode && setMode(ENUM_MODE.NEW);
            setFormData(initialFormData);
          }}
          loading={postGroupLoading || patchLoading}
        >
          Cancel
        </Button>
        <Button
          appearance="primary"
          color="blue"
          size="lg"
          disabled={!reportType}
          onClick={formSbmitHandlerFunction}
          loading={postGroupLoading || patchLoading}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default NewReportGroup;
