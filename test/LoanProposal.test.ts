import { expect } from "chai";
import { ethers } from "hardhat";
import type { LoanProposal } from "../typechain-types";
import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("LoanProposal", function () {
  let loanProposal: LoanProposal;
  let owner: HardhatEthersSigner;
  let borrower: HardhatEthersSigner;
  let viewer: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, borrower, viewer] = await ethers.getSigners();

    const LoanProposalFactory = await ethers.getContractFactory("LoanProposal");
    loanProposal = await LoanProposalFactory.deploy();
    await loanProposal.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the deployer as owner", async function () {
      expect(await loanProposal.owner()).to.equal(owner.address);
    });

    it("Should initialize totalProposals to 0", async function () {
      expect(await loanProposal.totalProposals()).to.equal(0);
    });
  });

  describe("Owner Functions", function () {
    const proposalId = ethers.keccak256(ethers.toUtf8Bytes("test-proposal-1"));

    it("Should only allow owner to approve proposals", async function () {
      // Try to approve as non-owner (should fail)
      await expect(
        loanProposal.connect(borrower).approveProposal(proposalId)
      ).to.be.revertedWith("not owner");
    });

    it("Should only allow owner to reject proposals", async function () {
      // Try to reject as non-owner (should fail)
      await expect(
        loanProposal.connect(borrower).rejectProposal(proposalId)
      ).to.be.revertedWith("not owner");
    });

    it("Should only allow owner to fund proposals", async function () {
      // Try to fund as non-owner (should fail)
      await expect(
        loanProposal.connect(borrower).fundProposal(proposalId)
      ).to.be.revertedWith("not owner");
    });

    it("Should only allow owner to grant view permissions", async function () {
      // Try to grant view as non-owner (should fail)
      await expect(
        loanProposal.connect(borrower).grantView(proposalId, viewer.address)
      ).to.be.revertedWith("not owner");
    });
  });

  describe("View Permission Checks", function () {
    const proposalId = ethers.keccak256(ethers.toUtf8Bytes("test-proposal-2"));

    it("Should deny access to encrypted collateral without permission", async function () {
      await expect(
        loanProposal.connect(viewer).getEncryptedCollateral(proposalId)
      ).to.be.revertedWith("no permission");
    });

    it("Should deny access to encrypted requested amount without permission", async function () {
      await expect(
        loanProposal.connect(viewer).getEncryptedRequested(proposalId)
      ).to.be.revertedWith("no permission");
    });

    it("Should deny access to encrypted credit score without permission", async function () {
      await expect(
        loanProposal.connect(viewer).getEncryptedCreditScore(proposalId)
      ).to.be.revertedWith("no permission");
    });
  });

  describe("Proposal Status Transitions", function () {
    const proposalId = ethers.keccak256(ethers.toUtf8Bytes("test-proposal-3"));

    it("Should reject approving non-existent proposal", async function () {
      await expect(
        loanProposal.connect(owner).approveProposal(proposalId)
      ).to.be.revertedWith("not found");
    });

    it("Should reject rejecting non-existent proposal", async function () {
      await expect(
        loanProposal.connect(owner).rejectProposal(proposalId)
      ).to.be.revertedWith("not found");
    });

    it("Should reject funding non-existent proposal", async function () {
      await expect(
        loanProposal.connect(owner).fundProposal(proposalId)
      ).to.be.revertedWith("not found");
    });

    it("Should reject granting view on non-existent proposal", async function () {
      await expect(
        loanProposal.connect(owner).grantView(proposalId, viewer.address)
      ).to.be.revertedWith("not found");
    });
  });

  describe("Borrower Proposals Query", function () {
    it("Should return empty array for address with no proposals", async function () {
      const proposals = await loanProposal.getBorrowerProposals(borrower.address);
      expect(proposals).to.be.an("array").that.is.empty;
    });
  });
});
