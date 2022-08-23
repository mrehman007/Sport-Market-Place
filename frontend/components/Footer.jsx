import styled from 'styled-components';
import { useState } from 'react';
import Button from './Button';
import { FaTwitter, FaDiscord, FaInstagram } from 'react-icons/fa';
import Image from 'next/image';
import { colors } from '../styles/colors';
import Head from 'next/head';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
  };

  return (
    <StyledFooter>
      <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1"
          crossOrigin="anonymous"
        />
      </Head>
      <div className="container">
        <div className="d-flex justify-content-between footer-main">
          <div className="footer-top">
            <div className="flex">
              <div className="newsletter">
                <h3>Ready to dive in?</h3>
                <p>
                  Whether you’re a creator or collector, we want to hear from
                  you. If you want to know more about NFT’s or you’re an artist
                  who is interested in submitting potential player variant
                  artwork, join us via email below!
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                  style={{
                    opacity: loading ? 0.5 : 1,
                    pointerEvents: loading ? 'none' : 'all',
                  }}
                >
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" primary>
                    Join
                  </Button>
                </form>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div>
              <h3>
                <div>
                  <Image src="/logo.svg" alt="" layout="fill" />
                </div>
                PPC
              </h3>
              <p>
                The world{"'"}s first NFT marketplace built for sports fans!
              </p>
            </div>
            <div className="footer-bottom__extra">
              <h3>Join the community</h3>
              <div className="footer-links">
                <a href="https://www.instagram.com/nftfantasyclub">
                  <FaInstagram size={20} />
                </a>
                <a href="https://twitter.com/nftfantasyclub">
                  <FaTwitter size={20} />
                </a>
                <a href="https://discord.gg/WsxnSEzF6P">
                  <FaDiscord size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="copy">
        &copy; {new Date().getFullYear()} Fantasy Sport. All rights reserved.
      </div>
    </StyledFooter>
  );
}

const StyledFooter = styled.footer`
  box-shadow: 0 -20px 25px -5px rgba(${colors.tertiaryRGB}, 0.1),
    0 -10px 10px -5px rgba(${colors.tertiaryRGB}, 0.04);
  .container {
    max-width: 1366px;
    margin: 0 auto;
  }
  .flex {
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    @media (max-width: 1000px) {
      flex-direction: column;
    }
    div {
      max-width: 500px;
      @media (max-width: 375px) {
        max-width: 100%;
      }
    }
  }
  .newsletter {
    margin: auto;
    margin-top: 2rem;
  }
  .footer-main {
    @media (max-width: 768px) {
      flex-direction: column;
      text-align: center;
    }
  }
  .footer {
    &-top {
      padding: 2rem 2rem;
      @media (max-width: 1000px) {
        padding: 2rem;
      }
      h3 {
        font-size: 1.5rem;
        color: ${colors.primary};
        font-weight: 600;
      }
      p {
        margin-top: 1rem;
        color: ${colors.secondary};
        font-weight: 600;
      }
    }
    &-link {
      display: inline-block;
      color: ${colors.primary};
      font-weight: 700;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
    }
    &-links {
      margin-top: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
      a {
        background-color: ${colors.primary};
        color: #fff;
        padding: 1rem;
        border-radius: 0.5rem;
        display: grid;
        place-items: center;
        &:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      }
      @media (max-width: 768px) {
        justify-content: center;
      }
    }
    &-bottom {
      padding: 2rem 2rem;
      h3 {
        font-size: 1.5rem;
        color: ${colors.primary};
        display: flex;
        align-items: center;
        font-weight: 600;
        div {
          position: relative;
          margin-right: 1rem;
          width: 60px;
          aspect-ratio: 1;
          img {
            object-fit: contain;
          }
        }
        @media (max-width: 768px) {
          justify-content: center;
        }
      }
      p {
        margin-top: 1rem;
        color: ${colors.secondary};
        font-weight: 600;
      }
      &__extra {
        margin-top: 2rem;
      }
    }
  }
  .copy {
    margin-top: 4rem;
    @media (max-width: 1000px) {
      margin-top: 2rem;
    }
    padding: 1rem 2rem;
    text-align: center;
    font-size: 0.8rem;
    font-weight: 600;
    background-color: ${colors.primary};
    color: ${colors.background};
  }
  form {
    margin-top: 1rem;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    @media (max-width: 768px) {
      flex-direction: column;
    }
    input {
      flex: 1;
      padding: 0.8rem 1.2rem;
      border: 2px solid rgba(${colors.tertiaryRGB}, 0.25);
      color: ${colors.secondary};
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: bold;
      transition: all 0.3s ease;
    }
  }
`;
