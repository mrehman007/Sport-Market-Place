import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { useContext } from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Button from '../components/Button';
import { config } from '../config';
import { GlobalContext } from '../context';
import { checkMimeType } from '../helpers';
import { colors } from '../styles/colors';
import { shuffle } from 'lodash';
import { useRouter } from 'next/router';

export default function CreateChallenges() {
  const { getProviderOrSigner } = useContext(GlobalContext);
  const router = useRouter();

  const [rewardsPerPack, setRewardsPerPack] = useState(3);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const onChangeFile = (e) => {
    const file = e.target.files[0];

    if (checkMimeType(e)) {
      setImage(file);
    }
  };

  const handleCreatePack = async (e) => {
    e.preventDefault();

    if (rewardsPerPack < 1) {
      toast.error(`Rewards per box can't be ${rewardsPerPack}`);
      return;
    }
    if (!image) {
      toast.error('Image is required');
      return;
    }
    if (!name || !description) {
      toast.error('Name and description are required');
      return;
    }

    const signer = await getProviderOrSigner(true);
    const sdk = new ThirdwebSDK(signer);

    const gameItemContract = sdk.getEdition(config.GAME_ITEM_ADDRESS);
    if (
      !(await gameItemContract.isApproved(
        await signer.getAddress(),
        config.PACK_ADDRESS
      ))
    ) {
      toast('Approving the Pack contract...');
      await gameItemContract.setApprovalForAll(config.PACK_ADDRESS, true);
    }
    const items = await gameItemContract.getOwnedTokenIds();

    if (items.length < rewardsPerPack) {
      toast.error(
        `You can't create a pack with ${rewardsPerPack} rewards per box because you only have ${items.length} items`
      );
      return;
    }
    const pack = sdk.getPack(config.PACK_ADDRESS);
    const { uris } = await sdk.storage.upload(image);
    const erc721Rewards = shuffle(items)
      .slice(0, rewardsPerPack)
      .map((tokenId) => ({
        tokenId,
        contractAddress: config.GAME_ITEM_ADDRESS,
      }));

    await pack.create({
      packMetadata: {
        name,
        description,
        image: uris[0],
      },
      erc721Rewards,
      rewardsPerPack,
    });

    toast.success(`Pack created successfully!`);
    router.push('/profile');
  };
  return (
    <StyledCreatePack>
      <h1>Create a new pack</h1>
      <form>
        <label>
          <h4>Pack Name</h4>
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value?.trim())}
            required
          />
        </label>
        <label>
          <h4>Pack Description</h4>
          <input
            type="text"
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value?.trim())}
            required
          />
        </label>
        <label>
          <h4>Rewards Per Box</h4>
          <input
            type="number"
            placeholder="Rewards per box"
            value={rewardsPerPack}
            min={1}
            max={500}
            onChange={(e) => setRewardsPerPack(e.target.value?.trim())}
          />
        </label>
        <label>
          <h4>Pack Image</h4>
          <input
            id="file"
            type="file"
            name="file"
            onChange={onChangeFile}
            required
          />
        </label>
        <Button primary onClick={handleCreatePack}>
          Create Pack
        </Button>
      </form>
    </StyledCreatePack>
  );
}

const StyledCreatePack = styled.div`
  padding: 4rem 2rem;
  max-width: 768px;
  margin: 0 auto;
  form {
    width: 100%;
    label {
      display: block;
      margin-bottom: 0.5rem;
      h4 {
        font-size: 1rem;
        font-weight: 700;
        color: ${(props) => colors.secondary};
      }
      input {
        width: 100%;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 0.8rem 1.2rem;
        font-size: 0.9rem;
        font-weight: 400;
        color: ${(props) => colors.secondary};
        &:focus {
          outline: none;
          border: 1px solid ${(props) => colors.primary};
        }
      }
    }
    button {
      margin-top: 0.5rem;
    }
  }
`;
