import { ChangeEvent } from 'react';


type FileUploadProps = {
    onFileUpload: (file: File) => void;
}
const FileUpload = ({ onFileUpload }: FileUploadProps) => {
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0]
            onFileUpload(file)
        }

    }
    return (
        <div>
            <input type="file" accept=".docx" onChange={handleFileChange} />
            <p>Upload a DOCX file</p>
        </div>
    );
};

export default FileUpload;