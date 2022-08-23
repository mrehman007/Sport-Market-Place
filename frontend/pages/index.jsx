import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import Button from '../components/Button';
import { FaArrowRight } from 'react-icons/fa';
import { colors } from '../styles/colors';
import SearchBar from '../components/SearchBar';
import { useEffect } from 'react';
import { createItem } from '../utils/createItem';

export default function IndexPage() {
  // useEffect(() => {
  //   createItem()
  // }, [])
  return (
    <main>
      <Head>
        <title>Fantasy Sport Marketplace</title>
        <meta
          name="description"
          content="The world's first NFT marketplace built for sports fans!"
        />
      </Head>
      <StyledIntro>
        <div className="backdrop"></div>
        <div className="container">
          <SearchBar />
          <div className="left">
            <h1>Browse, collect, and trade your players</h1>
            <h2>A marketplace built for sports fans!</h2>
            <div className="cta">
              <Link href="/explore" passHref>
                <a>
                  <Button primary>Explore</Button>
                </a>
              </Link>
            </div>
          </div>
          <div className="right">
            <Link href="/explore" passHref>
              <a className="art">
                <Image src="/player.png" alt="nft" layout="fill" />
                <h3>
                  Browse Marketplace
                  <FaArrowRight />
                </h3>
              </a>
            </Link>
          </div>
        </div>
      </StyledIntro>
    </main>
  );
}

const StyledIntro = styled.section`
  * {
    margin: 0;
    box-sizing: border-box;
  }
  padding: 2rem 2rem 6rem;
  position: relative;
  .backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/bg-dark.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: -1;
  }
  @media (max-width: 768px) {
    min-height: auto;
  }
  .search-bar {
    margin-bottom: 1rem;
    min-width: 100%;
    @media (min-width: 801px) {
      display: none;
    }
  }
  .container {
    /* min-height: 90vh; */
    max-width: 1366px;
    margin: 3rem auto 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media (max-width: 900px) {
      min-height: auto;
      flex-direction: column;
      margin: 1rem auto 0;
    }
  }
  .left,
  .right {
    position: relative;
    z-index: 2;
    flex: 1;
  }
  .left {
    margin-right: 2rem;
    h1 {
      font-size: 3rem;
      color: ${colors.background};
      font-weight: bold;
    }
    h2 {
      margin-top: 1rem;
      font-weight: bold;
      color: ${colors.background};
    }
    .cta {
      margin-top: 1.5rem;
      button {
        background-color: ${colors.background};
        color: ${colors.primary};
        border: none;
      }
    }
  }
  .right {
    .art {
      box-shadow: 0 20px 25px -5px rgba(${colors.tertiaryRGB}, 0.1),
        0 10px 10px -5px rgba(${colors.tertiaryRGB}, 0.04);
      width: 100%;
      height: 60vh;
      display: block;
      overflow: hidden;
      border-radius: 1rem;
      position: relative;
      @media (max-width: 900px) {
        margin-top: 2rem;
        height: 50vh;
        width: calc(100vw - 4rem);
        background-color: ${colors.background};
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        z-index: 2;
      }
      h3 {
        width: 100%;
        font-size: 1.5rem;
        font-weight: bold;
        background-color: #ffffff;
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 1rem 1.5rem;
        font-size: 0.9rem;
        z-index: 10;
        display: flex;
        align-items: center;
        svg {
          margin-left: 0.5rem;
        }
        span {
          font-weight: 600;

          color: #000000;
        }
      }
      a {
        color: ${colors.primary};
        font-weight: 400;
      }
    }
  }
`;
