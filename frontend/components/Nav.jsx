/* eslint-disable @next/next/link-passhref */
import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import Link from 'next/link';
import { MdOutlineAccountBalanceWallet, MdLogout } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import Button from './Button';
import { useRouter } from 'next/router';
import SearchBar from './SearchBar';
import { colors } from '../styles/colors';
import { ContractContext, AuthContext, GlobalContext } from '../context';
import { humanizeAddress } from '../helpers';
import { toast } from 'react-toastify';
import { utils } from 'ethers';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function Nav() {
  const { isLoggedIn, logout, login } = useContext(AuthContext);

  const {
    address,
    handleDisconnectWallet,
    handleConnectWallet,
    getProviderOrSigner,
  } = useContext(GlobalContext);
  const { hasRole } = useContext(ContractContext);
  const { pathname } = useRouter();
  const [menu, setMenu] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [balance, setBalance] = useState(0);
  const [hasAdminRole, setHasAdminRole] = useState(false);

  useEffect(() => {
    if (window.innerWidth > 1199) {
      setMenu(true);
    }
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1200) {
        setMenu(true);
      } else {
        setMenu(false);
      }
    });
  }, []);

  useEffect(() => {
    if (address) {
      login(address);

      getProviderOrSigner()
        .then((provider) => {
          provider &&
            provider.getBalance(address).then((balance) => {
              setBalance(parseFloat(utils.formatEther(balance)).toFixed(4));
            });
          hasRole(address)
            .then((role) => {
              setHasAdminRole(role);
            })
            .catch((err) => { });
        })
        .catch((err) => { });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return (
    <StyledNav>
      <Link href="/">
        <h3>
          <div>
            <Image src="/logo.svg" alt="" layout="fill" />
          </div>
          PPC
        </h3>
      </Link>
      <SearchBar />

      <div
        className="links"
        style={{
          display: menu ? 'flex' : 'none',
        }}
      >
        <Link href="/listings" passHref>
          <a
            className={pathname === '/listings' ? 'active' : undefined}
            onClick={() => window.innerWidth <= 1200 && setMenu(false)}
          >
            Listings
          </a>
        </Link>
        <Link href="/auctions" passHref>
          <a
            className={pathname === '/auctions' ? 'active' : undefined}
            onClick={() => window.innerWidth <= 1200 && setMenu(false)}
          >
            Auctions
          </a>
        </Link>

        {address && (
          <div className="profile-items">
            <button onClick={() => setProfileMenu(!profileMenu)}>
              <FaUserCircle />
            </button>
            {profileMenu && (
              <div className="profile-links">
                <Link href="/profile" passHref>
                  <a
                    className={pathname === '/profile' ? 'active' : undefined}
                    onClick={() => {
                      setProfileMenu(false);
                      window.innerWidth <= 1200 && setMenu(false);
                    }}
                  >
                    Profile
                  </a>
                </Link>
                <Link href="/leaderboard" passHref>
                  <a
                    className={
                      pathname === '/leaderboard' ? 'active' : undefined
                    }
                    onClick={() => {
                      setProfileMenu(false);
                      window.innerWidth <= 1200 && setMenu(false);
                    }}
                  >
                    Leaderboard
                  </a>
                </Link>
                {/* {!hasAdminRole && (
                  <Link href="/claim" passHref>
                    <a
                      className={pathname === '/claim' ? 'active' : undefined}
                      onClick={() => {
                        setProfileMenu(false);
                        window.innerWidth <= 1200 && setMenu(false);
                      }}
                    >
                      Claim
                    </a>
                  </Link>
                )} */}

                {hasAdminRole && (
                  <Link href="/vote" passHref>
                    <a
                      className={pathname === '/vote' ? 'active' : undefined}
                      onClick={() => {
                        setProfileMenu(false);
                        window.innerWidth <= 1200 && setMenu(false);
                      }}
                    >
                      Vote
                    </a>
                  </Link>
                )}
                {hasAdminRole && (
                  <>
                    <Link href="/create-item" passHref>
                      <a
                        className={
                          pathname === '/create-item' ? 'active' : undefined
                        }
                        onClick={() => {
                          setProfileMenu(false);
                          window.innerWidth <= 1200 && setMenu(false);
                        }}
                      >
                        Create Item
                      </a>
                    </Link>
                    <Link href="/create-pack" passHref>
                      <a
                        className={
                          pathname === '/create-pack' ? 'active' : undefined
                        }
                        onClick={() => {
                          setProfileMenu(false);
                          window.innerWidth <= 1200 && setMenu(false);
                        }}
                      >
                        Create Pack
                      </a>
                    </Link>
                    <Link href="/payout" passHref>
                      <a
                        className={
                          pathname === '/payout' ? 'active' : undefined
                        }
                        onClick={() => {
                          setProfileMenu(false);
                          window.innerWidth <= 1200 && setMenu(false);
                        }}
                      >
                        Payout
                      </a>
                    </Link>
                    <Link href="/create-challenges" passHref>
                      <a
                        className={
                          pathname === '/create-challenges'
                            ? 'active'
                            : undefined
                        }
                        onClick={() => {
                          setProfileMenu(false);
                          window.innerWidth <= 1200 && setMenu(false);
                        }}
                      >
                        Challenges
                      </a>
                    </Link>
                    <Link href="/balances" passHref>
                      <a
                        className={
                          pathname === '/balances' ? 'active' : undefined
                        }
                        onClick={() => {
                          setProfileMenu(false);
                          window.innerWidth <= 1200 && setMenu(false);
                        }}
                      >
                        Balances
                      </a>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="wallet-btn">
        {address && showBalance && (
          <div className="wallet-info">
            <div>
              <div className="wallet-icon">
                <Image src="/matic.svg" alt="bnb" layout="fill" />
              </div>
              <span>{balance} MATIC</span>
            </div>
            <Button onClick={() => handleDisconnectWallet()}>
              <MdLogout size={16} />
            </Button>
          </div>
        )}
        {address ? (
          <>
            <div className="no-mobile">
              <Button>
                <div>
                  <CopyToClipboard
                    text={address}
                    onCopy={() => {
                      toast.success('Address copied to clipboard');
                    }}
                  >
                    <span>{humanizeAddress(address)} </span>
                  </CopyToClipboard>
                </div>
              </Button>
            </div>
            <Button onClick={() => setShowBalance(!showBalance)}>
              <MdOutlineAccountBalanceWallet />
            </Button>
          </>
        ) : (
          <Button onClick={() => handleConnectWallet()}>
            <MdOutlineAccountBalanceWallet />
          </Button>
        )}
      </div>
      <div className="menu-btn">
        <Button primary onClick={() => setMenu(!menu)}>
          Menu
        </Button>
      </div>
    </StyledNav>
  );
}

const StyledNav = styled.nav`
  padding: 1.5rem 2rem;
  background-color: ${colors.background};
  color: ${colors.secondary};
  box-shadow: 0px 0px 2rem rgba(${colors.tertiaryRGB}, 0.5);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  position: relative;
  z-index: 98;
  .no-mobile {
    display: inline-block;
    @media (max-width: 500px) {
      display: none;
    }
  }
  .profile-items {
    display: flex;
    position: relative;
    button {
      padding: 0 !important;
      border: none;
      background: none;
      color: ${colors.secondary};
      cursor: pointer;
      svg {
        font-size: 1.5rem;
      }
    }
  }
  .profile-links {
    position: absolute;
    top: calc(100% + 1rem);
    right: -1rem;
    background-color: ${colors.background};
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0px 0px 2rem rgba(${colors.tertiaryRGB}, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    &::after {
      content: '';
      position: absolute;
      top: -0.5rem;
      right: 1.25rem;
      width: 1rem;
      height: 1rem;
      background-color: ${colors.background};
      box-shadow: 0px 0px 2rem rgba(${colors.tertiaryRGB}, 0.5);
      transform: rotate(45deg);
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    }
  }
  svg {
    font-size: 1.3rem;
  }
  button {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  @media (max-width: 800px) {
    .search-bar {
      display: none;
    }
  }
  .search-bar {
    margin: 0 auto;
  }
  @media (max-width: 1200px) {
    gap: 1rem;
  }
  .wallet-btn {
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
    @media (max-width: 1200px) {
      margin-left: auto;
    }
    button {
      padding: 0.25rem 1rem;
      font-size: 0.9rem;
    }
    .wallet-info {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      background-color: ${colors.background};
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.9rem;
      font-weight: 600;
      border: 2px solid ${colors.primary};
      transition: all 0.3s ease-in-out;
      display: flex;
      align-items: center;
      white-space: nowrap;
      button {
        margin-left: 0.5rem;
      }
      div {
        display: flex;
        align-items: center;
      }
      p {
        display: flex;
        align-items: center;
        margin-right: 1rem;
        color: ${colors.primary};
        span {
          margin-left: 0.5rem;
        }
      }
      .wallet-icon {
        position: relative;
        width: 18px;
        height: 18px;
        margin-right: 0.5rem;
      }
      &::after {
        content: '';
        position: absolute;
        width: fit-content;
        bottom: calc(100% - 0.25rem);
        right: 1rem;
        width: 0.5rem;
        height: 0.5rem;
        transform: rotate(45deg);
        background-color: ${colors.primary};
        border: 1px solid ${colors.primary};
        clip-path: polygon(0 0, 0% 100%, 100% 0);
        z-index: -1;
      }
    }
  }
  h3 {
    font-weight: 600;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    color: ${colors.primary};
    line-height: 1;
    div {
      position: relative;
      margin-right: 0.75rem;
      height: 3rem;
      aspect-ratio: 1;
      img {
        object-fit: contain;
      }
    }
    @media (max-width: 768px) {
      font-size: 1rem;
    }
    cursor: pointer;
  }
  .active {
    color: ${colors.primary};
  }
  .menu-btn {
    @media (min-width: 1201px) {
      display: none;
    }
    button {
      padding: 0.25rem 1rem;
      font-size: 0.9rem;
    }
  }
  .links {
    display: flex;
    align-items: center;
    margin-left: auto;
    gap: 2rem;
    font-weight: 600;
    @media (max-width: 1200px) {
      position: absolute;
      top: 100%;
      background-color: ${colors.background};
      width: 100%;
      left: 0;
      padding: 0 2rem 1.5rem;
      box-shadow: 0 20px 25px -5px rgba(${colors.tertiaryRGB}, 0.1),
        0 10px 10px -5px rgba(${colors.tertiaryRGB}, 0.04);
    }
    @media (max-width: 800px) {
      flex-direction: column;
    }
    button {
      font-size: 1.5rem;
      padding: 0.25rem 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;

export const TabBox = styled.button`
  font-size: 14px !important;
  padding: 5px 10px;
  text-decoration: none;
  display: inline-block;
  border: 1px solid ${colors.secondary};
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  -ms-border-radius: 5px;
  border-radius: 5px;

  color: ${colors.secondary};
  font-size: 14px;
  background-color: transparent;
  cursor: pointer;
`;
