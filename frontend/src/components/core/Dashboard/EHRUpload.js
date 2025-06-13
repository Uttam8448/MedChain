import React, { useState, createRef } from 'react';
import { uploadEHR } from '../../../services/ehrServices/ehrServices';
import { TypeAnimation } from 'react-type-animation';
import { issueEHR } from '../../../services/blockchainConnecter';

const EHRUploadForm = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = createRef(null); // Create a ref for the file input
  const [loading,setLoading] = useState(false);
 // Get the token from UserContext

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const handleClear = () => {
    setSelectedFiles([]); // Clear the selected files state
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the file input value
    }
  };

  const EHRUploadHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (selectedFiles.length === 0) { 
      alert("Please select a file to upload.");
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.set('ehr', fileInputRef.current.files[0]); // Append the selected file to the FormData object

    // const formData = new FormData();
    // formData.append('files', selectedFiles[0]); // Append the selected file to the FormData object
      const response = await uploadEHR(formData);
      const responseContract=await issueEHR(response.data.ipfsHash);
      console.log("Response from EHR upload:", response);
      console.log("Response from EHR contract:", responseContract);
      handleClear(); // Clear the selected files after upload
      setLoading(false);
  }

  return (
    <div className='flex flex-col gap-6 w-[100%]'>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        ref={fileInputRef} // Attach the ref to the file input
      />
      {selectedFiles.length > 0 && (
        <ul>
          {selectedFiles.map((file, index) => (
            <iframe
              key={index}
              src={URL.createObjectURL(file)}
              width="100%"
              height="500px"
              title='EHR Document Preview'
            ></iframe>
          ))}
        </ul>
      )}
      <div className='flex gap-4'>
        <button
          className={` text-white px-4 py-2 rounded w-fit ${loading ? 'bg-neutral-600' : 'bg-cyan-500'}`}
          onClick={EHRUploadHandler} // Call the EHRUpload function
        >
         {loading ? <div>Uploading
                <TypeAnimation sequence={[1000,".",1000,"..",1000,"...",1000,""]} 
                repeat={Infinity} 
                cursor={false}/></div> : "Upload EHR"}
        </button>
        <button
          className='bg-red-500 text-white px-4 py-2 rounded w-fit'
          onClick={(e)=>handleClear(e)} // Call the handleClear function
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default EHRUploadForm;

