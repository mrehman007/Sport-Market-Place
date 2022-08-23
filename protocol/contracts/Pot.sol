// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.11;

/// ==========  External imports    ==========
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

/// ==========  Internal imports    ==========
import "./libraries/Currency.sol";

/*
 * @title Pot
 * @notice A contract that manages a game funds
 * @dev Generic implementation for pot
 */
contract Pot is AccessControlEnumerableUpgradeable, ReentrancyGuardUpgradeable {
    struct Reward {
        uint256 id;
        address recipient;
        uint256 amount;
        uint256 timestamp;
    }
    /*///////////////////////////////////////////////////////////////
                             State Variables
    //////////////////////////////////////////////////////////////*/
    bytes32 private constant MODULE_TYPE = bytes32("MLBPot");
    uint256 public rewardCount;

    /*///////////////////////////////////////////////////////////////
                             Mappings
    //////////////////////////////////////////////////////////////*/

    // rewardId => Reward
    mapping(uint256 => Reward) public rewards;

    event PaidChallengeWinners(
        uint256 challengeId,
        address _from,
        address[] _recipients,
        uint256[] _amounts,
        address _currency
    );

    /*///////////////////////////////////////////////////////////////
                            Modifiers
    //////////////////////////////////////////////////////////////*/

    /// @dev Checks whether the caller is a module admin.
    modifier onlyModuleAdmin() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "Pot: not a module admin."
        );
        _;
    }

    /*///////////////////////////////////////////////////////////////
                     Constructor + initializer logic
    //////////////////////////////////////////////////////////////*/

    /// @dev Initiliazes the contract, like a constructor.
    function initialize(address _defaultAdmin) external initializer {
        // Initialize inherited contracts, most base-like -> most derived.
        __ReentrancyGuard_init();

        _setupRole(DEFAULT_ADMIN_ROLE, _defaultAdmin);

        rewardCount = 0;
    }

    /*///////////////////////////////////////////////////////////////
                     Payout Logic
    //////////////////////////////////////////////////////////////*/

    /// @dev payouts the winners of a challenge
    function payout(
        uint256 _challengeId,
        address[] memory _recipients,
        uint256[] memory _amounts,
        address _currency
    ) external payable onlyModuleAdmin {
        require(_recipients.length > 0, "Pot: no winners to pay out.");
        require(
            _recipients.length == _amounts.length,
            "Pot: amount to pay out must be equal to the number of winners."
        );

        // payout to the winners _amounts with the specified currency
        _payout(_recipients, _amounts, _currency);

        emit PaidChallengeWinners(
            _challengeId,
            address(this),
            _recipients,
            _amounts,
            _currency
        );
    }

    function getRewards() external view returns (Reward[] memory _rewards) {
        _rewards = new Reward[](rewardCount);
        for (uint256 i = 0; i < rewardCount; i++) {
            _rewards[i] = rewards[i];
        }
    }

    /*///////////////////////////////////////////////////////////////
                     Withdraw Logic
    //////////////////////////////////////////////////////////////*/

    /// @notice withdraws funds from the pot
    function widthrawEther(address _to, uint256 _amount)
        external
        payable
        onlyModuleAdmin
    {
        _widthrawEther(address(this), _to, _amount);
    }

    /// @notice witdraws tokens from the pot
    function widthdrawToken(
        address tokenAddress,
        uint256 _amount,
        address _to
    ) external payable onlyModuleAdmin {
        _widthdrawToken(address(this), tokenAddress, _amount, _to);
    }

    /*///////////////////////////////////////////////////////////////
                        Generic contract logic
    //////////////////////////////////////////////////////////////*/

    /// @dev Lets the contract receive native tokens e.g ether
    receive() external payable {}

    /*///////////////////////////////////////////////////////////////
                     Internal helper functions
    //////////////////////////////////////////////////////////////*/
    function _payout(
        address[] memory _recipients,
        uint256[] memory _amounts,
        address _currency
    ) internal {
        require(
            _recipients.length == _amounts.length,
            "Pot: number of _recipients and _amounts do not match."
        );
        // Payout the winners
        for (uint256 i = 0; i < _recipients.length; i++) {
            Currency.transferCurrency(
                _currency,
                address(this),
                _recipients[i],
                _amounts[i]
            );

            rewardCount += 1;

            Reward storage reward = rewards[rewardCount];
            reward.id = rewardCount;
            reward.recipient = _recipients[i];
            reward.timestamp = block.timestamp;
            reward.amount = _amounts[i];
        }
    }

    function _widthrawEther(
        address _from,
        address _to,
        uint256 _amount
    ) internal {
        require(_amount > 0, "Pot: amount must be > 0.");
        require(_to != address(0), "Pot: to address must be != 0.");
        require(_from != _to, "Pot: from and to addresses must be different.");

        uint256 balance = _from.balance;
        require(balance >= _amount, "Pot: not enough funds to withdraw.");
        Currency.transferCurrency(Currency.NATIVE_TOKEN, _from, _to, _amount);
    }

    function _widthdrawToken(
        address _from,
        address tokenAddress,
        uint256 _amount,
        address _to
    ) internal {
        require(_amount > 0, "Pot: amount must be > 0.");
        require(_to != address(0), "Pot: to address must be != 0.");
        require(_from != _to, "Pot: from and to addresses must be different.");

        Currency.transferCurrency(tokenAddress, _from, _to, _amount);
    }
}
