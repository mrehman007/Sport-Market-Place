import { useContext, useState } from 'react';
import FormCard from '../components/FormCard';
import Input from '../components/FormElements/Input';
import Label from '../components/FormElements/Label';
import Button from '../components/Button';
import TextArea from '../components/FormElements/TextArea';
import AddProperties from '../components/AddProperties';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { checkMimeType } from '../helpers';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { config } from '../config';
import { GlobalContext } from '../context';
import Attributes from '../components/Attributes';

const CreateItem = () => {
  const { getProviderOrSigner, setIsLoading, setGlobalStateChanged } =
    useContext(GlobalContext);
  const defaultValues = {
    name: '',
    file: '',
    description: '',
    properties: [
      {
        value: 'diamond',
        trait_type: 'type',
      },
    ],
    supply: 1,
  };
  const [formData, setFormData] = useState(defaultValues);
  const [attributes, setAttributes] = useState([
    { trait_type: 'type', value: 'diamond' },
  ]);
  const { name, file, description, properties, supply } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onChangeFile = (e) => {
    const file = e.target.files[0];

    if (checkMimeType(e)) {
      setFormData({ ...formData, [e.target.name]: file });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Image is required');
      return;
    }
    toast.promise(
      new Promise(async (resolve, reject) => {
        setIsLoading(true);
        try {
          const signer = await getProviderOrSigner(true);

          const sdk = new ThirdwebSDK(signer);

          const { uris } = await sdk.storage.upload(file);
          const contract = sdk.getNFTCollection(config.PLAYER_NFT_ADDRESS);

          await contract.mintToSelf({
            metadata: {
              name,
              description,
              image: uris[0],
              properties,
            },
            supply: 1,
          });
          resolve(`Minted ${supply} nfts successfully`);
          setGlobalStateChanged(!globalStateChanged);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          let _error = JSON.parse(JSON.stringify(error)) || error;
          reject(
            `Error: ${_error?.reason || _error?.data?.message || _error?.message
            }`
          );
        }
        setIsLoading(false);
      }),
      {
        loading: 'Minting...',
        success: (msg) => `${String(msg)}`,
        error: (msg) => `${String(msg)}`,
      }
    );
  };

  return (
    <StyledCreateItem>
      <h1>Create NFT</h1>
      <form onSubmit={onSubmit}>
        <div className="grid">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Item Name"
              value={name}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="image">Upload Image</Label>
            <Input id="file" type="file" name="file" onChange={onChangeFile} />
          </div>
        </div>
        <div>
          <Label htmlFor="supply">Supply</Label>
          <Input
            id="supply"
            name="supply"
            type="number"
            min={1}
            max={1}
            placeholder="Item Supply"
            value={supply}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            name="description"
            placeholder="Enter description..."
            value={description}
            onChange={onChange}
            required
          ></TextArea>
        </div>
        <div>
          <Label>Add Properties</Label>
          {/* <AddProperties {...{ formData, setFormData }} /> */}
          <Attributes {...{ attributes, setAttributes }} />
        </div>
        <Button primary w100 type={'submit'}>
          Submit
        </Button>
      </form>
    </StyledCreateItem>
  );
};

export default CreateItem;

const StyledCreateItem = styled.div`
  padding: 4rem 2rem;
  max-width: 768px;
  margin: 0 auto;
  form {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
    button[type='submit'] {
      margin-top: 0.5rem;
    }
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }
`;
