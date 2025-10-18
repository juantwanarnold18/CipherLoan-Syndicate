// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, euint32, eaddress, ebool, externalEuint64, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Loan Proposal Contract - Privacy-Preserving Loan Syndication
/// @notice Borrowers submit encrypted loan proposals with collateral, amount, and credit score
/// @dev Based on Sealed-Auction pattern - uses FHE.fromExternal for correct handle import
contract LoanProposal is SepoliaConfig {
    address public owner;

    enum ProposalStatus {
        Submitted,
        Approved,
        Rejected,
        Funded
    }

    struct Proposal {
        bytes32 proposalId;
        address borrower;
        euint64 collateralEnc;     // Encrypted collateral amount
        euint64 requestedEnc;      // Encrypted requested loan amount
        euint32 creditScoreEnc;    // Encrypted credit score
        ProposalStatus status;
        uint256 submittedAt;
    }

    mapping(bytes32 => Proposal) public proposals;
    mapping(address => bytes32[]) public borrowerProposals;
    mapping(address => bool) public canViewProposal;
    uint256 public totalProposals;

    event ProposalSubmitted(bytes32 indexed proposalId, address indexed borrower, uint256 timestamp);
    event ProposalApproved(bytes32 indexed proposalId);
    event ProposalRejected(bytes32 indexed proposalId);
    event ProposalFunded(bytes32 indexed proposalId);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Submit a new loan proposal with encrypted data
    /// @dev Uses FHE.fromExternal to correctly import encrypted handles
    function submitProposal(
        bytes32 proposalId,
        externalEuint64 collateralCt,
        bytes calldata collateralProof,
        externalEuint64 requestedCt,
        bytes calldata requestedProof,
        externalEuint32 creditScoreCt,
        bytes calldata creditScoreProof
    ) external {
        require(proposals[proposalId].borrower == address(0), "proposal exists");

        // ✅ Correct way to import FHE handles using FHE.fromExternal
        euint64 collateral = FHE.fromExternal(collateralCt, collateralProof);
        euint64 requested = FHE.fromExternal(requestedCt, requestedProof);
        euint32 creditScore = FHE.fromExternal(creditScoreCt, creditScoreProof);

        // Store proposal
        proposals[proposalId] = Proposal({
            proposalId: proposalId,
            borrower: msg.sender,
            collateralEnc: collateral,
            requestedEnc: requested,
            creditScoreEnc: creditScore,
            status: ProposalStatus.Submitted,
            submittedAt: block.timestamp
        });

        // Allow contract and borrower to access encrypted values
        FHE.allowThis(collateral);
        FHE.allowThis(requested);
        FHE.allowThis(creditScore);
        FHE.allow(collateral, msg.sender);
        FHE.allow(requested, msg.sender);
        FHE.allow(creditScore, msg.sender);

        // Track proposals
        borrowerProposals[msg.sender].push(proposalId);
        canViewProposal[msg.sender] = true;
        totalProposals++;

        emit ProposalSubmitted(proposalId, msg.sender, block.timestamp);
    }

    /// @notice Approve a proposal (owner only)
    function approveProposal(bytes32 proposalId) external onlyOwner {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.borrower != address(0), "not found");
        require(proposal.status == ProposalStatus.Submitted, "invalid status");

        proposal.status = ProposalStatus.Approved;
        emit ProposalApproved(proposalId);
    }

    /// @notice Reject a proposal (owner only)
    function rejectProposal(bytes32 proposalId) external onlyOwner {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.borrower != address(0), "not found");
        require(proposal.status == ProposalStatus.Submitted, "invalid status");

        proposal.status = ProposalStatus.Rejected;
        emit ProposalRejected(proposalId);
    }

    /// @notice Fund an approved proposal (owner only)
    function fundProposal(bytes32 proposalId) external onlyOwner {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.borrower != address(0), "not found");
        require(proposal.status == ProposalStatus.Approved, "not approved");

        proposal.status = ProposalStatus.Funded;
        emit ProposalFunded(proposalId);
    }

    /// @notice Grant viewing permission for encrypted proposal data
    function grantView(bytes32 proposalId, address viewer) external onlyOwner {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.borrower != address(0), "not found");

        canViewProposal[viewer] = true;
        FHE.allow(proposal.collateralEnc, viewer);
        FHE.allow(proposal.requestedEnc, viewer);
        FHE.allow(proposal.creditScoreEnc, viewer);
    }

    /// @notice Get borrower's proposal IDs
    function getBorrowerProposals(address borrower) external view returns (bytes32[] memory) {
        return borrowerProposals[borrower];
    }

    /// @notice Get encrypted collateral (view only after permission granted)
    function getEncryptedCollateral(bytes32 proposalId) external view returns (euint64) {
        require(canViewProposal[msg.sender], "no permission");
        return proposals[proposalId].collateralEnc;
    }

    /// @notice Get encrypted requested amount (view only after permission granted)
    function getEncryptedRequested(bytes32 proposalId) external view returns (euint64) {
        require(canViewProposal[msg.sender], "no permission");
        return proposals[proposalId].requestedEnc;
    }

    /// @notice Get encrypted credit score (view only after permission granted)
    function getEncryptedCreditScore(bytes32 proposalId) external view returns (euint32) {
        require(canViewProposal[msg.sender], "no permission");
        return proposals[proposalId].creditScoreEnc;
    }
}
