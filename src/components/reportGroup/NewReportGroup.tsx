import ReportGroupForm from "@/components/reportGroup/ReportGroupForm";
import React, { SetStateAction, useRef } from "react";
import {
  INewReportGroupProps,
  IReportGroupFormData,
  initialFormData,
  newGroupModel,
} from "./initialDataAndTypes";
import ReportGroupTable from "./ReportGroupTable";
import ForParameterBased from "../Test/ForParameterBased";
import { ENUM_MODE } from "@/enum/Mode";
import ForDescriptiveBased from "../Test/TestForDescriptive";
import ForMicroBiology from "../Test/ForMicroBiology";
import { Button } from "rsuite";
import { usePostGroupMutation } from "@/redux/api/reportTypeGroup/reportTypeGroupSlice";

const NewReportGroup = (props: INewReportGroupProps) => {
  const { formData, mode, setFormData } = props;
  const reportType = formData.resultType;
  const ref: React.MutableRefObject<any> = useRef();
  const [
    postGroup,
    { isLoading: postGroupLoading, isSuccess: postGroupSuccess },
  ] = usePostGroupMutation();

  let element;
  switch (reportType) {
    case "parameter":
      element = (
        <ForParameterBased
          defaultMode="new"
          setTestFromData={setFormData}
          testFromData={formData}
        />
      );

      break;

    case "descriptive":
      element = (
        <ForDescriptiveBased
          setTestFromData={setFormData}
          testFromData={formData}
        />
      );
      break;

    case "bacterial":
      element = (
        <ForMicroBiology
          mode="new"
          setTestFromData={setFormData}
          testFromData={formData}
        />
      );
      break;

    default:
      element = (
        <div className="w-full h-[50vh] flex items-center justify-center border rounded-md font-bold text-2xl ">
          Select A report Group and report type
        </div>
      );
      break;
  }

  // Handler function
  const formSbmitHandlerFunction = async () => {
    if (ref.current.check()) {
      if (mode == ENUM_MODE.NEW) {
        const { group, resultType, department, reportGroup } = formData;

        await postGroup({ group, resultType, department, reportGroup });
        if (postGroupSuccess) {
          setFormData(initialFormData);
          alert("success");
        }
      }
    }
  };
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
          onClick={() => setFormData(initialFormData)}
        >
          Cancel
        </Button>
        <Button
          appearance="primary"
          color="blue"
          size="lg"
          disabled={!reportType}
          onClick={formSbmitHandlerFunction}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default NewReportGroup;
