// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.11;

//  ==========  External imports    ==========
import "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";

import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

//  ==========  Internal imports    ==========
import "./interfaces/IVoting.sol";

contract Voting is AccessControlEnumerableUpgradeable, IVoting {
    /*///////////////////////////////////////////////////////////////
                            State Variables
    //////////////////////////////////////////////////////////////*/
    /// @notice The total number of _challenges ever created
    uint256 public challengesCount;

    /*///////////////////////////////////////////////////////////////
                            Mappings
    //////////////////////////////////////////////////////////////*/
    mapping(uint256 => Challenge) public _challenges;

    /*///////////////////////////////////////////////////////////////
                           Modifiers
    //////////////////////////////////////////////////////////////*/

    /// @dev Checks whether the caller is a module admin.

    modifier onlyModuleAdmin() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "Voting: not a module admin."
        );
        _;
    }

    /*///////////////////////////////////////////////////////////////
                    Constructor + initializer logic
    //////////////////////////////////////////////////////////////*/
    /// @dev Initiliazes the contract, like a constructor.
    function initialize(address _defaultAdmin) external initializer {
        // Initialize inherited contracts, most base-like -> most derived.
        challengesCount = 0;

        _setupRole(DEFAULT_ADMIN_ROLE, _defaultAdmin);
    }

    /*///////////////////////////////////////////////////////////////
                            Challenge Logic
    //////////////////////////////////////////////////////////////*/

    function proposeChallenge(IChallenge[] calldata challenges)
        external
        onlyModuleAdmin
    {
        for (uint256 i = 0; i < challenges.length; i++) {
            _proposeChallenge(challenges[i]);
        }
    }

    function _proposeChallenge(IChallenge calldata challenge) internal {
        require(
            challenge.secondsUntilEndTime > 0,
            "Voting: secondsUntilEndTime must be > 0."
        );
        require(
            challenge.assetContract != address(0),
            "Voting: assetContract must not be the zero address."
        );

        uint256 startTime = challenge.startTime < block.timestamp
            ? block.timestamp
            : challenge.startTime;

        challengesCount += 1;
        Challenge storage _newChallenge = _challenges[challengesCount];
        _newChallenge.id = challengesCount;
        _newChallenge.proposer = msg.sender;
        _newChallenge.startTime = startTime;
        _newChallenge.endTime = startTime + challenge.secondsUntilEndTime;
        _newChallenge.title = challenge.title;
        _newChallenge.forVotes = 0;
        _newChallenge.assetContract = challenge.assetContract;

        emit ChallengeCreated(
            challengesCount,
            msg.sender,
            startTime,
            _newChallenge.endTime,
            challenge.title,
            _newChallenge.forVotes
        );
    }

    function removeChallenge(uint256 _challengeId) external onlyModuleAdmin {
        require(
            _challengeId > 0 && _challengeId <= challengesCount,
            "Voting: challengeId must be > 0 and <= challengesCount."
        );

        require(
            _challenges[_challengeId].proposer == msg.sender,
            "Voting: only the proposer can remove a challenge."
        );

        require(
            _challenges[_challengeId].endTime > block.timestamp,
            "Voting: only active _challenges can be removed."
        );

        require(
            _challenges[_challengeId].forVotes == 0,
            "Voting: only _challenges with 0 votes can be removed."
        );
        delete _challenges[_challengeId];

        emit ChallengeRemoved(_challengeId);
    }

    /*///////////////////////////////////////////////////////////////
                            Voting Logic
    //////////////////////////////////////////////////////////////*/

    /// @dev Let's caller vote for a challenge(s).
    function castVote(IVote[] calldata votes) external {
        for (uint256 i = 0; i < votes.length; i++) {
            _castVote(votes[i]);
        }
    }

    function _castVote(IVote calldata vote) internal {
        Challenge storage _challenge = _challenges[vote.challengeId];

        require(_challenge.id > 0, "Voting: Challenge not found.");
        require(
            _challenge.endTime > block.timestamp,
            "Voting: challenge must be active."
        );

        require(
            _challenge.assetContract == vote.assetContract,
            "Voting: asset contract mismatch."
        );

        // check whether the nft has voted in another  active challenge
        _validateVote(vote.assetContract, vote.tokenId);

        // validate nft ownership
        _validateOwnership(vote.assetContract, vote.tokenId);

        // Add the vote to the challenge.
        uint256 voteId = _challenge.forVotes + 1;
        Vote storage _vote = _challenge.voters[voteId];

        _vote.voteId = voteId;
        _vote.tokenId = vote.tokenId;
        _vote.assetContract = vote
            .assetContract;
        _vote.player = _msgSender();

        _challenge.forVotes +=1;

        emit VoteCast(
            msg.sender,
            vote.challengeId,
            vote.assetContract,
            vote.tokenId
        );
    }

    function _validateVote(address _assetContract, uint256 _tokenId)
        internal
        view
    {
        // check whether the nft has voted in another active challenge
        for (uint256 i = 1; i <= challengesCount; i++) {
            Challenge storage _challenge = _challenges[i];
            if (
                _challenge.startTime <= block.timestamp &&
                _challenge.endTime > block.timestamp
            ) {
                for (uint256 j = 1; j <= _challenge.forVotes; j++) {
                    bool hasVoted = _challenge.voters[j].assetContract ==
                        _assetContract &&
                        _challenge.voters[j].tokenId == _tokenId;
                    require(
                        hasVoted == false,
                        "Voting: NFT has already voted in another active challenge."
                    );
                }
            }
        }
    }

    function _validateOwnership(address _assetContract, uint256 _tokenId)
        internal
        view
    {
        bool isValid;
        uint256 _quantity = 1;
        address _tokenOwner = _msgSender();
        TokenType _tokenType = _getTokenType(_assetContract);

        if (_tokenType == TokenType.ERC1155) {
            isValid =
                IERC1155Upgradeable(_assetContract).balanceOf(
                    _tokenOwner,
                    _tokenId
                ) >=
                _quantity;
        } else if (_tokenType == TokenType.ERC721) {
            isValid =
                IERC721Upgradeable(_assetContract).ownerOf(_tokenId) ==
                _tokenOwner;
        }

        require(isValid, "Voting: NFT must be owned by the caller.");
    }

    /*///////////////////////////////////////////////////////////////
                           Internal Functions
    //////////////////////////////////////////////////////////////*/

    /// @dev get top _challenges sorted by votes.
    function getTopChallenges(uint256 _startTime, uint256 _endTime)
        public
        view
        returns (ChallengeWithoutVotes[] memory topChallenges)
    {
        uint256 topChallengesCount = 0;
        uint256 topChallengesIndex = 0;

        for (uint256 i = 1; i <= challengesCount; i++) {
            if (
                _challenges[i].startTime >= _startTime &&
                _challenges[i].endTime == _endTime
            ) {
                topChallenges[topChallengesIndex] = ChallengeWithoutVotes({
                    id: _challenges[i].id,
                    proposer: _challenges[i].proposer,
                    startTime: _challenges[i].startTime,
                    endTime: _challenges[i].endTime,
                    title: _challenges[i].title,
                    forVotes: _challenges[i].forVotes,
                    assetContract: _challenges[i].assetContract
                });
                topChallengesIndex++;
                topChallengesCount++;
            }
        }

        // sort _challenges by votes
        for (uint256 i = 0; i < topChallengesCount; i++) {
            for (uint256 j = i + 1; j < topChallengesCount; j++) {
                if (topChallenges[i].forVotes < topChallenges[j].forVotes) {
                    ChallengeWithoutVotes memory temp = topChallenges[i];
                    topChallenges[i] = topChallenges[j];
                    topChallenges[j] = temp;
                }
            }
        }
        return topChallenges;
    }

    /// @dev Get voters for a challenge.
    function getVoters(uint256 _challengeId)
        external
        view
        returns (Vote[] memory _votes)
    {
        Challenge storage _challenge = _challenges[_challengeId];
        _votes = new Vote[](_challenge.forVotes);
        for (uint256 i = 0; i < _challenge.forVotes; i++) {
            _votes[i] = _challenge.voters[i + 1];
        }
    }

    /// @dev Returns the interface supported by a contract.
    function _getTokenType(address _assetContract)
        internal
        view
        returns (TokenType tokenType)
    {
        if (
            IERC165Upgradeable(_assetContract).supportsInterface(
                type(IERC1155Upgradeable).interfaceId
            )
        ) {
            tokenType = TokenType.ERC1155;
        } else if (
            IERC165Upgradeable(_assetContract).supportsInterface(
                type(IERC721Upgradeable).interfaceId
            )
        ) {
            tokenType = TokenType.ERC721;
        } else {
            revert("token must be ERC1155 or ERC721.");
        }
    }
}
