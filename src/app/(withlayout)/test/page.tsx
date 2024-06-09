"use client";
import TestForm from "@/components/Test/TestForm";
import TestTable from "@/components/Test/TestTable";
import RModal from "@/components/ui/Modal";
import { ENUM_MODE } from "@/enum/Mode";
import {
  useGetTestsQuery,
  usePatchTestMutation,
  usePostTestMutation,
} from "@/redux/api/test/testSlice";
import {
  IDepartment,
  IHospitalGroup,
  ISpecimen,
  ITest,
  IVacuumTube,
} from "@/types/allDepartmentInterfaces";
import React, { useEffect, useRef, useState } from "react";
import { Button, Message, Schema, toaster } from "rsuite";

const Test = () => {
  const { StringType, NumberType, ArrayType } = Schema.Types;
  const [defaultValue, setDefaultValue] = useState<ITest | null>();
  const [formData, setfromData] = useState<any | null>({
    label: "",
    department: "",
    testCode: "",
    specimen: [],
    testType: "",
    hasTestTube: false,
    testTube: "",
    reportGroup: "",
    hospitalGroup: "",
    price: 0,
    vatRate: 0,
    processTime: 0,
    resultFields: [],
    groupTests: [],
    isGroupTest: false,
    testResulType: "",
    type: "",
    value: "",
    _id: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("new");
  const [
    postTest,
    { isLoading: testLoading, isSuccess: testSuccess, isError: testErrors },
  ] = usePostTestMutation();
  const { data: testData, isLoading: testDataLoading } =
    useGetTestsQuery(undefined);
  const [patchTest, { isSuccess: patchSuccess }] = usePatchTestMutation();
  const ref: React.MutableRefObject<any> = useRef();
  // For new test
  const okHandler = () => {
    if (mode == ENUM_MODE.VIEW) {
      setfromData({
        label: "",
        department: "",
        testCode: "",
        specimen: [],
        testType: "",
        hasTestTube: false,
        testTube: "",
        reportGroup: "",
        hospitalGroup: "",
        price: 0,
        vatRate: 0,
        processTime: 0,
        resultFields: [],
      });
      setDefaultValue(undefined);
    }
    if (ref.current.check()) {
      setModalOpen(!modalOpen);
      formData.value = formData?.label.toLowerCase();
      formData.price = Number(formData.price);
      formData.isGroupTest = false;
      formData.vatRate = Number(formData.vatRate);
      formData.processTime = Number(formData.processTime);
      if (formData.type == "group") {
        formData.groupTests = formData.groupTests.map(
          (data: ITest) => data._id
        );
        formData.resultFields = [];
        formData.isGroupTest = true;
      }
      if (mode === "new") {
        if (formData?.vatRate == undefined || Number.isNaN(formData.vatRate)) {
          formData.vatRate = 0;
        }
        if (!formData.hasTestTube) {
          formData.hasTestTube = false;
        }

        postTest(formData);
      }
      if (mode === "patch") {
        patchTest({ data: formData, id: formData._id });
        setfromData({
          label: "",
          department: "",
          testCode: "",
          specimen: [],
          testType: "",
          hasTestTube: false,
          testTube: "",
          reportGroup: "",
          hospitalGroup: "",
          price: 0,
          vatRate: 0,
          processTime: 0,
          resultFields: [],
          groupTests: [],
          isGroupTest: false,
          testResulType: "",
          type: "",
          value: "",
          _id: "",
        });
        setDefaultValue(undefined);
      }
      if (mode === ENUM_MODE.VIEW) {
        setfromData({
          label: "",
          department: "",
          testCode: "",
          specimen: [],
          testType: "",
          hasTestTube: false,
          testTube: "",
          reportGroup: "",
          hospitalGroup: "",
          price: 0,
          vatRate: 0,
          processTime: 0,
          resultFields: [],
        });
        setDefaultValue(undefined);
      }
    } else {
      toaster.push(
        <Message type="error" title="Error !!!">
          Fill out all the fields of the form{" "}
        </Message>
      );
    }
  };
  const cancelHandler = () => {
    setModalOpen(!modalOpen);
    setfromData(undefined);
    setDefaultValue(undefined);
  };
  const modalHandler = () => {
    setModalOpen(!modalOpen);
    setMode("new");
  };
  // For patch
  const patchHandler = ({ data, mode }: { data: ITest; mode: string }) => {
    let newData: ITest = Object.assign({}, data);
    newData.department = data.department?._id as unknown as IDepartment;
    newData.specimen = newData?.specimen.map(
      (data: ISpecimen) => data?._id
    ) as unknown as ISpecimen[];
    newData.testTube = newData?.testTube.map(
      (data: IVacuumTube) => data?._id
    ) as unknown as IVacuumTube[];
    newData.hospitalGroup = newData.hospitalGroup
      ?._id as unknown as IHospitalGroup;

    setModalOpen(!modalOpen);
    setMode(mode);
    setDefaultValue(newData);
    setfromData(newData);
  };

  useEffect(() => {
    if (testSuccess) {
      toaster.push(<Message type="success">Test crated Successfully</Message>);
    }
    if (patchSuccess) {
      toaster.push(<Message type="success">Test Edited Successfully</Message>);
    }
  }, [testSuccess, patchSuccess]);
  const model = Schema.Model({
    label: StringType().isRequired("This field is required."),
    type: StringType().isRequired("This field is required."),
    testResultType: StringType().isRequired("This field is required."),
    department: StringType().isRequired("This field is required."),
    price: NumberType().isRequired("This field is required."),
    processTime: NumberType().isRequired("This field is required."),
    specimen: ArrayType().isRequired("This field is required."),
    hospitalGroup: StringType().isRequired("This field is required."),
    reportGroup: StringType().isRequired("This field is required."),
  });
  return (
    <div>
      <div>
        <RModal
          cancelHandler={cancelHandler}
          okHandler={okHandler}
          open={modalOpen}
          size="lg"
          title={mode === "new" ? "Add New Test" : "Edit Test Fields"}
        >
          <TestForm
            model={model}
            defaultValue={defaultValue}
            formData={formData}
            setfromData={setfromData}
            forwardedRef={ref}
            mode={mode}
          ></TestForm>
        </RModal>
      </div>
      <div className="my-5">
        <Button
          onClick={() => modalHandler()}
          appearance="primary"
          color="blue"
        >
          Add New Test
        </Button>
      </div>
      <div className="mx-5">
        <TestTable patchHandler={patchHandler} />
      </div>
    </div>
  );
};

export default Test;
