// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.11;

import "@std/stdlib.sol";
import "@ds-test/test.sol";
import "./Console.sol";
import "./Wallet.sol";
import "../mocks/WETH9.sol";
import "../mocks/MockERC20.sol";
import "../mocks/MockERC721.sol";
import "../mocks/MockERC1155.sol";
import "contracts/Forwarder.sol";
import "contracts/FantasySportFee.sol";
import "contracts/Registry.sol";
import "contracts/Factory.sol";
import "contracts/Pack.sol";
import "contracts/token/TokenERC20.sol";
import "contracts/token/TokenERC721.sol";
import "contracts/token/TokenERC1155.sol";
import "contracts/marketplace/Marketplace.sol";
import "contracts/mock/Mock.sol";

abstract contract BaseTest is DSTest, stdCheats {
    string public constant NAME = "NAME";
    string public constant SYMBOL = "SYMBOL";
    string public constant CONTRACT_URI = "CONTRACT_URI";
    address public constant NATIVE_TOKEN =
        0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    // solhint-disable-next-line
    Vm public constant vm = Vm(HEVM_ADDRESS);

    MockERC20 public erc20;
    MockERC721 public erc721;
    MockERC1155 public erc1155;
    WETH9 public weth;

    address public forwarder;
    address public registry;
    address public factory;
    address public fee;

    address public factoryAdmin = address(0x10000);
    address public deployer = address(0x20000);
    address public saleRecipient = address(0x30000);
    address public royaltyRecipient = address(0x30001);
    address public marketFeeRecipient = address(0x30002);
    uint128 public royaltyBps = 500; // 5%
    uint128 public marketFeeBps = 500; // 5%
    uint256 public constant MAX_BPS = 10_000; // 100%

    mapping(bytes32 => address) public contracts;

    function setUp() public virtual {
        /// setup main factory contracts. registry, fee, factory.
        vm.startPrank(factoryAdmin);
        erc20 = new MockERC20();
        erc721 = new MockERC721();
        erc1155 = new MockERC1155();
        weth = new WETH9();
        forwarder = address(new Forwarder());
        registry = address(new Registry(forwarder));
        factory = address(new Factory(forwarder, registry));
        Registry(registry).grantRole(
            Registry(registry).OPERATOR_ROLE(),
            factory
        );
        fee = address(new FantasySportFee(forwarder, factory));
        Factory(factory).addImplementation(address(new TokenERC20(fee)));
        Factory(factory).addImplementation(address(new TokenERC721(fee)));
        Factory(factory).addImplementation(address(new TokenERC1155(fee)));
        Factory(factory).addImplementation(
            address(new MockContract(bytes32("Marketplace"), 1))
        );
        Factory(factory).addImplementation(
            address(new Marketplace(address(weth), fee))
        );
        // Factory(factory).addImplementation(address(new Split(fee)));
        Factory(factory).addImplementation(
            address(new Pack(address(0), address(0), fee))
        );
        // Factory(factory).addImplementation(address(new Multiwrap()));
        // Factory(factory).addImplementation(address(new VoteERC20()));
        vm.stopPrank();

        /// deploy proxy for tests
        deployContractProxy(
            "TokenERC20",
            abi.encodeCall(
                TokenERC20.initialize,
                (
                    deployer,
                    NAME,
                    SYMBOL,
                    CONTRACT_URI,
                    forwarders(),
                    saleRecipient,
                    marketFeeRecipient,
                    marketFeeBps
                )
            )
        );
        deployContractProxy(
            "TokenERC721",
            abi.encodeCall(
                TokenERC721.initialize,
                (
                    deployer,
                    NAME,
                    SYMBOL,
                    CONTRACT_URI,
                    forwarders(),
                    saleRecipient,
                    royaltyRecipient,
                    royaltyBps,
                    marketFeeBps,
                    marketFeeRecipient
                )
            )
        );
        deployContractProxy(
            "TokenERC1155",
            abi.encodeCall(
                TokenERC1155.initialize,
                (
                    deployer,
                    NAME,
                    SYMBOL,
                    CONTRACT_URI,
                    forwarders(),
                    saleRecipient,
                    royaltyRecipient,
                    royaltyBps,
                    marketFeeBps,
                    marketFeeRecipient
                )
            )
        );

        deployContractProxy(
            "Marketplace",
            abi.encodeCall(
                Marketplace.initialize,
                (
                    deployer,
                    CONTRACT_URI,
                    forwarders(),
                    marketFeeRecipient,
                    marketFeeBps
                )
            )
        );
    }

    function deployContractProxy(
        string memory _contractType,
        bytes memory _initializer
    ) public returns (address proxyAddress) {
        vm.startPrank(deployer);
        proxyAddress = Factory(factory).deployProxy(
            bytes32(bytes(_contractType)),
            _initializer
        );
        contracts[bytes32(bytes(_contractType))] = proxyAddress;
        vm.stopPrank();
    }

    function getContract(string memory _name) public view returns (address) {
        return contracts[bytes32(bytes(_name))];
    }

    function getActor(uint160 _index) public pure returns (address) {
        return address(uint160(0x50000 + _index));
    }

    function getWallet() public returns (Wallet wallet) {
        wallet = new Wallet();
    }

    function assertIsOwnerERC721(
        address _token,
        address _owner,
        uint256[] memory _tokenIds
    ) internal {
        for (uint256 i = 0; i < _tokenIds.length; i += 1) {
            bool isOwnerOfToken = MockERC721(_token).ownerOf(_tokenIds[i]) ==
                _owner;
            assertTrue(isOwnerOfToken);
        }
    }

    function assertIsNotOwnerERC721(
        address _token,
        address _owner,
        uint256[] memory _tokenIds
    ) internal {
        for (uint256 i = 0; i < _tokenIds.length; i += 1) {
            bool isOwnerOfToken = MockERC721(_token).ownerOf(_tokenIds[i]) ==
                _owner;
            assertTrue(!isOwnerOfToken);
        }
    }

    function assertBalERC1155Eq(
        address _token,
        address _owner,
        uint256[] memory _tokenIds,
        uint256[] memory _amounts
    ) internal {
        require(_tokenIds.length == _amounts.length, "unequal lengths");

        for (uint256 i = 0; i < _tokenIds.length; i += 1) {
            assertEq(
                MockERC1155(_token).balanceOf(_owner, _tokenIds[i]),
                _amounts[i]
            );
        }
    }

    function assertBalERC1155Gte(
        address _token,
        address _owner,
        uint256[] memory _tokenIds,
        uint256[] memory _amounts
    ) internal {
        require(_tokenIds.length == _amounts.length, "unequal lengths");

        for (uint256 i = 0; i < _tokenIds.length; i += 1) {
            assertTrue(
                MockERC1155(_token).balanceOf(_owner, _tokenIds[i]) >=
                    _amounts[i]
            );
        }
    }

    function assertBalERC20Eq(
        address _token,
        address _owner,
        uint256 _amount
    ) internal {
        assertEq(MockERC20(_token).balanceOf(_owner), _amount);
    }

    function assertBalERC20Gte(
        address _token,
        address _owner,
        uint256 _amount
    ) internal {
        assertTrue(MockERC20(_token).balanceOf(_owner) >= _amount);
    }

    function forwarders() public view returns (address[] memory) {
        address[] memory _forwarders = new address[](1);
        _forwarders[0] = forwarder;
        return _forwarders;
    }
}
