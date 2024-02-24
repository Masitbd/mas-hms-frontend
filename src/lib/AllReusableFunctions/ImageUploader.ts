async function ImageUpload(
  file: File | undefined,
  callback: { (value: string): void; (arg0: string): void }
) {
  const formData = new FormData();
  formData.append("file", file!);
  formData.append("upload_preset", "myUploads");
  const result = await fetch(
    "https://api.cloudinary.com/v1_1/deildnpys/image/upload",
    {
      method: "POST",
      body: formData
    }
  ).then((r) => r.json());
  callback(result.secure_url);
}

export default ImageUpload;
