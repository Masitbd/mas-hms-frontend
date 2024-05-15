"use client";
import FInancialSection from "@/components/order/FInancialSection";
import ForDewCollection from "@/components/order/ForDewCollection";
import ForNotRegistered from "@/components/order/ForNotRegistered";
import ForRegistered from "@/components/order/ForRegistered";
import OrderTable from "@/components/order/OrderTable";
import PriceSection from "@/components/order/PriceSection";
import TestInformation from "@/components/order/TestInformation";
import RModal from "@/components/ui/Modal";
import { useGetDoctorQuery } from "@/redux/api/doctor/doctorSlice";
import { usePostOrderMutation } from "@/redux/api/order/orderSlice";
import {
  useLazyGetSinglePatientQuery
} from "@/redux/api/patient/patientSlice";
import { IPatient, ITest } from "@/types/allDepartmentInterfaces";
import SearchIcon from "@rsuite/icons/Search";
import { useEffect, useState } from "react";
import { Button, Form, Input, InputGroup, InputPicker } from "rsuite";
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
  deliveryTime: "",
};

type ItestInformaiton = {
  _id: any;
  discount: string;
  hasDiscount: boolean;
  ramark: string;
  test: ITest;
  priceAfterDiscount: number;
  discountAmount: number;
};
export type IOrderData = {
  uuid?: string;
  patient?: Partial<IPatient>;
  refBy: string;
  status: string;
  deliveryTime: string;
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

  data.tests?.length > 0 &&
    data.tests.map((param: ItestInformaiton) => {
      totalPrice = totalPrice + param?.test?.price;

      if (param.hasDiscount || Number(param.discount) > 0) {
        const discount = Math.ceil(
          (Number(param.discount) / 100) * param?.test?.price
        );
        console.log(discount);
        discountAmount = discountAmount + discount;
      }
    });

  data.tests?.length > 0 &&
    data.vatParcent > 0 &&
    data.tests.map((test) => {
      vatAmount = Math.ceil((data.vatParcent / 100) * totalPrice);
    });

  data.parcentDiscount > 0 &&
    data.tests.map((param: ItestInformaiton) => {
      if (param.hasDiscount || Number(param.discount) > 0) {
        return;
      } else {
        const discount = Math.ceil(
          (data.parcentDiscount / 100) * Number(param.test.price)
        );
        discountAmount = discountAmount + discount;
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
          discount: testdata?.discount,
          test: testdata.test._id,
        };
      }),
      totalPrice: data.totalPrice,
      cashDiscount: data.cashDiscount ? data.cashDiscount : 0,
      parcentDiscount: data.parcentDiscount ? data.parcentDiscount : 0,
      dueAmount: Math.ceil(
        totalPrice -
        discountAmount +
        vatAmount -
        (data.cashDiscount ? data.cashDiscount : 0) -
        (data.paid ? data.paid : 0)
      ),
      paid: data.paid ? data.paid : 0,
      patientType: data.patientType,
    };
    if (data.patientType == "registered" && data.patient._id) {
      orderData.uuid = data.patient.uuid;
    }
    if (data.patientType === "notRegistered") {
      orderData.patient = data.patient;
    }
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
          onClick={() => setModalOpen(!modalOpen)}
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
                (SearchData?.data ? (
                  <ForRegistered
                    doctors={doctorData.data}
                    formData={data}
                    patient={SearchData.data}
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
