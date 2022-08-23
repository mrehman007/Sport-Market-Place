/* eslint-disable prefer-const */
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { ERC721 } from "../../generated/Marketplace/ERC721";

export function getTokenUri(address: Address, tokenId: BigInt): string {
  let contract = ERC721.bind(address);

  let uri = "";
  let uriResult = contract.try_tokenURI(tokenId);
  if (!uriResult.reverted) {
    uri = uriResult.value;
  }

  if (!uri) {
    // ERC1155  and signature mint nfts
    let uriResult = contract.try_uri(tokenId);
    if (!uriResult.reverted) {
      uri = uriResult.value;
    }
  }

  return uri;
}

export function normalize(strValue: string): string {
  if (strValue.length === 1 && strValue.charCodeAt(0) === 0) {
    return "";
  } else {
    for (let i = 0; i < strValue.length; i++) {
      if (strValue.charCodeAt(i) === 0) {
        strValue = setCharAt(strValue, i, "\ufffd"); // graph-node db does not support string with '\u0000'
      }
    }
    return strValue;
  }
}

export function setCharAt(str: string, index: i32, char: string): string {
  if (index > str.length - 1) return str;
  return str.substr(0, index) + char + str.substr(index + 1);
}
