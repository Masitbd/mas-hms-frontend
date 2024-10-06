/* eslint-disable react/no-unescaped-entities */
"use client";
import OrderTable from "@/components/order/OrderTable";
import RModal from "@/components/ui/Modal";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { Button, Loader, Message, toaster } from "rsuite";
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
import { ITest, IVacuumTube } from "@/types/allDepartmentInterfaces";
import { ITestsFromOrder } from "@/components/generateReport/initialDataAndTypes";
import { ENUM_TEST_STATUS } from "@/enum/testStatusEnum";
import AuthCheckerForComponent from "@/lib/AuthCkeckerForComponent";
import { ENUM_USER_PEMISSION } from "@/constants/permissionList";
import swal from "sweetalert";
import GlassMorphismLoader from "@/components/ui/GlassMorphismLoader";

const Order = () => {
  const refForUnregistered: React.MutableRefObject<any> = useRef();
  const patientTypeRef: React.MutableRefObject<any> = useRef();
  const [data, setFormData] = useState<InitialData>(initialData);
  const setData = (props: React.SetStateAction<any>) => {
    setFormData(props);
  };
  const [postOrder, { isSuccess, isError, isLoading: postLoading }] =
    usePostOrderMutation();
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
  let tubePrice = 0;

  data.tests?.length > 0 &&
    data.tests.map((param: ItestInformaiton) => {
      // if (param.status == ENUM_TEST_STATUS.REFUNDED) {
      //   return;
      // }
      if (param.status == "tube") {
        tubePrice += param.test.price;
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

  data.parcentDiscount > 0 &&
    data.tests.map((param: ItestInformaiton) => {
      if (param.status == "tube" && data.discountedBy !== "free") {
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
  data.tests?.length > 0 &&
    data.vat > 0 &&
    (vatAmount = Number(
      (
        (data.vat / 100) *
        (totalPrice - discountAmount - data.cashDiscount)
      ).toFixed(2)
    ));

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
      tests: data.tests
        .filter((test) => test.status !== "tube")
        .map((testdata: ItestInformaiton) => {
          return {
            SL: testdata.SL,
            status: "pending",
            discount: Number(testdata?.discount),
            test: testdata.test._id,
            deliveryTime: testdata.deliveryTime,
            remark: testdata.remark,
          };
        }),
      totalPrice: totalPrice + tubePrice,
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
  const [
    getInvoice,
    { isLoading: invoiceLoading, isFetching: invoiceFeatching },
  ] = useLazyGetInvoiceQuery();
  const handlePdf = async (id: string) => {
    const invoice = await getInvoice(id);
    const newWindow = window.open("", "_blank");

    if (newWindow) {
      newWindow.document.write(decodeURIComponent(invoice.data.data));
      newWindow.document.title = "Managed By HMS system";
    }
  };
  useEffect(() => {
    if (isSuccess) {
      swal("Success", "Order Posted Successfully", "success");
      setMode(ENUM_MODE.VIEW);
    }
    if (isError) {
      toaster.push(<Message type="error">! Error</Message>);
    }
  }, [isSuccess]);
  // Handleign vew Order
  const patchAndViewHandler = (data: { mode: string; data: IOrderData }) => {
    setModalOpen(true);
    setMode(data.mode);
    setData(data.data as IOrderData);
  };

  //  For Refund =
  const [rmodalOpen, setRmodalOpen] = useState(false);
  const [rTest, setTest] = useState<ITestsFromOrder | undefined>();

  // // for featching single data
  const [vaccumeTubes, setVaccumetubes] = useState<IVacuumTube[]>([]);
  useEffect(() => {
    // 2. setting the tubes

    if (data.tests.length && mode == ENUM_MODE.NEW) {
      const tests = data.tests.filter((test) => test.status !== "tube");
      const tubes: IVacuumTube[] = [];
      tests.forEach((testInfo: ItestInformaiton) => {
        const test = testInfo.test;

        if (test.hasTestTube) {
          test.testTube.forEach((vTube: IVacuumTube, index) => {
            const doesExistes = tubes.length
              ? tubes.find((tubes: IVacuumTube) => tubes.label == vTube.label)
              : false;

            if (!doesExistes) {
              tubes.push(vTube);
            }
          });
        }
      });
      setVaccumetubes(tubes);
    }
  }, [data]);
  useEffect(() => {
    const orderData = JSON.parse(JSON.stringify(data));
    const tests = orderData.tests;
    if (vaccumeTubes.length && tests.length && ENUM_MODE.NEW) {
      const filteredTest = tests.filter(
        (test: ItestInformaiton) => test.status !== "tube"
      );
      vaccumeTubes.forEach((tube, index: number) => {
        filteredTest.push({
          test: tube,
          deliveryTime: new Date().toLocaleDateString(),
          status: "tube",
          remark: "",
          discount: 0,
          SL: filteredTest.length + 1,
        });
      });
      orderData.tests = filteredTest;
      if (JSON.stringify(tests) !== JSON.stringify(filteredTest)) {
        setData(orderData);
      }
    }
  }, [vaccumeTubes]);

  return (
    <div className="">
      <div className="my-5 border  shadow-lg mx-5">
        <div className="bg-[#3498ff] text-white px-2 py-2">
          <h2 className="text-center text-xl font-semibold">Order's</h2>
        </div>
        <div className="p-2">
          <div className="my-5">
            <AuthCheckerForComponent
              requiredPermission={[ENUM_USER_PEMISSION.MANAGE_ORDER]}
            >
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
            </AuthCheckerForComponent>
          </div>
          <div>
            <RModal
              open={modalOpen}
              title={
                mode == ENUM_MODE.VIEW
                  ? "Bill Information"
                  : " Generate New Bill"
              }
              size="full"
              cancelHandler={cancelHandler}
              okHandler={okHandler}
              loading={postLoading || invoiceLoading || invoiceFeatching}
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
                    tubePrice={tubePrice}
                    order={data as unknown as IOrderData}
                  />

                  <div className="flex justify-end">
                    <div
                      className={`${mode == ENUM_MODE.NEW && "hidden"} mr-2`}
                    >
                      <AuthCheckerForComponent
                        requiredPermission={[ENUM_USER_PEMISSION.MANAGE_ORDER]}
                      >
                        <Button
                          appearance="primary"
                          color="green"
                          size="lg"
                          disabled={data?.dueAmount == 0}
                          onClick={() => setDewMOdalOpen(!dewModalOpen)}
                          className={`${mode == "new" && "invisible"}`}
                        >
                          {data.dueAmount == 0
                            ? "Fully Paid"
                            : "Collect Due Ammount"}
                        </Button>
                      </AuthCheckerForComponent>
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
                setFormData as unknown as React.Dispatch<
                  SetStateAction<IOrderData>
                >
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
