# Voting









## Methods

### DEFAULT_ADMIN_ROLE

```solidity
function DEFAULT_ADMIN_ROLE() external view returns (bytes32)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### _challenges

```solidity
function _challenges(uint256) external view returns (uint256 id, address proposer, uint256 startTime, uint256 endTime, string title, uint256 forVotes, address assetContract)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| id | uint256 | undefined |
| proposer | address | undefined |
| startTime | uint256 | undefined |
| endTime | uint256 | undefined |
| title | string | undefined |
| forVotes | uint256 | undefined |
| assetContract | address | undefined |

### castVote

```solidity
function castVote(IVoting.IVote[] votes) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| votes | IVoting.IVote[] | undefined |

### challengesCount

```solidity
function challengesCount() external view returns (uint256)
```

The total number of _challenges ever created




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### getRoleAdmin

```solidity
function getRoleAdmin(bytes32 role) external view returns (bytes32)
```



*Returns the admin role that controls `role`. See {grantRole} and {revokeRole}. To change a role&#39;s admin, use {_setRoleAdmin}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### getRoleMember

```solidity
function getRoleMember(bytes32 role, uint256 index) external view returns (address)
```



*Returns one of the accounts that have `role`. `index` must be a value between 0 and {getRoleMemberCount}, non-inclusive. Role bearers are not sorted in any particular way, and their ordering may change at any point. WARNING: When using {getRoleMember} and {getRoleMemberCount}, make sure you perform all queries on the same block. See the following https://forum.openzeppelin.com/t/iterating-over-elements-on-enumerableset-in-openzeppelin-contracts/2296[forum post] for more information.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |
| index | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### getRoleMemberCount

```solidity
function getRoleMemberCount(bytes32 role) external view returns (uint256)
```



*Returns the number of accounts that have `role`. Can be used together with {getRoleMember} to enumerate all bearers of a role.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### getTopChallenges

```solidity
function getTopChallenges(uint256 _startTime, uint256 _endTime) external view returns (struct IVoting.ChallengeWithoutVotes[] topChallenges)
```



*get top _challenges sorted by votes.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _startTime | uint256 | undefined |
| _endTime | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| topChallenges | IVoting.ChallengeWithoutVotes[] | undefined |

### getVoters

```solidity
function getVoters(uint256 _challengeId) external view returns (struct IVoting.Vote[] _votes)
```



*Get voters for a challenge.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _challengeId | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _votes | IVoting.Vote[] | undefined |

### grantRole

```solidity
function grantRole(bytes32 role, address account) external nonpayable
```



*Grants `role` to `account`. If `account` had not been already granted `role`, emits a {RoleGranted} event. Requirements: - the caller must have ``role``&#39;s admin role.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |
| account | address | undefined |

### hasRole

```solidity
function hasRole(bytes32 role, address account) external view returns (bool)
```



*Returns `true` if `account` has been granted `role`.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |
| account | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### initialize

```solidity
function initialize(address _defaultAdmin) external nonpayable
```



*Initiliazes the contract, like a constructor.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _defaultAdmin | address | undefined |

### proposeChallenge

```solidity
function proposeChallenge(IVoting.IChallenge[] challenges) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| challenges | IVoting.IChallenge[] | undefined |

### removeChallenge

```solidity
function removeChallenge(uint256 _challengeId) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _challengeId | uint256 | undefined |

### renounceRole

```solidity
function renounceRole(bytes32 role, address account) external nonpayable
```



*Revokes `role` from the calling account. Roles are often managed via {grantRole} and {revokeRole}: this function&#39;s purpose is to provide a mechanism for accounts to lose their privileges if they are compromised (such as when a trusted device is misplaced). If the calling account had been revoked `role`, emits a {RoleRevoked} event. Requirements: - the caller must be `account`.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |
| account | address | undefined |

### revokeRole

```solidity
function revokeRole(bytes32 role, address account) external nonpayable
```



*Revokes `role` from `account`. If `account` had been granted `role`, emits a {RoleRevoked} event. Requirements: - the caller must have ``role``&#39;s admin role.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |
| account | address | undefined |

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) external view returns (bool)
```



*See {IERC165-supportsInterface}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| interfaceId | bytes4 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |



## Events

### ChallengeCreated

```solidity
event ChallengeCreated(uint256 indexed id, address proposer, uint256 startTime, uint256 endTime, string title, uint256 forVotes)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| id `indexed` | uint256 | undefined |
| proposer  | address | undefined |
| startTime  | uint256 | undefined |
| endTime  | uint256 | undefined |
| title  | string | undefined |
| forVotes  | uint256 | undefined |

### ChallengeRemoved

```solidity
event ChallengeRemoved(uint256 indexed id)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| id `indexed` | uint256 | undefined |

### Initialized

```solidity
event Initialized(uint8 version)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| version  | uint8 | undefined |

### RoleAdminChanged

```solidity
event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| role `indexed` | bytes32 | undefined |
| previousAdminRole `indexed` | bytes32 | undefined |
| newAdminRole `indexed` | bytes32 | undefined |

### RoleGranted

```solidity
event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| role `indexed` | bytes32 | undefined |
| account `indexed` | address | undefined |
| sender `indexed` | address | undefined |

### RoleRevoked

```solidity
event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| role `indexed` | bytes32 | undefined |
| account `indexed` | address | undefined |
| sender `indexed` | address | undefined |

### VoteCast

```solidity
event VoteCast(address indexed voter, uint256 proposalId, address assetContract, uint256 tokenId)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| voter `indexed` | address | undefined |
| proposalId  | uint256 | undefined |
| assetContract  | address | undefined |
| tokenId  | uint256 | undefined |



