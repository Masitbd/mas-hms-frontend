"use client";
import OrderTable from "@/components/order/OrderTable";
import RModal from "@/components/ui/Modal";
import React, { useEffect, useState } from "react";
import { Button, Form, Input, InputGroup, InputPicker, Table } from "rsuite";
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
const initialData = {
  totalPrice: 0,
  parcentDiscount: 0,
  cashDiscount: 0,
  totalDIscount: 0,
  netPrice: 0,
  vatParcent: 0,
  vatAmount: 0,
  paid: 0,
  tests: [],
  patientType: "",
  patient: {
    _id: "",
    name: "",
    uuid: "",
  },
  refBy: "",
  deliveryTime: new Date(),
};

type ItestInformaiton = {
  _id: any;
  discount: string;
  hasDiscount: boolean;
  ramark: string;
  test: ITest;
  priceAfterDiscount: number;
  discountAmount: number;
  deliveryDate: Date;
};
export type IOrderData = {
  uuid?: string;
  patient?: Partial<IPatient>;
  refBy: string;
  status: string;
  deliveryTime: Date;
  tests: {
    status: string;
    discount: string;
    test: string;
  }[];
  totalPrice: number;
  cashDiscount: number;
  parcentDiscount: number;
  dueAmount: number;
  patientType: string;
  paid: number;
};
const Order = () => {
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
    setModalOpen(!modalOpen);
    setData(initialData);
  };

  //   for search

  const patientType = [
    { label: "Registered", value: "registered" },
    { label: "Not Registered", value: "notRegistered" },
  ];

  //   For patient search
  const [svalue, setsvalue] = useState();

  const handleSearchFunction = async () => {
    const sdata = await search(svalue);

    setData({ ...data, patient: sdata.data.data });
  };
  // Handling discount and vat functionality
  let vatAmount = 0;
  let discountAmount = 0;
  let totalPrice = 0;
  let estimatedDeliveryDate = new Date();

  data.tests?.length > 0 &&
    data.tests.map((param: ItestInformaiton) => {
      totalPrice = totalPrice + param.test.price;
      if (param.deliveryDate > data.deliveryTime) {
        setData((preValue) => ({
          ...preValue,
          deliveryTime: param.deliveryDate,
        }));
      }
      if (param.hasDiscount || Number(param.discount) > 0) {
        const discount = Number(
          ((Number(param.discount) / 100) * param.test.price).toFixed(2)
        );

        discountAmount = Number((discountAmount + discount).toFixed(2));
      }
    });

  data.tests?.length > 0 &&
    data.vatParcent > 0 &&
    data.tests.map((test) => {
      vatAmount = Number(((data.vatParcent / 100) * totalPrice).toFixed(2));
    });

  data.parcentDiscount > 0 &&
    data.tests.map((param: ItestInformaiton) => {
      if (param.hasDiscount || Number(param.discount) > 0) {
        return;
      } else {
        const discount = Number(
          ((data.parcentDiscount / 100) * Number(param.test.price)).toFixed(2)
        );
        discountAmount = Number((discountAmount + discount).toFixed(2));
      }
    });

  const handlePostORder = async () => {
    const orderData: IOrderData = {
      refBy: data.refBy,
      status: "pending",
      deliveryTime: data.deliveryTime,
      tests: data.tests.map((testdata: ItestInformaiton) => {
        return {
          status: "pending",
          discount: Number(testdata?.discount),
          test: testdata.test._id,
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
      vat: vatAmount,
    };
    if (data.patientType == "registered" && data.patient._id) {
      orderData.uuid = data.patient.uuid;
    }
    if (data.patientType === "notRegistered") {
      orderData.patient = data.patient;
    }
    console.log(orderData);
    postOrder(orderData);
  };

  useEffect(() => {
    if (isSuccess) {
      alert("success");
    }
  }, [isSuccess]);

  // Handleign vew Order
  const patchAndViewHandler = (data: { mode: string; data: IOrderData }) => {
    setModalOpen(!modalOpen);
    setMode(data.mode);
    setData(data.data);
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
                      <Input name="value" onChange={setsvalue} width={50} />
                      <InputGroup.Button
                        type="submit"
                        onClick={handleSearchFunction}
                      >
                        <SearchIcon />
                      </InputGroup.Button>
                    </InputGroup>
                  </div>
                </>
              )}
            </div>

            <div className="mt-5">
              {data.patientType === "registered" &&
                (SearchData?.data || data.patient.name ? (
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
                />
              )}
            </div>

            <div className="my-10">
              <TestInformation formData={data} setFormData={setData} />
            </div>
            <div>
              <FInancialSection setData={setData} />
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
                  className={`mx-5`}
                  size="lg"
                  disabled={mode == "new"}
                  onClick={() => setDewMOdalOpen(!dewModalOpen)}
                >
                  Collect Due Ammount
                </Button>
                <Button
                  size="lg"
                  appearance="primary"
                  color="blue"
                  onClick={handlePostORder}
                  disabled={mode !== "new"}
                >
                  Post
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
