"use client";
import OrderTable from "@/components/order/OrderTable";
import RModal from "@/components/ui/Modal";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputGroup,
  InputPicker,
  Message,
  Table,
  toaster,
} from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import FormControl from "rsuite/esm/FormControl";
import { useGetDoctorQuery } from "@/redux/api/doctor/doctorSlice";
import { IDoctor, IPatient } from "@/types/allDepartmentInterfaces";
import {
  useGetSinglePatientQuery,
  useLazyGetSinglePatientQuery,
} from "@/redux/api/patient/patientSlice";
import { useGetTestQuery, useGetTestsQuery } from "@/redux/api/test/testSlice";
import TestInformation from "@/components/order/TestInformation";
import CheckIcon from "@rsuite/icons/Check";
import { usePostOrderMutation } from "@/redux/api/order/orderSlice";
import ForRegistered from "@/components/order/ForRegistered";
import ForNotRegistered from "@/components/order/ForNotRegistered";
import { ITest } from "@/types/allDepartmentInterfaces";
import FInancialSection from "@/components/order/FInancialSection";
import PriceSection from "@/components/order/PriceSection";
import ForDewCollection from "@/components/order/ForDewCollection";

type InitialData = {
  totalPrice: number;
  parcentDiscount: number;
  cashDiscount: number;
  vat: number;
  paid: number;
  tests: ItestInformaiton[]; // Define the appropriate type for tests
  patientType: string;
  patient: IPatient;
  refBy?: string; // Make refBy optional
  deliveryTime: Date;
};

const initialData: InitialData = {
  totalPrice: 0,
  parcentDiscount: 0,
  cashDiscount: 0,
  vat: 0,
  paid: 0,
  tests: [],
  patientType: "",
  patient: {
    _id: "",
    name: "",
    uuid: "",
    age: "",
    gender: "",
    address: "",
    phone: "",
    image: "",
  },
  refBy: "",
  deliveryTime: new Date(),
};

type ItestInformaiton = {
  discount: string;
  ramark: string;
  test: ITest;
  deliveryTime: Date;
  remark: string;
};
export type IOrderData = {
  uuid?: string;
  patient?: Partial<IPatient>;
  refBy: string;
  status: string;
  deliveryTime: Date;
  tests: {
    status: string;
    discount: number;
    test: string | undefined;
  }[];
  totalPrice: number;
  cashDiscount: number;
  parcentDiscount: number;
  dueAmount: number;
  patientType: string;
  paid: number;
  vat: number;
};
const Order = () => {
  const refForUnregistered: React.MutableRefObject<any> = useRef();
  const patientTypeRef: React.MutableRefObject<any> = useRef();
  const [data, setData] = useState(initialData);
  const [search, { data: SearchData }] = useLazyGetSinglePatientQuery();
  const [postOrder, { isSuccess, isError }] = usePostOrderMutation();
  const { data: doctorData } = useGetDoctorQuery(undefined);
  const [mode, setMode] = useState("new");
  const [dewModalOpen, setDewMOdalOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const cancelHandler = () => {
    setModalOpen(!modalOpen);
    setData(initialData);
  };
  const okHandler = () => {
    handlePostORder();
    setData(initialData);
  };

  //   for search

  const patientType = [
    { label: "Registered", value: "registered" },
    { label: "Not Registered", value: "notRegistered" },
  ];

  const handleSearchFunction = async (value: string) => {
    const sdata = await search(value);
    setData({ ...data, patient: sdata.data.data });
    if (sdata.data.data.ref_by) {
      setData({ ...data, refBy: sdata.data.data.ref_by });
    }
  };
  // Handling discount and vat functionality
  let vatAmount = 0;
  let discountAmount = 0;
  let totalPrice = 0;

  data.tests?.length > 0 &&
    data.tests.map((param: ItestInformaiton) => {
      totalPrice = totalPrice + param.test.price;
      if (param.deliveryTime > data.deliveryTime) {
        setData((preValue) => ({
          ...preValue,
          deliveryTime: param.deliveryTime,
        }));
      }
      if (Number(param.discount) > 0) {
        const discount = Number(
          ((Number(param.discount) / 100) * param.test.price).toFixed(2)
        );

        discountAmount = Number((discountAmount + discount).toFixed(2));
      }
    });

  data.tests?.length > 0 &&
    data.vat > 0 &&
    (vatAmount = Number(((data.vat / 100) * totalPrice).toFixed(2)));

  data.parcentDiscount > 0 &&
    data.tests.map((param: ItestInformaiton) => {
      if (Number(param.discount) > 0) {
        return;
      } else {
        const discount = Number(
          ((data.parcentDiscount / 100) * Number(param.test.price)).toFixed(2)
        );
        discountAmount = Number((discountAmount + discount).toFixed(2));
      }
    });

  const handlePostORder = async () => {
    if (data.tests.length === 0) {
      toaster.push(
        <Message type="error">No test added in the order list</Message>
      );
      return;
    }
    const orderData: IOrderData = {
      status: "pending",
      deliveryTime: data.deliveryTime,
      tests: data.tests.map((testdata: ItestInformaiton) => {
        return {
          status: "pending",
          discount: Number(testdata?.discount),
          test: testdata.test._id,
          deliveryTime: testdata.deliveryTime,
          remark: testdata.remark,
        };
      }),
      totalPrice: totalPrice,
      cashDiscount: data.cashDiscount ? data.cashDiscount : 0,
      parcentDiscount: data.parcentDiscount ? data.parcentDiscount : 0,
      dueAmount: Number(
        (
          totalPrice -
          discountAmount +
          vatAmount -
          (data.cashDiscount ? data.cashDiscount : 0) -
          (data.paid ? data.paid : 0)
        ).toFixed(2)
      ),
      paid: data.paid ? data.paid : 0,
      patientType: data.patientType,
      vat: data.vat,
      refBy: "",
    };
    if (data.refBy.length > 5) {
      orderData.refBy = data.refBy as string;
    }

    if (data.patientType.length > 5) {
      if (data.patientType == "registered") {
        if (data.patient?._id) {
          orderData.uuid = data.patient.uuid;
          postOrder(orderData);
        } else {
          toaster.push(<Message type="error">Patient UUID is wrong</Message>);
        }
      }
      if (data.patientType === "notRegistered") {
        if (refForUnregistered.current.check()) {
          orderData.patient = data.patient;
          postOrder(orderData);
        } else {
          toaster.push(
            <Message type="error">Please Fill out all the fields</Message>
          );
        }
      }
    } else {
      toaster.push(<Message type="error">Select Patient type</Message>);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toaster.push(<Message type="success">Order posted Successfully</Message>);
      setModalOpen(!modalOpen);
    }
  }, [isSuccess]);

  // Handleign vew Order
  const patchAndViewHandler = (data: { mode: string; data: IOrderData }) => {
    setModalOpen(!modalOpen);
    setMode(data.mode);
    setData(data.data as IOrderData);
  };

  return (
    <div>
      <div className="my-5">
        <Button
          appearance="primary"
          color="blue"
          onClick={() => {
            setModalOpen(!modalOpen);
            setMode("new");
          }}
        >
          Generate New Bill
        </Button>
      </div>
      <div>
        <RModal
          open={modalOpen}
          title=""
          size="full"
          cancelHandler={cancelHandler}
          okHandler={okHandler}
        >
          <>
            <h2 className="text-4xl font-bold text-center">
              Generate New Bill
            </h2>
            <Form
              onChange={(value, event) =>
                setData((prevData) => ({
                  ...prevData,
                  patientType: value.patientType,
                }))
              }
              fluid
              className="grid grid-cols-2"
              formValue={data}
              ref={patientTypeRef}
            >
              <Form.Group controlId="patientType">
                <Form.ControlLabel>Patient Type</Form.ControlLabel>
                <Form.Control
                  name="patientType"
                  accepter={InputPicker}
                  data={patientType}
                />
              </Form.Group>
            </Form>
            <div>
              {data?.patientType == "registered" && (
                <>
                  <div className="mt-5">
                    <h1 className="font-bold">Patient UUID</h1>
                    <InputGroup>
                      <Input
                        name="value"
                        onChange={handleSearchFunction}
                        width={50}
                      />
                    </InputGroup>
                  </div>
                </>
              )}
            </div>

            <div className="mt-5">
              {data.patientType === "registered" &&
                (data?.patient?._id ? (
                  <ForRegistered
                    doctors={doctorData.data}
                    formData={data}
                    patient={SearchData?.data ? SearchData.data : data}
                    setFormData={setData}
                  />
                ) : (
                  <>
                    <div className="h-24 flex justify-center items-center">
                      No data founds
                    </div>
                  </>
                ))}
              {data.patientType === "notRegistered" && (
                <ForNotRegistered
                  doctorData={doctorData.data}
                  setFromData={setData}
                  data={data}
                  forwardedRef={refForUnregistered}
                />
              )}
            </div>

            <div className="my-10">
              <TestInformation formData={data} setFormData={setData} />
            </div>
            <div>
              <FInancialSection
                setData={setData}
                dueAmount={(
                  totalPrice -
                  discountAmount +
                  vatAmount -
                  (data.paid ? data.paid : 0)
                ).toFixed(2)}
                data={data}
              />
            </div>
            <div>
              <ForDewCollection
                data={data as unknown as IOrderData}
                dewModalOpen={dewModalOpen}
                setDewModalOpen={setDewMOdalOpen}
              />
            </div>
            <div>
              <PriceSection
                data={data}
                discountAmount={discountAmount}
                totalPrice={totalPrice}
                vatAmount={vatAmount}
              />
              <div className="flex justify-end">
                <Button
                  appearance="primary"
                  color="green"
                  size="lg"
                  disabled={mode == "new"}
                  onClick={() => setDewMOdalOpen(!dewModalOpen)}
                >
                  Collect Due Ammount
                </Button>
              </div>
            </div>
          </>
        </RModal>
      </div>
      <div>
        <OrderTable patchHandler={patchAndViewHandler} />
      </div>
    </div>
  );
};

export default Order;
