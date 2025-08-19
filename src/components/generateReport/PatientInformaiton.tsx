import React, { useEffect, useState } from "react";
import { IOrderData } from "../order/initialDataAndTypes";
import {
  ITEstREsultForMicroBio,
  ITestResultForParameter,
  ITestsFromOrder,
} from "./initialDataAndTypes";
import {
  IDoctor,
  IReportGroup,
  ISpecimen,
  ITest,
} from "@/types/allDepartmentInterfaces";
import { useGetSingleReportTypeQuery } from "@/redux/api/reportType/reportType";

const PatientInformaiton = ({
  order,
  testResult,
  consultant,
  reportGroup,
  tests,
  reportGroupData,
}: {
  order: IOrderData & { refBy: IDoctor };
  testResult?: ITestResultForParameter | ITEstREsultForMicroBio;
  consultant?: { data: { data: IDoctor } };
  reportGroup?: string;
  tests?: ITestsFromOrder[];
  reportGroupData: IReportGroup;
}) => {
  const specimen = new Set();

  tests
    ?.filter((t: any) => t?.test?.reportGroup == reportGroup?.toString())
    ?.map((t: any) => {
      if (t?.test?.specimen && Array.isArray(t?.test?.specimen)) {
        return t?.test?.specimen?.map((s: ISpecimen) => specimen.add(s.label));
      }
    });

  return (
    <>
      <div
        style={{
          border: "1px solid #cbd5e1", // stone-400
          padding: "8px",
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1px 1px",
          margin: "20px 0",
          borderRadius: "8px",
          fontFamily: "serif",
          width: "100%",
          fontSize: ".950rem",
        }}
      >
        <div>
          <span style={{ fontWeight: "bold" }}>ID: </span>
          <span style={{ fontFamily: "serif" }}>{order.oid}</span>
        </div>
        <div>
          <span style={{ fontWeight: "bold" }}>Report Date: </span>
          {new Date(testResult?.createdAt as unknown as Date).toDateString()}
        </div>
        <div>
          <span style={{ fontWeight: "bold" }}>Name: </span>
          {order.patient?.name}
        </div>
        <div>
          <span style={{ fontWeight: "bold" }}>Age: </span>
          {order.patient?.age} Year(s)
        </div>
        <div>
          <span style={{ fontWeight: "bold" }}>Consultant: </span>
          {order?.consultant &&
          typeof order?.consultant === "object" &&
          order?.consultant?.title &&
          order?.consultant?.name
            ? order?.consultant?.title + " " + order?.consultant?.name
            : " "}
        </div>
        <div>
          <span style={{ fontWeight: "bold" }}>Sex: </span>
          {order.patient?.gender}
        </div>
        <div>
          <span style={{ fontWeight: "bold" }}>
            Specimen:{" "}
            <span style={{ fontWeight: "normal" }}>
              {Array.from(specimen as unknown as string[])?.join(", ")}
            </span>
          </span>
        </div>

        <div>
          <span style={{ fontWeight: "bold" }}>Receiving Date: </span>
          {new Date(order.createdAt as Date).toDateString()}
        </div>
        <div>
          <span style={{ fontWeight: "bold" }}>Report Category: </span>
          {reportGroupData?.label}
        </div>
        <div>
          <span style={{ fontWeight: "bold" }}>
            {order?.refBy ? order?.refBy?.code : <></>}
          </span>
        </div>
      </div>
    </>
  );
};

export default PatientInformaiton;
