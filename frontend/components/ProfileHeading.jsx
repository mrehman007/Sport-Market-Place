import { useState, useRef, useEffect, useContext } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { colors } from '../styles/colors';
import { getScore, humanizeAddress } from '../helpers';
import { GlobalContext } from '../context';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';

export default function ProfileHeading({
  players,
  votes,
  vouchers,
  gameItems,
}) {
  const { address } = useContext(GlobalContext);
  const [collectorScore, setCollectorScore] = useState(0);

  useEffect(() => {
    let _scores = {};
    players.forEach((nft) => {
      const { properties, attributes } = nft?.metadata;
      const type = (properties || attributes || []).find(
        (attribute) => attribute.trait_type === 'type'
      );

      let _score = getScore(type?.value?.toLowerCase(), 1);

      _scores[nft['owner']] = (_scores[nft['owner']] || 0) + _score;
    });

    votes.forEach((nft) => {
      let _score = getScore('vote', 1);
      _scores[nft['owner']] = (_scores[nft['owner']] || 0) + _score;
    });
    vouchers.forEach((nft) => {
      const { properties, attributes } = nft?.metadata;
      const type = (properties || attributes || []).find(
        (attribute) => attribute.trait_type === 'type'
      );

      let _score = getScore(type?.value?.toLowerCase(), 5);

      _scores[nft['owner']] = (_scores[nft['owner']] || 0) + _score;
    });
    gameItems.forEach((nft) => {
      const { properties, attributes } = nft?.metadata;
      const type = (properties || attributes || []).find(
        (attribute) => attribute.trait_type === 'type'
      );

      let _score = getScore(type?.value?.toLowerCase(), 0.5);

      _scores[nft['owner']] = (_scores[nft['owner']] || 0) + _score;
    });
    setCollectorScore(Object.values(_scores).reduce((a, b) => a + b, 0));
  }, [players, votes, vouchers, gameItems]);

  return (
    <StyledProfileHeading>
      <div className="main">
        <div className="info">
          <h1
            style={{
              cursor: 'pointer',
            }}
          >
            <CopyToClipboard
              text={address}
              onCopy={() => {
                toast.success('Address copied to clipboard');
              }}
            >
              <span>{humanizeAddress(address || '')} </span>
            </CopyToClipboard>
          </h1>
          <p>
            Collectors Score: <span>{collectorScore}</span> Points
          </p>
        </div>
      </div>
    </StyledProfileHeading>
  );
}

const StyledProfileHeading = styled.div`
  padding: 2rem 2rem 0;
  .main {
    align-items: center;
    display: flex;
    position: absolute;
    // top: -55px;
    // @media (max-width: 768px) {
    //   top: -10px;
    // }
  }
  .info {
    margin-left: 2rem;
    input {
      border: none;
      border-bottom: 2px solid rgba(76, 76, 109, 0.25);
      display: inline-block;
      margin-left: 20px;
      font-weight: bold;
      max-width: 130px;
      color: #30475e;
      font-size: 1rem;
      padding: 0 1.2rem;
      &:focus-visible {
        outline: none;
      }
    }
    h1 {
      font-weight: bold;
      display: inline-block;
    }
    p {
      font-weight: bold;
      margin-top: 0.25rem;
      color: ${colors.secondary};
    }
  }
`;
