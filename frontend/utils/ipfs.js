import { create as ipfsHttpClient } from "ipfs-http-client";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

const uploadToIpfs = async (ref) => {
  return new Promise(async (resolve, reject) => {
    try {
      const added = await client.add(ref.files[0]);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      resolve(url);
    } catch (err) {
      reject(err.message);
    }
  });
};

const uploadBinaryToIpfs = async (ref) => {
  return new Promise(async (resolve, reject) => {
    try {
      const added = await client.add(ref);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      resolve(url);
    } catch (err) {
      reject(err.message);
    }
  });
};
