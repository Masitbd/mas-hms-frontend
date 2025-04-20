// "use client";
// import React, { useEffect, useMemo, useState } from "react";
// import CustomModal from "../CustomModal";
// import { useForm, Controller, useWatch } from "react-hook-form";
// import { Button, Input, SelectPicker } from "rsuite";
// import { useGetHospitalGroupQuery } from "@/redux/api/hospitalGroup/hospitalGroupSlice";
// import { useGetAllWorldsQuery } from "@/redux/api/world.api";
// import { useGetAllBedQuery } from "@/redux/api/bed.api";
// import { useGetAllDoctorsQuery } from "@/redux/api/financialReport/financialReportSlice";
// import { useGetTestsQuery } from "@/redux/api/test/testSlice";
// const AddServiceModal = () => {
//   const [open, setOpen] = useState(false);
//   const { control, handleSubmit, setValue, watch, reset } = useForm();
//   const [doctId, setDoctId] = useState(false);
//   const [bedId, setBedId] = useState(false);
//   const [groupId, setGroupId] = useState("");

//   const { data: groups, isLoading } = useGetHospitalGroupQuery(undefined);
//   // console.log(groups, "datea");

//   const selectedGroup = useWatch({ control, name: "group" });
//   const selectedBedCategory = useWatch({ control, name: "world" });

//   useEffect(() => {
//     if (!selectedGroup) return;

//     const { value, _id } = selectedGroup;

//     if (value === "doctor's related") {
//       setDoctId(_id);
//       setBedId(false); // optional: reset others
//       setGroupId("");
//     } else if (value === "beds & cabins") {
//       setBedId(_id);
//       setDoctId(false);
//       setGroupId("");
//     } else {
//       setGroupId(_id);
//       setDoctId(false);
//       setBedId(false);
//     }
//   }, [selectedGroup]);

//   const { data: bedCategory } = useGetAllWorldsQuery(undefined);
//   const { data: beds } = useGetAllBedQuery({ worldId: selectedBedCategory });
//   const { data: doctors } = useGetAllDoctorsQuery(undefined, {
//     skip: !doctId,
//   });
//   const { data: services } = useGetTestsQuery(
//     { hospitalGroup: groupId },
//     {
//       skip: !groupId,
//     }
//   );

//   const dynamicOptions = useMemo(() => {
//     if (selectedGroup?.value === "doctor's related") {
//       return doctors?.data?.map((doc: any) => ({
//         label: doc.name,
//         value: doc._id,
//         fullObject: doc,
//       }));
//     } else if (selectedGroup?.value === "beds & cabins") {
//       return bedCategory?.data?.map((world: any) => ({
//         label: world.worldName,
//         value: world._id,
//       }));
//     } else {
//       return services?.data?.data?.map((service: any) => ({
//         label: service.label,
//         value: service._id,
//         fullObject: service,
//       }));
//     }
//   }, [selectedGroup, doctors, beds, services]);

//   useEffect(() => {
//     setValue("serviceId", null); // reset service when group changes
//   }, [selectedGroup, setValue]);

//   const selectedService = dynamicOptions?.find(
//     (opt: any) => opt.value === watch("serviceId")
//   )?.fullObject;

//   console.log(selectedService, "service");
//   const onsubmit = (data: any) => {
//     setValue("serviceId", null);
//     setValue("group", null);
//     reset({ group: null, serviceId: null });
//   };

//   return (
//     <div>
//       <CustomModal
//         size="90rem"
//         open={open}
//         setOpen={setOpen}
//         text="Add Service"
//         title="Add Service"
//       >
//         <div className=" rounded p-5">
//           <div className="grid grid-cols-2 gap-6">
//             <form onSubmit={handleSubmit(onsubmit)}>
//               <div className="grid grid-cols-2 gap-5 border p-3">
//                 <div>
//                   <p> Select Group </p>
//                   <Controller
//                     name="group"
//                     control={control}
//                     defaultValue={null}
//                     render={({ field }) => (
//                       <SelectPicker
//                         {...field}
//                         data={groups?.data?.map((item: any) => ({
//                           label: item?.label,
//                           value: item,
//                         }))}
//                         style={{ width: 300 }}
//                         onChange={(value) => field.onChange(value)}
//                         value={field.value}
//                         placeholder="Select an option"
//                         cleanable
//                       />
//                     )}
//                   />
//                 </div>
//                 <div>
//                   <p> Select Service </p>
//                   <Controller
//                     name="serviceId"
//                     control={control}
//                     defaultValue={null}
//                     render={({ field }) => (
//                       <SelectPicker
//                         {...field}
//                         data={dynamicOptions}
//                         style={{ width: 300 }}
//                         disabled={!selectedGroup?._id}
//                         onChange={(value) => field.onChange(value)}
//                         value={field.value}
//                         placeholder="Select an option"
//                         cleanable
//                       />
//                     )}
//                   />
//                 </div>
//                 <div>
//                   <p> Quantity</p>

//                   <div className="flex items-center gap-4 mt-1 ">
//                     <Button color="red" appearance="ghost">
//                       -
//                     </Button>
//                     <p> 1 </p>
//                     <Button appearance="primary">+</Button>
//                   </div>
//                 </div>
//                 <div>
//                   <p> Amount </p>
//                   <Controller
//                     name="amount"
//                     control={control}
//                     defaultValue={null}
//                     render={({ field }) => (
//                       <Input
//                         {...field}
//                         type="number"
//                         style={{ width: 300 }}
//                         onChange={(value) => field.onChange(value)}
//                         value={field.value}
//                         placeholder="Enter Amount"
//                       />
//                     )}
//                   />
//                 </div>
//                 <div></div>
//                 <div className="w-full flex justify-end">
//                   <Button appearance="primary">Add</Button>
//                 </div>
//               </div>
//             </form>
//             {/* bill */}
//             <div className="border p-3">
//               <p className="text-center text-xl font-bold pb-2 border-b-2">
//                 Bill Summery
//               </p>
//             </div>
//           </div>
//           {/* services */}
//           <div className="mt-8 border ">
//             <h1 className="text-center text-xl font-bold">Service Summery</h1>
//           </div>
//         </div>
//       </CustomModal>
//     </div>
//   );
// };

// export default AddServiceModal;

"use client";
import React, { useEffect, useMemo, useState } from "react";
import CustomModal from "../CustomModal";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Button, Input, SelectPicker, Table } from "rsuite";
import { useGetHospitalGroupQuery } from "@/redux/api/hospitalGroup/hospitalGroupSlice";
import { useGetAllWorldsQuery } from "@/redux/api/world.api";
import { useGetAllBedQuery } from "@/redux/api/bed.api";
import { useGetAllDoctorsQuery } from "@/redux/api/financialReport/financialReportSlice";
import { useGetTestsQuery } from "@/redux/api/test/testSlice";

import {
  addService,
  removeService,
  clearServices,
  selectServices,
  selectDoctorBill,
  selectBedCabinsBill,
  selectHospitalBill,
  selectTotalBill,
  ServiceItem,
  selectBackendFormat,
} from "@/redux/features/services/serviceSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useAddPateintServiceMutation } from "@/redux/api/admission.api";
import Swal from "sweetalert2";

const { Column, HeaderCell, Cell } = Table;

interface FormValues {
  group: any;
  serviceId: string;
  doctorId?: string;
  allocatedBed?: string;
  amount: string;
  world?: string;
}

interface OptionType {
  label: string;
  value: string;
  fullObject?: any;
}

const AddServiceModal = ({ regNo }: { regNo: string }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { control, handleSubmit, setValue, watch, reset } =
    useForm<FormValues>();
  const currentUser = useAppSelector((state) => state.auth.user);
  const [doctId, setDoctId] = useState<string | boolean>(false);
  const [bedId, setBedId] = useState<string | boolean>(false);
  const [groupId, setGroupId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  const dispatch = useAppDispatch();
  const services = useAppSelector(selectServices);
  const doctorBill = useAppSelector(selectDoctorBill);
  const bedCabinsBill = useAppSelector(selectBedCabinsBill);
  const hospitalBill = useAppSelector(selectHospitalBill);
  const totalBill = useAppSelector(selectTotalBill);

  const { data: groups, isLoading } = useGetHospitalGroupQuery(undefined);

  const selectedGroup = useWatch({ control, name: "group" });

  const selectedServiceId = useWatch({ control, name: "serviceId" });
  const amount = useWatch({ control, name: "amount" });
  const doctorId = useWatch({ control, name: "doctorId" });
  const allocatedBed = useWatch({ control, name: "allocatedBed" });
  // console.log(selectedServiceId, "bed category");

  useEffect(() => {
    if (!selectedGroup) return;

    const { value, _id } = selectedGroup;

    if (value === "doctor's related") {
      setDoctId(true);
      setBedId("");
      setGroupId(_id);
    } else if (value === "beds & cabins") {
      setBedId(_id);
      setDoctId("");
      setGroupId("");
    } else {
      setGroupId(_id);
      setDoctId(false);
      setBedId("");
    }
  }, [selectedGroup]);

  const { data: bedCategory } = useGetAllWorldsQuery(undefined);
  const { data: beds } = useGetAllBedQuery(
    { worldId: selectedServiceId },
    { skip: !selectedServiceId }
  );
  const { data: doctors } = useGetAllDoctorsQuery(undefined, { skip: !doctId });
  const { data: servicesData, isLoading: serviceLoading } = useGetTestsQuery(
    { hospitalGroup: groupId },
    { skip: !groupId }
  );

  const [serviceAdd, { isLoading: adding }] = useAddPateintServiceMutation();

  const dynamicOptions = useMemo<OptionType[] | undefined>(() => {
    if (selectedGroup?.value === "beds & cabins" && bedCategory?.data) {
      return bedCategory.data.map((world: any) => ({
        label: world.worldName,
        value: world._id,
        fullObject: world,
      }));
    } else if (servicesData?.data?.data) {
      return servicesData.data.data.map((service: any) => ({
        label: service.label,
        value: service._id,
        fullObject: service,
      }));
    }
    return [];
  }, [selectedGroup, doctors, bedCategory, servicesData]);

  useEffect(() => {
    setValue("serviceId", "");
    setValue("amount", "");
    setQuantity(1);
  }, [selectedGroup, setValue]);

  const increaseQuantity = (): void => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = (): void => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const selectedSId = watch("serviceId");

  const onSubmit = (data: FormValues): void => {
    if (!selectedGroup || !selectedServiceId || !amount) {
      // Handle validation
      return;
    }

    // Get the service name from the selected option
    const serviceName =
      dynamicOptions?.find((opt) => opt.value === selectedServiceId)?.label ||
      "";

    dispatch(
      addService({
        serviceCategory: selectedGroup.value,
        serviceId: selectedServiceId,
        serviceName,
        servicedBy: currentUser?.uuid,
        amount: parseFloat(amount),
        quantity,
        allocatedBed,
        doctorId,
      })
    );

    // Reset the form
    setValue("serviceId", "");
    setValue("amount", "");
    setQuantity(1);
  };

  const handleRemoveService = (index: number): void => {
    const serviceToRemove = services[index];
    dispatch(
      removeService({
        index,
        serviceCategory: serviceToRemove.serviceCategory,
      })
    );
  };

  const handleSubmitToDB = async () => {
    const backendPayload = services.map((service) => ({
      serviceCategory: service.serviceCategory,
      serviceId: service.serviceId,
      servicedBy: service.servicedBy,
      amount: service.amount,
      quantity: service.quantity,
      doctorId: service?.doctorId,
      // allocatedBed: service?.allocatedBed,
    }));
    const allocatedBed = services?.find(
      (service) => service?.allocatedBed
    )?.allocatedBed;
    const paylaod = {
      regNo,
      services: backendPayload,
      allocatedBed,
      totalBill,
    };

    try {
      const res = await serviceAdd(paylaod).unwrap();

      if (res.success) {
        dispatch(clearServices());
        Swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          title: "Added successfully",
          icon: "success",
        });
        await setOpen(false);
      }
    } catch (err) {
      console.log(err, "error");
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        title: "Something Went Wrong",
        icon: "error",
      });
    }
  };

  return (
    <div>
      <CustomModal
        size="90rem"
        open={open}
        setOpen={setOpen}
        text="Add Service"
        title="Add Service"
      >
        <p> {regNo} </p>
        <div className="rounded p-5">
          <div className="grid grid-cols-2 gap-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-5 border p-3">
                <div>
                  <p>Select Group</p>
                  <Controller
                    name="group"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <SelectPicker
                        {...field}
                        data={
                          groups?.data?.map((item: any) => ({
                            label: item?.label,
                            value: item,
                          })) || []
                        }
                        style={{ width: 300 }}
                        onChange={(value) => field.onChange(value)}
                        value={field.value}
                        placeholder="Select an option"
                        cleanable
                      />
                    )}
                  />
                </div>
                <div>
                  <p>Select Service</p>
                  <Controller
                    name="serviceId"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <SelectPicker
                        {...field}
                        data={dynamicOptions || []}
                        style={{ width: 300 }}
                        disabled={!selectedGroup?._id || serviceLoading}
                        onChange={(value) => {
                          field.onChange(value);
                          const selected = dynamicOptions?.find(
                            (opt) => opt.value === value
                          )?.fullObject;
                          if (selected?.price || selected?.charge) {
                            setValue(
                              "amount",
                              selected.price ?? selected.charge
                            );
                          }
                        }}
                        value={field.value}
                        placeholder="Select an option"
                        cleanable
                      />
                    )}
                  />
                </div>
                <div>
                  <p>Quantity</p>
                  <div className="flex items-center gap-4 mt-1">
                    <Button
                      color="red"
                      appearance="ghost"
                      onClick={decreaseQuantity}
                    >
                      -
                    </Button>
                    <p>{quantity}</p>
                    <Button appearance="primary" onClick={increaseQuantity}>
                      +
                    </Button>
                  </div>
                </div>
                {/* if doctor */}

                {doctId && (
                  <div>
                    <p>Select Doctor</p>
                    <Controller
                      name="doctorId"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <SelectPicker
                          {...field}
                          data={
                            doctors?.data?.map((doc: any) => ({
                              label: doc.name,
                              value: doc._id,
                              fullObject: doc,
                            })) || []
                          }
                          style={{ width: 300 }}
                          disabled={!selectedGroup?._id || serviceLoading}
                          onChange={(value) => field.onChange(value)}
                          value={field.value}
                          placeholder="Select an option"
                          cleanable
                        />
                      )}
                    />
                  </div>
                )}
                {/* bed id */}
                {bedId && (
                  <div>
                    <p>Select Bed</p>
                    <Controller
                      name="allocatedBed"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <SelectPicker
                          {...field}
                          data={
                            beds?.data?.map((doc: any) => ({
                              label: doc.bedName,
                              value: doc._id,
                            })) || []
                          }
                          style={{ width: 300 }}
                          disabled={!selectedGroup?._id || serviceLoading}
                          onChange={(value) => field.onChange(value)}
                          value={field.value}
                          placeholder="Select an option"
                          cleanable
                        />
                      )}
                    />
                  </div>
                )}

                <div>
                  <p>Amount</p>
                  <Controller
                    name="amount"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        style={{ width: 300 }}
                        onChange={(value) => field.onChange(value)}
                        value={field.value}
                        placeholder="Enter Amount"
                      />
                    )}
                  />
                </div>
                <div></div>
                <div className="w-full flex justify-end">
                  <Button appearance="primary" type="submit">
                    Add
                  </Button>
                </div>
              </div>
            </form>

            {/* Bill Summary */}
            <div className="border p-3">
              <p className="text-center text-xl font-bold pb-2 border-b-2">
                Bill Summary
              </p>

              <div className="mt-4">
                <div className="flex justify-between border-b-2 mb-3 font-bold text-xl p-3 rounded bg-slate-100">
                  <p>Particular</p>
                  <p>Amount</p>
                </div>
                {doctorBill.items.length > 0 && (
                  <div className="mb-3 flex justify-between">
                    <h3 className="font-bold">Doctor's Bill</h3>
                    <p>{doctorBill.total.toFixed(2)}</p>
                  </div>
                )}
                {bedCabinsBill.items.length > 0 && (
                  <div className="mb-3 flex justify-between">
                    <h3 className="font-bold">Beds & Cabins Bill</h3>
                    <p>{bedCabinsBill.total.toFixed(2)}</p>
                  </div>
                )}
                {hospitalBill.items.length > 0 && (
                  <div className="mb-3 flex justify-between">
                    <h3 className="font-bold">Hospital Bill</h3>
                    <p>{hospitalBill.total.toFixed(2)}</p>
                  </div>
                )}
                <div className="mt-5 pt-3 border-t-2 flex justify-between">
                  <h3 className="font-bold text-lg">Total Bill</h3>
                  <p className="text-lg">{totalBill.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Summary Table */}
          <div className="mt-8 border p-3 w-full max-w-[49%]">
            <h1 className="text-center text-xl font-bold mb-4">
              Service Summary
            </h1>

            <Table height={400} data={services} autoHeight>
              <Column width={200}>
                <HeaderCell>Service Name</HeaderCell>
                <Cell dataKey="serviceName" />
              </Column>

              <Column width={100}>
                <HeaderCell>Quantity</HeaderCell>
                <Cell dataKey="quantity" />
              </Column>

              <Column width={120}>
                <HeaderCell>Unit Price</HeaderCell>
                <Cell>
                  {(rowData: ServiceItem) => `${rowData.amount.toFixed(2)}`}
                </Cell>
              </Column>

              <Column width={120}>
                <HeaderCell>Total</HeaderCell>
                <Cell>
                  {(rowData: ServiceItem) =>
                    `${rowData.totalAmount.toFixed(2)}`
                  }
                </Cell>
              </Column>

              <Column width={80}>
                <HeaderCell>Action</HeaderCell>
                <Cell>
                  {(rowData: ServiceItem, rowIndex?: number) => (
                    <Button
                      appearance="subtle"
                      color="red"
                      onClick={() => handleRemoveService(rowIndex!)}
                    >
                      -
                    </Button>
                  )}
                </Cell>
              </Column>
            </Table>
          </div>
          <Button
            onClick={handleSubmitToDB}
            disabled={adding}
            className="my-10 w-full"
            color="cyan"
            appearance="primary"
          >
            {adding ? "Please wait..." : "Submit"}
          </Button>
        </div>
      </CustomModal>
    </div>
  );
};

export default AddServiceModal;
