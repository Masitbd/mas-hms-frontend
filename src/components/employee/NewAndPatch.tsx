import React, { useRef, useState } from "react";
import {
  defaultEmployeeRegistration,
  genderConstant,
  IEmployeeRegistration,
  IPropsForEmployeeRegistration,
  maritalStatus,
  model,
} from "./TypesAndDefaults";
import {
  Button,
  DatePicker,
  Form,
  FormInstance,
  Message,
  SelectPicker,
  toaster,
} from "rsuite";
import RModal from "../ui/Modal";
import { ENUM_MODE } from "@/enum/Mode";
import { Textarea } from "../companyInfo/TextArea";
import LogoUploader from "../companyInfo/LogoUploader";
import {
  usePatchEmployeeMutation,
  usePostEmployeeMutation,
} from "@/redux/api/employee/employeeSlice";

const NewAndPatch = (props: IPropsForEmployeeRegistration) => {
  const ref = useRef<FormInstance>(null);
  const { data, mode, setData, setModalOpen, setMode, modalOpen } = props;

  const [
    post,
    { isLoading: postLoading, isError: postError, error: postErrorMessage },
  ] = usePostEmployeeMutation();
  const [
    patch,
    { isLoading: patchLoading, isError: PatchError, error: patchErrorMessage },
  ] = usePatchEmployeeMutation();

  const [image, setImage] = useState();

  const afterSubmitOrCancel = () => {
    setModalOpen(false);
    setData(defaultEmployeeRegistration);
    setMode(ENUM_MODE.NEW);
  };

  const submitHandler = async () => {
    // afterSubmitOrCancel();
    if (ref.current && ref?.current?.check()) {
      try {
        const empData = {
          ...data,
          age:
            new Date().getFullYear() -
              new Date(data?.dateOfBirth).getFullYear() || 0,
        };
        if (mode == ENUM_MODE.NEW) {
          const result = await post(empData).unwrap();
          if (result.success == true) {
            swal("Success", `${result.message}`, "success");
            afterSubmitOrCancel();
          }
        }

        if (mode == ENUM_MODE.EDIT) {
          const result = await patch({ data: data, id: data?._id }).unwrap();
          if (result.success == true) {
            if (result.success == true) {
              swal("Success", `${result.message}`, "success");
              afterSubmitOrCancel();
            }
          }
        }
      } catch (error) {
        if (postError || PatchError) {
          swal("Error", `${postErrorMessage || patchErrorMessage}`, "error");
        }
      }
    } else {
      toaster.push(
        <Message type="error">Please Fill out all the fields</Message>
      );
    }
  };

  const cancelHandler = () => {
    afterSubmitOrCancel();
  };

  return (
    <div>
      <RModal
        open={modalOpen}
        size="lg"
        title="Employee Information"
        okHandler={submitHandler}
        cancelHandler={cancelHandler}
        loading={postLoading || patchLoading}
      >
        <Form
          fluid
          onChange={(formValue) => setData(formValue as IEmployeeRegistration)}
          disabled={mode == ENUM_MODE.VIEW}
          formValue={data}
          model={model}
          ref={ref as React.Ref<FormInstance>}
        >
          <div className="my-5 border  shadow-lg mx-5">
            <div className="bg-[#3498ff] text-white px-2 py-2">
              <h2 className="text-center text-xl font-semibold">
                Personal Information
              </h2>
            </div>
            <div className="m-2 grid grid-cols-2 gap-5 gap-y-0">
              <Form.Group controlId="name">
                <Form.ControlLabel>Name</Form.ControlLabel>
                <Form.Control name="name" />
              </Form.Group>
              <Form.Group controlId="fatherName">
                <Form.ControlLabel>Father Name</Form.ControlLabel>
                <Form.Control name="fatherName" />
              </Form.Group>
              <Form.Group controlId="motherName">
                <Form.ControlLabel>Mother Name</Form.ControlLabel>
                <Form.Control name="motherName" />
              </Form.Group>
              <Form.Group controlId="religion">
                <Form.ControlLabel>Religion</Form.ControlLabel>
                <Form.Control name="religion" />
              </Form.Group>
              <Form.Group controlId="maritalStatus">
                <Form.ControlLabel>Marital Stauts</Form.ControlLabel>
                <Form.Control
                  name="maritalStatus"
                  accepter={SelectPicker}
                  block
                  data={maritalStatus}
                  searchable={false}
                />
              </Form.Group>
              <Form.Group controlId="gender">
                <Form.ControlLabel>Gender</Form.ControlLabel>
                <Form.Control
                  name="gender"
                  accepter={SelectPicker}
                  searchable={false}
                  block
                  data={genderConstant}
                />
              </Form.Group>

              <Form.Group controlId="dateOfBirth">
                <Form.ControlLabel>Date Of Birth</Form.ControlLabel>
                <Form.Control
                  name="dateOfBirth"
                  accepter={DatePicker}
                  value={new Date(data?.dateOfBirth)}
                  block
                  oneTap
                />
              </Form.Group>
              <div className="row-span-2">
                <LogoUploader
                  defaultImage={data?.defaultImage as string}
                  image={image}
                  setImage={setImage}
                />
              </div>
              <Form.Group controlId="age">
                <Form.ControlLabel>Age</Form.ControlLabel>
                <Form.Control
                  name="age"
                  block
                  value={
                    new Date().getFullYear() -
                      new Date(data?.dateOfBirth).getFullYear() || 0
                  }
                  disabled
                />
              </Form.Group>
            </div>
          </div>

          <div className="my-5 border  shadow-lg mx-5">
            <div className="bg-[#3498ff] text-white px-2 py-2">
              <h2 className="text-center text-xl font-semibold">Address</h2>
            </div>
            <div className="m-2 grid grid-cols-2 gap-5 gap-y-0">
              <Form.Group controlId="nationality">
                <Form.ControlLabel>Nationality</Form.ControlLabel>
                <Form.Control name="nationality" />
              </Form.Group>
              <Form.Group controlId="district">
                <Form.ControlLabel>Distirct</Form.ControlLabel>
                <Form.Control name="district" />
              </Form.Group>
              <Form.Group controlId="presentAddress" className="col-span-2">
                <Form.ControlLabel>Present Address</Form.ControlLabel>
                <Form.Control name="presentAddress" accepter={Textarea} />
              </Form.Group>
              <Form.Group controlId="parmanentAddress" className="col-span-2">
                <Form.ControlLabel>Parmanent Address</Form.ControlLabel>
                <Form.Control name="parmanentAddress" accepter={Textarea} />
              </Form.Group>
            </div>
          </div>

          <div className="my-5 border  shadow-lg mx-5">
            <div className="bg-[#3498ff] text-white px-2 py-2">
              <h2 className="text-center text-xl font-semibold">
                Contact Information
              </h2>
            </div>
            <div className="m-2 grid grid-cols-2 gap-5 gap-y-0">
              <Form.Group controlId="phoneNo">
                <Form.ControlLabel>Phone</Form.ControlLabel>
                <Form.Control name="phoneNo" type="number" />
              </Form.Group>
              <Form.Group controlId="email">
                <Form.ControlLabel>Email</Form.ControlLabel>
                <Form.Control name="email" type="email" />
              </Form.Group>
            </div>
          </div>
        </Form>
      </RModal>
    </div>
  );
};

export default NewAndPatch;
