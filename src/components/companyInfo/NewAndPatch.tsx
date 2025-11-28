import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import RModal from "../ui/Modal";
import { Checkbox, Form, Message, toaster } from "rsuite";
import LogoUploader from "./LogoUploader";
import { Textarea } from "./TextArea";
import { UploaderInstance } from "rsuite/esm/Uploader/Uploader";
import { ENUM_MODE } from "@/enum/Mode";
import { DefaultCompanyData } from "./TypesAndDefaults";
import {
  useGetDefaultQuery,
  useLazyGetCloudinarySecretQuery,
  useLazyGetCreatableQuery,
  usePatchCompanyInfoMutation,
  usePostCompanyInfoMutation,
} from "@/redux/api/companyInfo/companyInfoSlice";
import swal from "sweetalert";
interface IProps {
  mode: string;
  open: boolean;
  data: {
    _id?: string;
    name: string;
    address: string;
    phone: string;
    photoUrl?: string;
    default: boolean;
    publicId?: string;
    photo?: string;
  };
  setOpen: Dispatch<SetStateAction<boolean>>;
  setData: Dispatch<SetStateAction<any>>;
}

const NewAndPatch = (props: IProps) => {
  const [post, { isLoading: postLoading }] = usePostCompanyInfoMutation();
  const [patch, { isLoading: patchLoading }] = usePatchCompanyInfoMutation();
  const [getSecret, { isLoading: secretLoading, isFetching: secretFeatchng }] =
    useLazyGetCloudinarySecretQuery();
  const [
    getCreatableConf,
    {
      isLoading: creatableConfermationLoading,
      isFetching: creatableConfermationfeatching,
    },
  ] = useLazyGetCreatableQuery();

  const { mode, open, setOpen, data, setData } = props;
  const uploaderRef = useRef<React.MutableRefObject<UploaderInstance>>();
  const [imageData, setImageData] = useState();
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  // For turning the image data to a base 64 data
  const toBase64 = (file: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const okHandler = async () => {
    let reFindedData = { ...data };

    if (mode == ENUM_MODE.NEW || mode == ENUM_MODE.EDIT) {
      if (imageData) {
        const base64ImageData = await toBase64(imageData as unknown as Blob);
        if (base64ImageData) {
          reFindedData = { ...data, photo: base64ImageData as string };
        }
      }
    }
    if (mode == ENUM_MODE.NEW) {
      const result = await post(reFindedData);
      if ("data" in result) {
        swal("Success", "Company info posted successfully", "success");
        setData(DefaultCompanyData);
        setOpen(false);
        setImageData(undefined);
      } else {
        swal("Error", `${result?.error}`, "error");
      }
    }
    if (mode == ENUM_MODE.EDIT) {
      //edit logic
      const result = await patch({ data: reFindedData, id: data?._id });
      if ("data" in result) {
        swal("Success", "Company info Updated successfully", "success");
        setData(DefaultCompanyData);
        setOpen(false);
        setImageData(undefined);
        setOpen(false);
      } else {
        swal("Error", `${result?.error}`, "error");
      }
    } else {
      setData(DefaultCompanyData);
      setImageData(undefined);
      setOpen(false);
    }
  };
  const cancelHandler = () => {
    setData(DefaultCompanyData);
    setOpen(false);
    setImageData(undefined);
    setOpen(false);
  };

  return (
    <div>
      <RModal
        open={open}
        okHandler={okHandler}
        cancelHandler={cancelHandler}
        size="lg"
        title="Company Info"
        loading={
          postLoading ||
          creatableConfermationLoading ||
          creatableConfermationfeatching ||
          patchLoading ||
          secretLoading ||
          secretFeatchng ||
          imageUploadLoading
        }
      >
        <Form fluid onChange={setData} formDefaultValue={data}>
          <div className="grid grid-cols-6 gap-5">
            <div className="col-span-3">
              <Form.Group controlId="name">
                <Form.ControlLabel>Name</Form.ControlLabel>
                <Form.Control name="name" />
              </Form.Group>
              <Form.Group controlId="address">
                <Form.ControlLabel>Address</Form.ControlLabel>
                <Form.Control name="address" accepter={Textarea} />
              </Form.Group>
              <Form.Group controlId="phone">
                <Form.ControlLabel>Phone</Form.ControlLabel>
                <Form.Control name="phone" />
              </Form.Group>

              <Form.Group controlId="default" className="flex items-center">
                <Form.ControlLabel>Default</Form.ControlLabel>
                <Form.Control
                  name="default"
                  accepter={Checkbox}
                  defaultChecked={data?.default}
                  value={!data?.default}
                />
              </Form.Group>
            </div>
            <div className="col-span-3">
              <Form.Group controlId="period">
                <Form.ControlLabel>Period</Form.ControlLabel>
                <Form.Control name="period" />
              </Form.Group>
              <div>
                <LogoUploader
                  defaultImage={data?.photo as string}
                  image={imageData}
                  forwordedRef={
                    uploaderRef as unknown as React.MutableRefObject<UploaderInstance>
                  }
                  setImage={setImageData}
                />
              </div>
            </div>
          </div>
        </Form>
      </RModal>
    </div>
  );
};

export default NewAndPatch;
