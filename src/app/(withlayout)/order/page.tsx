"use client";
import OrderTable from "@/components/order/OrderTable";
import RModal from "@/components/ui/Modal";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { Button, Message, toaster } from "rsuite";
import TestInformation from "@/components/order/TestInformation";
import {
  useLazyGetInvoiceQuery,
  useLazyGetSingleOrderQuery,
  usePostOrderMutation,
} from "@/redux/api/order/orderSlice";
import FInancialSection from "@/components/order/FInancialSection";
import PriceSection from "@/components/order/PriceSection";
import ForDewCollection from "@/components/order/ForDewCollection";
import {
  IOrderData,
  InitialData,
  ItestInformaiton,
  initialData,
} from "@/components/order/initialDataAndTypes";
import PatientInformation from "@/components/order/PatientInformation";
import { ENUM_MODE } from "@/enum/Mode";
import { useAppDispatch } from "@/redux/hook";
import { setId } from "@/redux/features/IdStore/idSlice";
import jsPDF from "jspdf";
import { URL } from "url";
import Refund from "@/components/order/Refund";
import { ITest } from "@/types/allDepartmentInterfaces";
import { ITestsFromOrder } from "@/components/generateReport/initialDataAndTypes";
import { ENUM_TEST_STATUS } from "@/enum/testStatusEnum";

const Order = () => {
  const refForUnregistered: React.MutableRefObject<any> = useRef();
  const patientTypeRef: React.MutableRefObject<any> = useRef();
  const [data, setFormData] = useState<InitialData>(initialData);
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
  };
  // Handling discount and vat functionality
  let vatAmount = 0;
  let discountAmount = 0;
  let totalPrice = 0;

  data.tests?.length > 0 &&
    data.tests.map((param: ItestInformaiton) => {
      if (param.status == ENUM_TEST_STATUS.REFUNDED) {
        return;
      }
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
      if (param.status == ENUM_TEST_STATUS.REFUNDED) {
        return;
      }
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
      discountedBy: data.discountedBy,
    };
    if (data?.refBy && data.refBy.length > 5) {
      orderData.refBy = data.refBy as string;
    }

    if (data?.consultant && data.consultant.length > 5) {
      orderData.consultant = data.consultant as string;
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
    const newWindow = window.open("", "_blank");

    if (newWindow) {
      newWindow.document.write(decodeURIComponent(invoice.data.data));
      newWindow.document.title = "Managed By HMS system";

      newWindow?.print();
    }

    // const buffer = Buffer.from(invoice.data.data.data);
    // const blob = new Blob([buffer], { type: "application/pdf" });

    // const fileName = URL.createObjectURL(blob);
    // const pdfwindow = window.open();
    // pdfwindow.location.href = fileName;
    // window.open(fileName)?.print();
  };
  useEffect(() => {
    if (isSuccess) {
      toaster.push(<Message type="success">Order posted Successfully</Message>);
      setModalOpen(!modalOpen);
      setData(initialData);
    }
    if (isError) {
      toaster.push(<Message type="error">! Error</Message>);
    }
  }, [isSuccess]);
  const dispatch = useAppDispatch();
  // Handleign vew Order
  const patchAndViewHandler = (data: { mode: string; data: IOrderData }) => {
    setModalOpen(true);
    setMode(data.mode);
    setData(data.data as IOrderData);
    dispatch(setId(data.data._id as string));
  };

  //  For Refund =
  const [rmodalOpen, setRmodalOpen] = useState(false);
  const [rTest, setTest] = useState<ITestsFromOrder | undefined>();

  // // for featching single data
  // const [getSingle,{isLoading:getSingleLoading}] = useLazyGetSingleOrderQuery()
  // useEffect(()=>{
  //   if(ENUM_MODE.VIEW){
  //     (async function() {

  //       const data = a
  //     }())

  //   }
  // },[mode])
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
          title={
            mode == ENUM_MODE.VIEW ? "Bill Information" : " Generate New Bill"
          }
          size="full"
          cancelHandler={cancelHandler}
          okHandler={okHandler}
        >
          <>
            <div>
              <Refund
                open={rmodalOpen}
                order={data as unknown as IOrderData}
                setOpen={setRmodalOpen}
                test={rTest as unknown as ITestsFromOrder}
                key={"rms"}
              />
            </div>
            <div>
              <PatientInformation
                data={data as unknown as InitialData}
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
                setRModalOpen={setRmodalOpen}
                setRTest={setTest}
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
                setFormData={setFormData as any}
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
                <div className={`${mode == ENUM_MODE.NEW && "hidden"} mr-2`}>
                  <Button
                    appearance="primary"
                    color="green"
                    size="lg"
                    disabled={data?.dueAmount == 0}
                    onClick={() => setDewMOdalOpen(!dewModalOpen)}
                    className={`${mode == "new" && "invisible"}`}
                  >
                    {data.dueAmount == 0 ? "Fully Paid" : "Collect Due Ammount"}
                  </Button>
                </div>
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
          setFormData={
            setFormData as unknown as React.Dispatch<SetStateAction<IOrderData>>
          }
        />
      </div>
    </div>
  );
};

export default Order;
