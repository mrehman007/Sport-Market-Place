// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/presets/ERC1155PresetMinterPauserUpgradeable.sol";

contract MockERC1155 is ERC1155PresetMinterPauserUpgradeable {
    constructor() ERC1155PresetMinterPauserUpgradeable() {}

    function mint(
        address to,
        uint256 id,
        uint256 amount
    ) public virtual {
        _mint(to, id, amount, "");
    }

    function hasRole(bytes32, address)
        public
        pure
        override(AccessControlUpgradeable, IAccessControlUpgradeable)
        returns (bool)
    {
        return true;
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts
    ) public virtual {
        require(
            hasRole(MINTER_ROLE, _msgSender()),
            "ERC1155PresetMinterPauser: must have minter role to mint"
        );

        _mintBatch(to, ids, amounts, "");
    }
}
