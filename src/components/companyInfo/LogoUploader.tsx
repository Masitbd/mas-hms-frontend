import React, { Dispatch, SetStateAction, useState } from "react";
import { Loader, Message, Uploader, useToaster } from "rsuite";
import AvatarIcon from "@rsuite/icons/legacy/Avatar";
import swal from "sweetalert";
import { UploaderInstance } from "rsuite/esm/Uploader/Uploader";

const LogoUploader = ({
  image,
  setImage,
  defaultImage,
  forwordedRef,
}: {
  image: any;
  setImage: Dispatch<SetStateAction<any>>;
  defaultImage: string;
  forwordedRef: React.MutableRefObject<UploaderInstance>;
}) => {
  const toaster = useToaster();
  const [uploading, setUploading] = React.useState(false);
  const [fileInfo, setFileInfo] =
    useState<SetStateAction<string | ArrayBuffer | null>>();
  const [imageURL, setImageUrl] =
    useState<SetStateAction<string | ArrayBuffer | null>>(defaultImage);

  return (
    <Uploader
      ref={forwordedRef}
      fileListVisible={false}
      autoUpload={false}
      listType="picture"
      onChange={async (event) => {
        if (event) {
          const files = event[event.length - 1].blobFile;
          const fileSize = (files?.size ?? 0) / 1000;
          const fileType = files?.type.split("/")[0];
          if (fileSize > 600) {
            swal("Error", "File size exceeds 600KB.", "error");
            return;
          }

          if (fileType !== "image") {
            swal("Error", "Invalid file selected", "error");
            return;
          }
          setImage && setImage(files);
          const reader = await new FileReader();
          reader.onloadend = () => {
            setImageUrl(reader?.result);
            setFileInfo(reader?.result);
          };
          reader.readAsDataURL(files as Blob);
        }
      }}
      onSuccess={(response, file) => {
        setUploading(false);
        toaster.push(<Message type="success">Uploaded successfully</Message>);
        console.log(response);
      }}
      onError={() => {
        setFileInfo(null);
        setUploading(false);
        toaster.push(<Message type="error">Upload failed</Message>);
      }}
      action={""}
    >
      <button style={{ width: 150, height: 150 }}>
        {uploading && <Loader backdrop center />}
        {fileInfo || imageURL ? (
          <img
            src={(imageURL as string) ?? defaultImage}
            width="100%"
            height="100%"
          />
        ) : (
          <AvatarIcon style={{ fontSize: 80 }} />
        )}
      </button>
    </Uploader>
  );
};

export default LogoUploader;
