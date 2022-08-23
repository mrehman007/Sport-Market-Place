import styled, { keyframes } from 'styled-components';
import { useContext, useState } from 'react';
import { colors } from '../styles/colors';

import Button from './Button';
import Image from 'next/image';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
import { toast } from 'react-toastify';
import { GlobalContext } from '../context';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { config } from '../config';

export default function ClubBoxWidget({ pack }) {
  const {
    getProviderOrSigner,
    isLoading,
    setIsLoading,
    setGlobalStateChanged,
  } = useContext(GlobalContext);

  const { width, height } = useWindowSize();
  const [redeemModal, setRedeemModal] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleRedeemPack = async () => {
    setRedeemModal(true);
    setIsLoading(true);
    console.log('redeeming pack', pack);

    try {
      const signer = await getProviderOrSigner(true);
      const sdk = new ThirdwebSDK(signer);
      const packContract = sdk.getPack(config.PACK_ADDRESS);
      const tx = await packContract.open(pack.metadata.id);
      setGlobalStateChanged(true);
      setShowCard(true);
      setShowConfetti(true);
    } catch (error) {
      toast.error(error.message || error);
      setShowCard(false);
      setShowConfetti(false);
    }
    setIsLoading(false);
  };

  const closeRedeem = () => {
    setRedeemModal(false);
    setShowCard(false);
  };

  return (
    <BoxWidget showCard={showCard}>
      <div className="container">
        <div className="content">
          {/* <h3 className="title">{pack?.metadata?.name || ''}</h3> */}
          <div className="players">
            <div onClick={() => handleRedeemPack()}>
              <div className="voucher">
                {/* <div> */}
                {/* <Image src={pack?.metadata.image || "/logo.png"} alt={pack?.metadata.name || ''} layout='fill' /> */}
                {/* </div> */}
                <h3>{pack?.metadata?.name || ''}</h3>
                <Button>Redeem</Button>
              </div>
              {/* <Item key={uuid()} title="{pack?.metadata?.name ||''}" image={"/logo.png"} /> */}
            </div>
          </div>
          {redeemModal && (
            <div className="redeem">
              <Confetti
                width={width}
                height={height}
                numberOfPieces={showConfetti ? 1000 : 0}
                recycle={false}
                onConfettiComplete={(confetti) => {
                  setShowConfetti(false);
                  confetti.reset();
                }}
              />

              <div className="modal">
                <h3>{pack?.metadata?.name || ''}</h3>
                {isLoading ? (
                  <p>Processing...</p>
                ) : (
                  <>
                    <div className="reveal">
                      <div className="card">
                        <Image
                          src={pack?.metadata?.image || '/logo.png'}
                          alt={pack?.metadata?.name || ''}
                          layout="fill"
                        />
                      </div>
                    </div>
                    <Button primary onClick={() => closeRedeem()}>
                      Close
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </BoxWidget>
  );
}

const revealAnimation = keyframes`
  0% {
    transform: scale(0) rotateY(720deg);
  }
  100% {
    transform: scale(1) rotateY(0deg);
  }
`;

const BoxWidget = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #eef0f8;
  h1 {
    color: ${colors.primary};
  }
  .content {
    position: relative;
    /* z-index: 2; */
    .title {
      margin-top: 2rem;
      color: ${colors.secondary};
    }
    .players {
      margin-top: 1.5rem;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      @media (max-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
      }
      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }
      @media (max-width: 500px) {
        grid-template-columns: repeat(1, 1fr);
      }
      gap: 1rem;
      button {
        border: none;
        // background: none;
        cursor: pointer;
        font-weight: bold;
      }
      h3 {
        font-weight: bold;
        color: white;
      }
    }
  }

  .redeem {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    p {
      margin-bottom: 1.5rem;
    }
    .modal {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      max-width: 500px;
      background-color: ${colors.background};
      border-radius: 10px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      h3 {
        margin-bottom: 1rem;
        font-size: 1.5rem;
      }
      .card {
        width: 250px;
        height: 300px;
        border-radius: 10px;
        background-color: ${colors.primary};
        border: 1px solid ${colors.primary};
        position: relative;
        overflow: hidden;
        transform-origin: center;
        transform-style: preserve-3d;
        perspective: 1000px;
        animation: ${revealAnimation} 2s ease;
        box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.1);
        img {
          height: 100%;
          width: 100%;
          object-fit: contain;
          transition: all 0.3s ease;
          transform-origin: center;
          background: ${colors.background};
          opacity: ${({ showCard }) => (showCard ? 1 : 0)};
          transform: ${({ showCard }) =>
    showCard ? 'scale(1)' : 'scale(0.8)'};
        }
      }
      .reveal {
        margin-bottom: 1.5rem;
      }
      @media (max-width: 500px) {
        width: 80%;
        height: 70%;
      }
    }
  }
  .voucher {
    box-shadow: 0px 0px 2rem rgb(76 76 109 / 50%);
    padding: 1rem;
    border-radius: 0.5rem;
    // background-color: ${colors.background};
    background: linear-gradient(
      90deg,
      rgba(131, 58, 180, 1) 0%,
      rgba(176, 82, 202, 1) 25%,
      rgba(185, 129, 212, 1) 50%,
      rgba(131, 58, 180, 1) 50%,
      rgba(176, 82, 202, 1) 75%,
      rgba(185, 129, 212, 1) 100%
    );
    // color: ${colors.secondary};
    // border: 1px dashed ${colors.background};
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.5s ease-in-out;
    background-size: 200% 100%;
    overflow: hidden;
    div {
      display: flex;
    }
    img {
      width: 100px;
    }
    p {
      margin-top: 0.5rem;
    }
    button {
      background: rgba(${colors.secondaryRGB}, 0.8) !important;
      color: ${colors.background} !important;
      border: none;
      padding: 0.3rem 1rem;
      border-radius: 0.25rem;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      &:hover {
        background: rgba(${colors.secondaryRGB}, 1) !important;
      }
    }

    &:hover {
      transform: perspective(500px) rotateY(15deg);
      text-shadow: -6px 3px 2px rgba(0, 0, 0, 0.2);
      box-shadow: -2px 0 0 5px rgba(0, 0, 0, 0.2);
      background-position: 100% 0;
    }
    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(to right, transparent, white, transparent);
      left: -100%;
      transition: 0.5s;
    }

    &:hover::before {
      left: 100%;
    }

    @media (max-width: 500px) {
      min-height: 7em;
    }
  }
`;
