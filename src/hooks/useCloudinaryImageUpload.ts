import {
  useGetCloudinarySecretQuery,
  useLazyGetCloudinarySecretQuery,
} from "@/redux/api/companyInfo/companyInfoSlice";
import { useState, useCallback } from "react";
interface CloudinaryResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  original_filename: string;
  api_key: string;
}
const useCloudinaryUpload = () => {
  const [getSecret] = useLazyGetCloudinarySecretQuery();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState<CloudinaryResponse>();

  const uploadImage = useCallback(
    async (imageFile: File | null) => {
      if (!imageFile) return;

      setLoading(true);
      setError(null);

      // fetching cloudinary secret
      const secret = await getSecret(undefined).unwrap();

      const { cloudName, apiKey, timestamp, signature } = secret?.data;

      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("timestamp", timestamp);
      formData.append("api_key", apiKey);
      formData.append("signature", signature);

      try {
        const response = await await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Image upload failed");
        }

        const data = await response.json();

        setResponseData(data);
        return data;
      } catch (err: any) {
        setError(err?.message);
      } finally {
        setLoading(false);
      }
    },
    [getSecret]
  );

  return {
    uploadImage,
    loading,
    responseData,
    error,
  };
};

export default useCloudinaryUpload;
