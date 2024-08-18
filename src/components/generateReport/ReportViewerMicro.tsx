/* eslint-disable react/display-name */
import React, { forwardRef, LegacyRef, useRef } from "react";
import { IOrderData } from "../order/initialDataAndTypes";
import {
  IDoctor,
  IReportGroup,
  IResultField,
} from "@/types/allDepartmentInterfaces";
import {
  Isensitivity,
  ITEstREsultForMicroBio,
  ITestResultForParameter,
} from "./initialDataAndTypes";
import { camelToFlat } from "@/utils/CamelToFlat";
import { getPageMargins } from "./functions";
import PatientInformaiton from "./PatientInformaiton";
import { useGetSingleDoctorQuery } from "@/redux/api/doctor/doctorSlice";
import Loading from "@/app/loading";
import { useGetMiscQuery } from "@/redux/api/miscellaneous/miscellaneousSlice";
import { Table } from "rsuite";
import { ISensitivity } from "../bactrologicalInfo/typesAndInitialData";

const ReportViewerMicro = React.forwardRef(
  (
    params: {
      order: IOrderData;
      reportGroup: IReportGroup;
      result: ITEstREsultForMicroBio;
    },

    ref: LegacyRef<HTMLDivElement>
  ) => {
    const { Cell, Column, ColumnGroup, HeaderCell } = Table;
    const { order, reportGroup, result } = params;
    const {
      data: doctorData,
      isLoading: doctorDataLoading,
      isFetching: doctorDataFeatching,
    } = useGetSingleDoctorQuery(params?.order?.consultant as string);

    const { data: discRiptionData } = useGetMiscQuery({
      title: params.result.specimen,
    });

    const temp = result?.temperature;
    const bact = result?.bacteria;
    const dur = result?.duration;
    const cond = result?.condition;
    const replacePlaceholders = (str: string) => {
      if (str) {
        return str
          .replace("${temp}", temp + "°")
          .replace("${bact}", bact as string)
          .replace("${dur}", dur)
          .replace("${cond}", cond);
      } else return " ";
    };

    const fields = ["ANTIBIOTIC", "mic", "interpretation", "breakPoint"];

    const growth = result?.growth || false;
    if (doctorDataLoading || doctorDataFeatching) {
      return <Loading />;
    }

    return (
      <>
        <div className="my-5 mx-5" ref={ref}>
          <div>
            <PatientInformaiton
              consultant={{ data: doctorData }}
              order={params.order}
              testResult={params.result}
            />
          </div>

          <div>
            <div className="flex items-center justify-center">
              <div className=" border-stone-700 border rounded-md px-5 py-2 text-xl font-serif font-bold">
                {params.reportGroup.label}
              </div>
            </div>
          </div>

          {!growth ? (
            <>
              <div className="font-serif">
                <h3 className="text-xl font-bold">
                  CULTURE OF {result?.specimen}
                </h3>

                <span className="font-sans">
                  {" "}
                  {replacePlaceholders(discRiptionData?.data[0]?.value)}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-12">
                <div className="col-span-3 font-serif">Shows Growth Of:</div>
                <div className="text-xl  font-normal">{result.bacteria}</div>
                <div className="row-start-2 col-span-3 ">Colony Count:</div>
                <div className="row-start-2 w-full col-span-3 text-lg">
                  <code className="block">
                    1 X {result?.colonyCount?.base} 10
                    <sup>{result?.colonyCount?.power}</sup> /ml.
                  </code>
                </div>
              </div>

              {result?.sensivityOptions &&
                result.sensivityOptions.length > 0 && (
                  <>
                    {" "}
                    <div className="my-5  border-stone-500 border-2">
                      <div className="">
                        <h2 className="text-center text-xl font-bold  border-stone-500 border-2 py-2 font-serif">
                          ANTI BIOGRAM OF ORGANISMS ISOLATED
                        </h2>
                      </div>
                      <div className="grid grid-cols-12 divide-y divide-x text-sm font-serif font-bold">
                        <div className="col-span-5  px-2 py-2 font-bold">
                          {fields[0]}
                        </div>
                        <div className="col-span-2 px-2 py-2 font-bold uppercase">
                          {fields[1]}
                        </div>
                        <div className="col-span-3  px-2 py-2 font-bold uppercase">
                          {fields[2]}
                        </div>
                        <div className="col-span-2  px-2 py-2 font-bold uppercase">
                          {fields[3]}
                        </div>
                        {result?.sensivityOptions &&
                          result?.sensivityOptions?.length > 0 &&
                          result.sensivityOptions?.map(
                            (sensitivity: ISensitivity) => {
                              return fields.map((field: string) => {
                                return (
                                  <>
                                    <div
                                      className={`${
                                        field == fields[0]
                                          ? "col-span-5"
                                          : field == fields[2]
                                          ? "col-span-3"
                                          : "col-span-2"
                                      } px-2 py-2 font-serif font-normal`}
                                    >
                                      {field == fields[0]
                                        ? sensitivity.value
                                        : sensitivity[
                                            field as keyof ISensitivity
                                          ]}
                                    </div>
                                  </>
                                );
                              });
                            }
                          )}
                      </div>
                    </div>
                  </>
                )}
            </>
          )}
          {result?.comment ? (
            <div className="border border-1  p-2 grid grid-cols-2 gap-1 my-5 rounded-md font-serif">
              <div
                dangerouslySetInnerHTML={{
                  __html: result?.comment,
                }}
              />
            </div>
          ) : (
            ""
          )}
          <div>
            {result.seal ? (
              <div className="flex justify-end items-end font-serif mt-5">
                <div
                  dangerouslySetInnerHTML={{
                    __html: result?.seal,
                  }}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </>
    );
  }
);

export default ReportViewerMicro;
