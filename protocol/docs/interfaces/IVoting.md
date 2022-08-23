# IVoting










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



