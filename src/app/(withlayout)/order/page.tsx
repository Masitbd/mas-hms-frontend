"use client";
import OrderTable from "@/components/order/OrderTable";
import RModal from "@/components/ui/Modal";
import React, { useEffect, useRef, useState } from "react";
import { Button, Message, toaster } from "rsuite";
import TestInformation from "@/components/order/TestInformation";
import {
  useLazyGetInvoiceQuery,
  usePostOrderMutation,
} from "@/redux/api/order/orderSlice";
import FInancialSection from "@/components/order/FInancialSection";
import PriceSection from "@/components/order/PriceSection";
import ForDewCollection from "@/components/order/ForDewCollection";
import {
  IOrderData,
  ItestInformaiton,
  initialData,
} from "@/components/order/initialDataAndTypes";
import PatientInformation from "@/components/order/PatientInformation";
import { ENUM_MODE } from "@/enum/Mode";
import { useAppDispatch } from "@/redux/hook";
import { setId } from "@/redux/features/IdStore/idSlice";

const Order = () => {
  const refForUnregistered: React.MutableRefObject<any> = useRef();
  const patientTypeRef: React.MutableRefObject<any> = useRef();
  const [data, setFormData] = useState(initialData);
  const setData = (props: React.SetStateAction<any>) => {
    setFormData(props);
  };
  const [postOrder, { isSuccess, isError }] = usePostOrderMutation();
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
  // Handling discount and vat functionality
  let vatAmount = 0;
  let discountAmount = 0;
  let totalPrice = 0;

  data.tests?.length > 0 &&
    data.tests.map((param: ItestInformaiton) => {
      totalPrice = totalPrice + param.test.price;
      if (param.deliveryTime > data.deliveryTime) {
        setData((preValue: any) => ({
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
    if (mode === "view") {
      setData(initialData);
      setModalOpen(!modalOpen);
      return;
    }
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
          SL: testdata.SL,
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
    };
    if (data?.refBy && data.refBy.length > 5) {
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

  // Manage pdf
  const [getInvoice] = useLazyGetInvoiceQuery();
  const handlePdf = async (id: string) => {
    const invoice = await getInvoice(id);
    const buffer = Buffer.from(invoice.data.data.data);
    const blob = new Blob([buffer], { type: "application/pdf" });

    const fileName = URL.createObjectURL(blob);
    // const pdfwindow = window.open();
    // pdfwindow.location.href = fileName;
    window.open(fileName)?.print();
  };
  useEffect(() => {
    if (isSuccess) {
      toaster.push(<Message type="success">Order posted Successfully</Message>);
      setModalOpen(!modalOpen);
    }
  }, [isSuccess]);
  const dispatch = useAppDispatch();
  // Handleign vew Order
  const patchAndViewHandler = (data: { mode: string; data: IOrderData }) => {
    setModalOpen(!modalOpen);
    setMode(data.mode);
    setData(data.data as IOrderData);
    dispatch(setId(data.data._id as string));
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
          title="Generate New Bill"
          size="full"
          cancelHandler={cancelHandler}
          okHandler={okHandler}
        >
          <>
            <h2 className="text-4xl font-bold text-center">
              {mode == ENUM_MODE.VIEW
                ? "Bill Information"
                : " Generate New Bill"}
            </h2>

            <div>
              <PatientInformation
                data={data}
                forwardedRefForUnregisterd={refForUnregistered}
                setFormData={setData as React.SetStateAction<any>}
                forwardedRefForPatientType={patientTypeRef}
                key={2589}
                mode={mode}
              />
            </div>

            <div className="my-10">
              <TestInformation
                formData={data}
                setFormData={setData}
                mode={mode}
              />
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
                mode={mode}
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
                  className={`${mode == "new" && "invisible"}`}
                >
                  Collect Due Ammount
                </Button>
                <Button
                  appearance="primary"
                  color="blue"
                  onClick={() => handlePdf(data.oid as string)}
                  className={`${mode == "new" && "invisible"}`}
                >
                  Invoice
                </Button>
              </div>
            </div>
          </>
        </RModal>
      </div>
      <div>
        <OrderTable
          patchHandler={patchAndViewHandler}
          mode={mode}
          setMode={setMode}
        />
      </div>
    </div>
  );
};

export default Order;
