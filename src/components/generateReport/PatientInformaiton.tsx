import React from "react";
import { IOrderData } from "../order/initialDataAndTypes";
import { ITestReportForm } from "../testReport/TestReportForm";
import { ITestResultForParameter } from "./initialDataAndTypes";
import {
  useGetSingleDoctorQuery,
  useLazyGetSingleDoctorQuery,
} from "@/redux/api/doctor/doctorSlice";
import { IDoctor } from "@/types/allDepartmentInterfaces";

const PatientInformaiton = ({
  order,
  testResult,
  consultant,
}: {
  order: IOrderData;
  testResult: ITestResultForParameter;
  consultant: { data: { data: IDoctor } };
}) => {
  return (
    <>
      <div className="border border-1 border-stone-400 p-2 grid grid-cols-2 gap-1 my-5 rounded-md font-serif w-full">
        <div>
          <span className="font-bold">ID: </span>
          <span className="font-serif">{order.oid}</span>
        </div>
        <div>
          <span className="font-bold">Name: </span>
          {order.patient?.name}
        </div>
        <div>
          <span className="font-bold">Age: </span>
          {order.patient?.age} Year(s)
        </div>
        <div>
          <span className="font-bold">Sex: </span>
          {order.patient?.gender}
        </div>
        <div>
          <span className="font-bold">Consultant: </span>
          {consultant?.data?.data?.title} {consultant?.data?.data?.name}
        </div>
        <div>
          <span className="font-bold">Receiving Date: </span>
          {new Date(order.createdAt as Date).toDateString()}
        </div>
        <div>
          <span className="font-bold">Report Creation Date: </span>
          {new Date(testResult?.createdAt as unknown as Date).toDateString()}
        </div>
        <div>
          <span className="font-bold">Specimen: </span>
        </div>
      </div>
    </>
  );
};

export default PatientInformaiton;
