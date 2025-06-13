import { ethers } from "ethers";
import toast from "react-hot-toast";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Update with the correct address
const abi =  [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "ehrId",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "patient",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        }
      ],
      "name": "EHRIssued",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "patient",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "doctor",
          "type": "address"
        }
      ],
      "name": "FullAccessGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "patient",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "doctor",
          "type": "address"
        }
      ],
      "name": "FullAccessRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "patient",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "oldDoctor",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newDoctor",
          "type": "address"
        }
      ],
      "name": "FullAccessTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "UserRoleReset",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "ehrRecords",
      "outputs": [
        {
          "internalType": "address",
          "name": "patient",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_doctor",
          "type": "address"
        }
      ],
      "name": "grantFullAccess",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "patient",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "doctor",
          "type": "address"
        }
      ],
      "name": "hasFullAccess",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_ipfsHash",
          "type": "string"
        }
      ],
      "name": "issueEHR",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "enum Lock.Role",
          "name": "role",
          "type": "uint8"
        }
      ],
      "name": "registerUser",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "resetUserRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_doctor",
          "type": "address"
        }
      ],
      "name": "revokeFullAccess",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_patient",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_newDoctor",
          "type": "address"
        }
      ],
      "name": "transferFullAccess",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "userRoles",
      "outputs": [
        {
          "internalType": "enum Lock.Role",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_ehrId",
          "type": "bytes32"
        }
      ],
      "name": "viewEHR",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_patient",
          "type": "address"
        }
      ],
      "name": "viewPatientHistory",
      "outputs": [
        {
          "internalType": "bytes32[]",
          "name": "ehrIds",
          "type": "bytes32[]"
        },
        {
          "internalType": "uint256[]",
          "name": "timestamps",
          "type": "uint256[]"
        },
        {
          "internalType": "string[]",
          "name": "ipfsHashes",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

export async function registerUsers(role) {
    try {
        if (!window.ethereum) {
            toast.error("Metamask not found");
            return;
        }

        // Connect to Ethereum provider
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Instantiate the contract
        const contract = new ethers.Contract(contractAddress, abi, signer);

        // Call the registerUser function on the smart contract
        const tx = await contract.registerUser(role);
        await tx.wait(); // Wait for transaction confirmation

        console.log("Transaction hash:", tx.hash);
        toast.success("User registered on the smart contract successfully");
    } catch (error) {
        console.error("Error in registering user on the contract:", error);
        toast.error("Error in registering user on the smart contract");
    }
}

// export async function issueEHR(ipfsHash) {
//     try {
//         if (!window.ethereum) {
//             toast.error("Metamask not found");
//             return;
//         }

//         // Connect to Ethereum provider
//         const provider = new ethers.BrowserProvider(window.ethereum);
//         const signer = await provider.getSigner();

//         // Instantiate the contract
//         const contract = new ethers.Contract(contractAddress, abi, signer);
//         const tx = await contract.issueEHR(ipfsHash);
//         const receipt = await tx.wait();
//         const event = receipt.events.find(e => e.event === "EHRIssued");
//         const ehrId = event.args.ehrId;
//         console.log("Events",event);
//         console.log("Transaction hash:", tx.hash);
//         console.log("EHR issued with ID:", ehrId);  

//         // Call the registerUser function on the smart contract
//         // const result = await contract.issueEHR(ipfsHash);
//         // await tx.wait(); // Wait for transaction confirmation
//         // console.log("Transaction tx:", result.hash);
//         // console.log("EHR issued with ID:", result);
//         toast.success("EHR issued on the smart contract successfully");
  
//     } catch (error) {
//         console.error("Error in EHR issued!!", error);
//         toast.error("Error in EHR issued!!");
//     }
// }
// export async function issueEHR(ipfsHash) {
//     try {
//         if (!window.ethereum) {
//             toast.error("Metamask not found");
//             return;
//         }

//         // Connect to Ethereum provider
//         const provider = new ethers.BrowserProvider(window.ethereum);
//         const signer = await provider.getSigner();

//         // Instantiate the contract
//         const contract = new ethers.Contract(contractAddress, abi, signer);
//         const tx = await contract.issueEHR(ipfsHash);
//         const receipt = await tx.wait();

//         let ehrId = null;
//         let event = null;
//         if (receipt.events && Array.isArray(receipt.events)) {
//             event = receipt.events.find(e => e.event === "EHRIssued");
//             if (event && event.args) {
//                 ehrId = event.args.ehrId;
//             }
//         }

//         console.log("Events", event);
//         console.log("Transaction hash:", tx.hash);
//         console.log("EHR issued with ID:", ehrId);

//         toast.success("EHR issued on the smart contract successfully");

//         // Return values if needed
//         return { ehrId, txHash: tx.hash, event };
//     } catch (error) {
//         console.error("Error in EHR issued!!", error);
//         toast.error("Error in EHR issued!!");
//         return null;
//     }
// }

export async function issueEHR(ipfsHash) {
    try {
        if (!window.ethereum) {
            toast.error("Metamask not found");
            return;
        }

        // Connect to Ethereum provider
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Instantiate the contract
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const tx = await contract.issueEHR(ipfsHash);
        const receipt = await tx.wait();

        let ehrId = null;
        let event = null;

        // Try to parse logs manually if events are missing
        if (!receipt.events || !Array.isArray(receipt.events) || receipt.events.length === 0) {
            // Use the contract interface to parse logs
            const iface = new ethers.Interface(abi);
            for (const log of receipt.logs) {
                try {
                    const parsed = iface.parseLog(log);
                    if (parsed.name === "EHRIssued") {
                        event = parsed;
                        ehrId = parsed.args.ehrId;
                        break;
                    }
                } catch (err) {
                    // Not the right event, skip
                }
            }
        } else {
            event = receipt.events.find(e => e.event === "EHRIssued");
            if (event && event.args) {
                ehrId = event.args.ehrId;
            }
        }

        console.log("Events", event);
        console.log("Transaction hash:", tx.hash);
        console.log("EHR issued with ID:", ehrId);

        toast.success("EHR issued on the smart contract successfully");

        // Return values if needed
        return { ehrId, txHash: tx.hash, event };
    } catch (error) {
        console.error("Error in EHR issued!!", error);
        toast.error("Error in EHR issued!!");
        return null;
    }
}

export async function fetchPatientEHRs(patientAddress) {
    // Call the viewPatientHistory function
     try {
        if (!window.ethereum) {
            toast.error("Metamask not found");
            return;
        }

        // Connect to Ethereum provider
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Instantiate the contract
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const result = await contract.viewPatientHistory(patientAddress);
        if(result.length === 0) {
            toast.error("No EHRs found for this patient");
            return { timestamps: [], ipfsHashes: [] };
        }
        const timestampsNum = result[1].map(ts => Number(ts));
        return { timestamps: timestampsNum, ipfsHashes: result[2] };
      }
        catch (error) {
        console.error("Error fetching patient EHRs:", error);   
        }
}


export async function grantFullAccess(doctorAddress) {
    try {
        if (!window.ethereum) {
            toast.error("Metamask not found");
            return;
        }

        // Connect to Ethereum provider
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Instantiate the contract
        const contract = new ethers.Contract(contractAddress, abi, signer);
        // Call the grantFullAccess function on the smart contract
        const tx = await contract.grantFullAccess(doctorAddress);
        await tx.wait(); // Wait for transaction confirmation
        return true;
    } catch (error) {
        console.error("Error granting full access:", error);
        return false;
    }
}

export async function revokeAccess(doctorAddress){
    try {
        if (!window.ethereum) {
            toast.error("Metamask not found");
            return;
        }

        // Connect to Ethereum provider
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Instantiate the contract
        const contract = new ethers.Contract(contractAddress, abi, signer);
        // Call the revokeFullAccess function on the smart contract
        const tx = await contract.revokeFullAccess(doctorAddress);
        await tx.wait(); // Wait for transaction confirmation
        return true;
    } catch (error) {
        console.error("Error revoking access:", error);
        return false;
    }
}
