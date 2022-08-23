// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.11;

interface IVoting {
    /// @notice Type of the tokens that can be used for voting
    enum TokenType {
        ERC1155,
        ERC721
    }
    struct IVote {
        uint256 challengeId;
        address assetContract;
        uint256 tokenId;
    }

    struct Vote {
        uint256 voteId;
        address player;
        address assetContract;
        uint256 tokenId;
    }

    struct IChallenge {
        string title;
        uint256 startTime;
        uint256 secondsUntilEndTime;
        address assetContract;
    }
    struct Challenge {
        uint256 id;
        address proposer;
        uint256 startTime;
        uint256 endTime;
        string title;
        uint256 forVotes;
        address assetContract;
        mapping(uint256 => Vote) voters;
    }

    struct ChallengeWithoutVotes {
        uint256 id;
        address proposer;
        uint256 startTime;
        uint256 endTime;
        string title;
        uint256 forVotes;
        address assetContract;
    }

    event ChallengeCreated(
        uint256 indexed id,
        address proposer,
        uint256 startTime,
        uint256 endTime,
        string title,
        uint256 forVotes
    );

    event ChallengeRemoved(uint256 indexed id);
    event VoteCast(
        address indexed voter,
        uint256 proposalId,
        address assetContract,
        uint256 tokenId
    );
}
