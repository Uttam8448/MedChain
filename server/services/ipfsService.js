const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

exports.uploadEHRService = async (ehrFile, nameOfFile) => {
  try {
    const formData = new FormData();

    formData.append("file", ehrFile.data, {
      filename: nameOfFile,
      contentType: ehrFile.mimetype,
    });

    const metadata = JSON.stringify({
      name: nameOfFile,
    });

    const options = JSON.stringify({
      cidVersion: 0,
    });

    formData.append("pinataMetadata", metadata);
    formData.append("pinataOptions", options);

    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxBodyLength: Infinity,
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
    });

    return res.data.IpfsHash;
  } catch (error) {
    console.error("❌ Upload error:", error.response?.data || error.message);
    throw error;
  }
};
