// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

//for debugging
import "hardhat/console.sol";

contract Lock {
    struct EHR {
        address patient;      // Issuer of the EHR (patient)
        string ipfsHash;      // IPFS hash of the document
        uint256 timestamp;    // Timestamp of the document creation
    }

    enum Role { None, Patient, Doctor }

    mapping(bytes32 => EHR) public ehrRecords;
    mapping(address => bytes32[]) private patientEHRs; // Mapping to store patient EHR history
    mapping(address => Role) public userRoles; // Mapping to store user roles
    mapping(address => mapping(address => bool)) private fullAccess;

    event EHRIssued(bytes32 indexed ehrId, address indexed patient, string ipfsHash);
    event FullAccessGranted(address indexed patient, address indexed doctor);
    event FullAccessRevoked(address indexed patient, address indexed doctor);
    event FullAccessTransferred(address indexed patient, address indexed oldDoctor, address indexed newDoctor);
    event UserRoleReset(address indexed user);

    uint256 private ehrNonce; // Unique counter for EHR IDs

    constructor() {
        ehrNonce=0;
    }

    modifier onlyPatient() {
        require(userRoles[msg.sender] == Role.Patient, "Only a patient can perform this action");
        _;
    }

    modifier onlyDoctor() {
        require(userRoles[msg.sender] == Role.Doctor, "Only a doctor can perform this action");
        _;
    }

    // Register user as patient or doctor
    function registerUser(Role role) public {
        require(role == Role.Patient || role == Role.Doctor, "Role must be Patient or Doctor");
        require(userRoles[msg.sender] == Role.None,"User already registered");
        userRoles[msg.sender] = role;
    }

    // Unregister or reset the role of a user
    function resetUserRole() public {
        require(userRoles[msg.sender] != Role.None, "User is not registered");
        userRoles[msg.sender] = Role.None;
        emit UserRoleReset(msg.sender);
    }

    function hasFullAccess(address patient, address doctor) public view returns (bool) {
    return fullAccess[patient][doctor];
    }

    // Issue an EHR by a patient
    function issueEHR(string memory _ipfsHash) public onlyPatient returns (bytes32) {
        ehrNonce++;
        bytes32 ehrId = keccak256(abi.encodePacked(_ipfsHash, msg.sender, ehrNonce, block.timestamp, blockhash(block.number - 1)));
        ehrRecords[ehrId] = EHR(msg.sender, _ipfsHash, block.timestamp);
        patientEHRs[msg.sender].push(ehrId);
        emit EHRIssued(ehrId, msg.sender, _ipfsHash);
        return ehrId;
    }

    // Grant full access to a doctor for all records
    function grantFullAccess(address _doctor) public onlyPatient {
        Role doctorRole = userRoles[_doctor]; // Cache role to optimize checks
        require(doctorRole == Role.Doctor, "Recipient must be a doctor");
        require(_doctor != address(0), "Invalid doctor address");
        fullAccess[msg.sender][_doctor] = true;
        emit FullAccessGranted(msg.sender, _doctor);
    }

    // Revoke full access from a doctor
    function revokeFullAccess(address _doctor) public onlyPatient {
        require(fullAccess[msg.sender][_doctor], "Doctor does not have full access");
        fullAccess[msg.sender][_doctor] = false;
        emit FullAccessRevoked(msg.sender, _doctor);
    }

    // Transfer full access from one doctor to another
    function transferFullAccess(address _patient,address _newDoctor) public onlyDoctor {
        require(userRoles[_patient] == Role.Patient, "Patient not found");
        require(userRoles[_newDoctor] == Role.Doctor, "Recipient must be a doctor");
        require(_newDoctor != msg.sender && _newDoctor != address(0), "Cannot transfer access to yourself or invalid doctor address");

        if (fullAccess[_patient][msg.sender]) {
                fullAccess[_patient][msg.sender] = false;
                fullAccess[_patient][_newDoctor] = true;
                emit FullAccessTransferred(_patient, msg.sender, _newDoctor);
        }
           
    }

    // View the IPFS hash of an EHR if access is granted
    function viewEHR(bytes32 _ehrId) public view returns (string memory) {
        address patient = ehrRecords[_ehrId].patient;
        require(
            patient == msg.sender || 
            fullAccess[patient][msg.sender], 
            "Access denied"
        );
        return ehrRecords[_ehrId].ipfsHash;
    }

    // View the entire patient history if full access is granted
    function viewPatientHistory(address _patient) 
    public 
    view 
    returns (
        bytes32[] memory ehrIds,
        uint256[] memory timestamps,
        string[] memory ipfsHashes
    ) 
    {
        require(
            _patient == msg.sender || 
            fullAccess[_patient][msg.sender], 
            "Access to patient history denied"
        );

        uint256 count = patientEHRs[_patient].length;
        ehrIds = new bytes32[](count);
        timestamps = new uint256[](count);
        ipfsHashes = new string[](count);

        for (uint256 i = 0; i < count; i++) {
            bytes32 ehrId = patientEHRs[_patient][i];
            EHR memory record = ehrRecords[ehrId];

            ehrIds[i] = ehrId;
            timestamps[i] = record.timestamp;
            ipfsHashes[i] = record.ipfsHash;
        }
        return (ehrIds, timestamps, ipfsHashes);
    }
}
