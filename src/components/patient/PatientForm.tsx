import { IPatient1 } from "@/app/(withlayout)/patient/page";
import { useGetDoctorQuery } from "@/redux/api/doctor/doctorSlice";
import { IDoctor } from "@/types/allDepartmentInterfaces";
import Image from "next/image";
import { useState } from "react";
import {
  Avatar,
  DatePicker,
  Form,
  InputPicker
} from "rsuite";
import swal from 'sweetalert';

const PatientForm = ({
  defaultValue,
  forwardedRef,
  fileRef,
  formData,
  setfromData,
  mode,
  model,
}: {
  defaultValue?: any;
  fileRef: any;
  forwardedRef: any;
  formData: IPatient1;
  setfromData: (data: IPatient1) => void;
  mode: string;
  model: any;
}) => {
  const genderType = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "other" },
  ];
  const matarialType = [
    { label: "Married", value: "married" },
    { label: "Unmarried", value: "unmarried" },
  ];
  const religionType = [
    { label: "Islam", value: "islam" },
    { label: "Christan", value: "christan" },
    { label: "Hindus", value: "hindus" },
    { label: "Buddis", value: "buddis" },
    { label: "Jews", value: "jews" },
    { label: "Atheist", value: "atheist" },
  ];
  const bloodType = [
    { label: "A+", value: "A+" },
    { label: "A-", value: "A-" },
    { label: "B+", value: "B+" },
    { label: "B-", value: "B-" },
    { label: "O+", value: "O+" },
    { label: "O-", value: "O-" }
  ];
  console.log(formData)
  const { data: doctorData } = useGetDoctorQuery(undefined);
  const [selected, setSelected] = useState<ArrayBuffer | string | undefined>('')
  return (
    <div className=" px-5 ">
      <div className="my-5">
        <h1 className="font-bold text-2xl">General Information</h1>
        <hr></hr>
      </div>
      <div></div>
      <Form
        onChange={(e) => setfromData({
          name: e.name,
          fatherName: e.fatherName,
          motherName: e.motherName,
          age: e.age,
          gender: e.gender,
          permanentAddress: e.permanentAddress,
          presentAddress: e.presentAddress,
          maritalStatus: e.maritalStatus,
          dateOfBirth: e.dateOfBirth,
          district: e.district,
          religion: e.religion,
          nationality: e.nationality,
          admissionDate: e.admissionDate,
          bloodGroup: e.bloodGroup,
          passportNo: e.passportNo,
          courseDuration: e.courseDuration,
          typeOfDisease: e.typeOfDisease,
          nationalID: e.nationalID,
          totalAmount: e.totalAmount,
          ref_by: e.ref_by,
          consultant: e.consultant,
          phone: e.phone,
          email: e.email,
          image: e.image,
        })}
        ref={forwardedRef}
        model={model}
        className="grid grid-cols-3 gap-5 justify-center w-full"
        fluid
        formValue={defaultValue}
        readOnly={mode === "watch"}
      >
        <Form.Group controlId="name">
          <Form.ControlLabel>Name</Form.ControlLabel>
          <Form.Control name="name" htmlSize={100} />
        </Form.Group>
        <Form.Group controlId="fatherName">
          <Form.ControlLabel>{`Father's Name`}</Form.ControlLabel>
          <Form.Control name="fatherName" htmlSize={100} />
        </Form.Group>
        <Form.Group controlId="motherName">
          <Form.ControlLabel>{`Mother's Name`}</Form.ControlLabel>
          <Form.Control name="motherName" htmlSize={100} />
        </Form.Group>
        <Form.Group controlId="age">
          <Form.ControlLabel>Age</Form.ControlLabel>
          <Form.Control name="age" htmlSize={100} />
        </Form.Group>
        <Form.Group controlId="gender">
          <Form.ControlLabel>Gender</Form.ControlLabel>
          <Form.Control
            name="gender"
            accepter={InputPicker}
            data={genderType}
            className="w-full"
          />
        </Form.Group>
        <Form.Group controlId="presentAddress">
          <Form.ControlLabel>Present Address</Form.ControlLabel>
          <Form.Control name="presentAddress" className="w-full" />
        </Form.Group>
        <Form.Group controlId="permanentAddress">
          <Form.ControlLabel>Permanent Address</Form.ControlLabel>
          <Form.Control name="permanentAddress" className="w-full" />
        </Form.Group>
        <Form.Group controlId="phone">
          <Form.ControlLabel>Phone</Form.ControlLabel>
          <Form.Control name="phone" className="w-full" />
        </Form.Group>
        <Form.Group controlId="maritalStatus">
          <Form.ControlLabel>Marital Status</Form.ControlLabel>
          <Form.Control
            name="maritalStatus"
            accepter={InputPicker}
            data={matarialType}
            className="w-full"
          />
        </Form.Group>
        <Form.Group controlId="dateOfBirth">
          <Form.ControlLabel>Date Of Birth</Form.ControlLabel>
          <Form.Control name="dateOfBirth"  format="dd.MM.yyyy"  accepter={DatePicker} />
        </Form.Group>
        <Form.Group controlId="email">
          <Form.ControlLabel>Email</Form.ControlLabel>
          <Form.Control name="email" type="email" />
        </Form.Group>
        <Form.Group controlId="district">
          <Form.ControlLabel>District</Form.ControlLabel>
          {/* <Form.Control
            name="district"
            accepter={InputPicker}
            data={districtType}
            className="w-full"
          /> */}
          <Form.Control name="district" />
        </Form.Group>
        <Form.Group controlId="religion">
          <Form.ControlLabel>Religion</Form.ControlLabel>
          <Form.Control
            name="religion"
            accepter={InputPicker}
            data={religionType}
            className="w-full"
          />
        </Form.Group>
        <Form.Group controlId="nationality">
          <Form.ControlLabel>Nationality</Form.ControlLabel>
          <Form.Control name="nationality" />
        </Form.Group>
        <Form.Group controlId="admissionDate">
          <Form.ControlLabel>Admission Date</Form.ControlLabel>
          <Form.Control name="admissionDate" format="dd.MM.yyyy" accepter={DatePicker} />
        </Form.Group>
        <Form.Group controlId="bloodGroup">
          <Form.ControlLabel>Blood Group</Form.ControlLabel>
          <Form.Control
            name="bloodGroup"
            accepter={InputPicker}
            data={bloodType}
            className="w-full"
          />
        </Form.Group>
        <Form.Group controlId="passportNo">
          <Form.ControlLabel>Passport No</Form.ControlLabel>
          <Form.Control name="passportNo" />
        </Form.Group>
        <Form.Group controlId="courseDuration">
          <Form.ControlLabel>Course Duration</Form.ControlLabel>
          <Form.Control name="courseDuration" />
        </Form.Group>
        <Form.Group controlId="typeOfDisease">
          <Form.ControlLabel>Type Of Disease</Form.ControlLabel>
          <Form.Control name="typeOfDisease" />
        </Form.Group>
        <Form.Group controlId="nationalID">
          <Form.ControlLabel>National ID</Form.ControlLabel>
          <Form.Control name="nationalID" />
        </Form.Group>
        <Form.Group controlId="totalAmount">
          <Form.ControlLabel>Total Amount</Form.ControlLabel>
          <Form.Control name="totalAmount" />
        </Form.Group>
        <Form.Group controlId="ref_by">
          <Form.ControlLabel>Refered By</Form.ControlLabel>
          <Form.Control
            name="ref_by"
            accepter={InputPicker}
            data={doctorData?.data.map((data: IDoctor) => {
              return { label: data.name, value: data._id };
            })}
            className="w-full"
          />
        </Form.Group>
        <Form.Group controlId="consultant">
          <Form.ControlLabel>Consultent</Form.ControlLabel>
          <Form.Control
            name="consultant"
            accepter={InputPicker}
            data={doctorData?.data.map((data: IDoctor) => {
              return { label: data.name, value: data._id };
            })}
            className="w-full"
          />
        </Form.Group>
        {
          mode === "watch" ? (defaultValue.image ? (
            <Image src={defaultValue.image} alt='profile' width={300} height={250} />
          ) : null) : (<Form.Group controlId="patientPhoto">
            <Form.ControlLabel>{`Patient's Photo`}</Form.ControlLabel>
            <Form.Group controlId="file">
              <Form.ControlLabel>{`Please Select image`}</Form.ControlLabel>
              <input type="file" accept="image/jpeg, image/png" onChange={() => {
                const reader = new FileReader();
                const file = fileRef.current?.files?.[0];
                if (!file) {
                  console.log('no file selected')
                  return;
                }
                if (!file.type.startsWith('image/')) {
                  swal(`InValid file type. please select on image`, {
                    icon: "warning",
                  })
                  return;
                }
                reader.readAsDataURL(file as Blob)
                reader.onload = (e) => {
                  setSelected(e.target?.result ?? '')
                }

              }} ref={fileRef} />
            </Form.Group>
            {
              selected && (
                <Avatar
                  size='lg'
                  src={selected as string}
                  alt="@SevenOutman"
                />
              )
            }

          </Form.Group>)
        }
      </Form>
      {/* Result Fields */}
    </div>
  );
};

export default PatientForm;
