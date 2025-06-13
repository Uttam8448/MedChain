const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lock", function () {
  let ehrContract, deployer, patient, doctor1, doctor2;

  beforeEach(async function () {
    [deployer, patient, doctor1, doctor2] = await ethers.getSigners();

    // const EHRManagement = await ethers.getContractFactory("EHRManagement");
    //Lock change to EhrManagement
    ehrContract = await ethers.deployContract("Lock");
    
  });

  it("should register a patient successfully", async function () {
    await ehrContract.connect(patient).registerUser(1); // Role.Patient = 1
    expect(await ehrContract.userRoles(patient.address)).to.equal(1);
  });

  it("should register a doctor successfully", async function () {
    await ehrContract.connect(doctor1).registerUser(2); // Role.Doctor = 2
    expect(await ehrContract.userRoles(doctor1.address)).to.equal(2);
  });

  it("should not allow re-registration of the same user", async function () {
    await ehrContract.connect(patient).registerUser(1);
    await expect(ehrContract.connect(patient).registerUser(1)).to.be.revertedWith("User already registered");
  });

  it("should issue an EHR by a patient", async function () {
    await ehrContract.connect(patient).registerUser(1);
  
    const tx = await ehrContract.connect(patient).issueEHR("QmTestHash");
    const receipt = await tx.wait();
  
    // Find the correct event
    const event = receipt.logs[0];
    const ehrId = event.args.ehrId;
  
    const ehrRecord = await ehrContract.ehrRecords(ehrId);
    expect(ehrRecord.patient).to.equal(patient.address);
    expect(ehrRecord.ipfsHash).to.equal("QmTestHash");
  });

  it("should grant full access to a doctor", async function () {
    await ehrContract.connect(patient).registerUser(1);
    await ehrContract.connect(doctor1).registerUser(2);

    await ehrContract.connect(patient).grantFullAccess(doctor1.address);

    expect(await ehrContract.hasFullAccess(patient.address, doctor1.address)).to.be.true;
  });

  it("should revoke full access from a doctor", async function () {
    await ehrContract.connect(patient).registerUser(1);
    await ehrContract.connect(doctor1).registerUser(2);

    await ehrContract.connect(patient).grantFullAccess(doctor1.address);
    await ehrContract.connect(patient).revokeFullAccess(doctor1.address);

    expect(await ehrContract.hasFullAccess(patient.address, doctor1.address)).to.be.false;
  });

  it("should transfer full access from one doctor to another", async function () {
    await ehrContract.connect(patient).registerUser(1);
    await ehrContract.connect(doctor1).registerUser(2);
    await ehrContract.connect(doctor2).registerUser(2);

    await ehrContract.connect(patient).grantFullAccess(doctor1.address);

    await ehrContract.connect(doctor1).transferFullAccess(patient.address,doctor2.address);

    expect(await ehrContract.hasFullAccess(patient.address, doctor1.address)).to.be.false;
    expect(await ehrContract.hasFullAccess(patient.address, doctor2.address)).to.be.true;
  });

  it("should allow viewing of EHR by authorized doctor", async function () {
    await ehrContract.connect(patient).registerUser(1);
    await ehrContract.connect(doctor1).registerUser(2);

    const tx = await ehrContract.connect(patient).issueEHR("QmTestHash");
    const receipt = await tx.wait();
    const event = receipt.logs[0];
    const ehrId = event.args.ehrId;
  
    await ehrContract.connect(patient).grantFullAccess(doctor1.address);

    const ipfsHash = await ehrContract.connect(doctor1).viewEHR(ehrId);
    expect(ipfsHash).to.equal("QmTestHash");
  });

  it("should deny viewing of EHR by unauthorized doctor", async function () {
    await ehrContract.connect(patient).registerUser(1);
    await ehrContract.connect(doctor1).registerUser(2);

    const tx = await ehrContract.connect(patient).issueEHR("QmTestHash");
    const receipt = await tx.wait();
    const event = receipt.logs[0];
    const ehrId = event.args.ehrId;

    await expect(ehrContract.connect(doctor1).viewEHR(ehrId)).to.be.revertedWith("Access denied");
  });

  it("should reset user roles", async function () {
    await ehrContract.connect(patient).registerUser(1);
    await ehrContract.connect(patient).resetUserRole();

    expect(await ehrContract.userRoles(patient.address)).to.equal(0); // Role.None
  });
});
