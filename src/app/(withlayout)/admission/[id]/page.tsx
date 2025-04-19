"use client";

import AddServiceModal from "@/components/Patient-Admission/AddServiceModal";
import BedTransferModal from "@/components/Patient-Admission/BedTransferModal";
import DueCollectionModal from "@/components/Patient-Admission/DueCollectionModal";
import {
  useGetDetailsAdmissionQuery,
  useReleaseAdmittedPatientMutation,
} from "@/redux/api/admission.api";
import { Button } from "rsuite";
import Swal from "sweetalert2";

type TParams = {
  params: { id: string };
};

const AdmissionDetilsPage = ({ params }: TParams) => {
  const { id } = params;

  const { data: detailsAdmission, isLoading } = useGetDetailsAdmissionQuery(
    id,
    {
      skip: !id,
    }
  );
  const [release, { isLoading: releasing }] =
    useReleaseAdmittedPatientMutation();
  // handler

  const handleRealese = (id: string, bedId: string) => {
    const option = { id, bedId };
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Release it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await release(option).unwrap();
        // console.log(res, "res");
        if (res.success) {
          Swal.fire({
            title: "Patient Released!",
            showConfirmButton: false,
            position: "top-end",
            toast: true,
            timer: 3000,
            timerProgressBar: true,
            icon: "success",
          });
        }
      }
    });
  };

  const data = detailsAdmission?.data[0];
  // console.log(data)

  return (
    <div className="w-full px-10 mt-5">
      <h1 className="bg-blue-500 w-80 py-3 px-1 rounded text-slate-100 text-center mx-auto font-bold text-xl leading-5 ">
        Patient Admission Details
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-16">
        <div className="border py-2 px-1 rounded">
          <p>
            <span className="font-bold me-2">RegNo:</span>
            {data?.regNo}
          </p>
        </div>
        <div className="border py-2 px-1 rounded">
          <p>
            <span className="font-bold me-2">Name :</span>
            {data?.name}
          </p>
        </div>
        <div className="border py-2 px-1 rounded">
          <p>
            <span className="font-bold me-2">Admission Date:</span>
            {new Date(data?.admissionDate).toLocaleDateString()}
          </p>
        </div>
        <div className="border py-2 px-1 rounded">
          <p>
            <span className="font-bold me-2">Admission Time : </span>
            {new Date(data?.admissionTime).toLocaleTimeString()}
          </p>
        </div>
        {/*  */}
        <div className="border py-2 px-1 rounded">
          <p>
            <span className="font-bold me-2">World Name : </span>
            {data?.allocatedBedDetails?.world?.worldName}
          </p>
        </div>
        <div className="border py-2 px-1 rounded">
          <p>
            <span className="font-bold me-2">Bed Name : </span>
            {data?.allocatedBedDetails?.bedName}
          </p>
        </div>
        <div className="border py-2 px-1 rounded">
          <p>
            <span className="font-bold me-2">Floor : </span>
            {data?.allocatedBedDetails?.floor}
          </p>
        </div>
        <div className="border py-2 px-1 rounded">
          <p>
            <span className="font-bold me-2">Day Stayed : </span>
            {data?.daysStayed}
          </p>
        </div>
      </div>
      {/* payment info */}
      <h1 className="bg-blue-500 mt-4 w-80 py-3 px-1 rounded text-slate-100 text-center mx-auto font-bold text-xl leading-5 ">
        Payment Details
      </h1>
      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-5">
        {/* 1st */}
        <div className="border py-2 px-1 rounded">
          <p>
            <span className="font-bold me-2">Total Amount:</span>
            {data?.totalAmount}
          </p>
        </div>
        <div className="border py-2 px-1 rounded">
          <p>
            <span className="font-bold me-2">Total Paid:</span>
            <span className="text-green-500">
              {data?.paymentInfo?.totalPaid}
            </span>
          </p>
        </div>
        <div className="border py-2 px-1 rounded">
          <p>
            <span className="font-bold me-2">Due Amount:</span>
            <span className="text-red-500">
              {data?.totalAmount - data?.paymentInfo?.totalPaid}
            </span>
          </p>
        </div>
      </div>
      {/* button group */}

      <div className="flex justify-between px-10 mt-10">
        <DueCollectionModal data={data} />

        <BedTransferModal
          id={data?._id}
          dayStayed={data?.daysStayed}
          totalAmount={data?.totalAmount}
          patientRegNo={data?.regNo}
          previousBed={data?.allocatedBed}
          firstAdmitDate={data?.admissionDate}
          isReleased={data?.status}
        />
        <AddServiceModal />
        {releasing ? (
          <Button appearance="primary" loading />
        ) : (
          <Button
            disabled={data?.status === "released" || releasing}
            onClick={() => handleRealese(data?._id, data?.allocatedBed)}
            size="lg"
            appearance="ghost"
            color="red"
          >
            Release
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdmissionDetilsPage;
