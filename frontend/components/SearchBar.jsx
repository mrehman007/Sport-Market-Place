import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import { useState, useEffect, useContext } from "react";
import { MdClose, MdSearch } from "react-icons/md";
import { colors } from "../styles/colors";

import { config } from "../config/config";
import { ContractContext, GlobalContext } from "../context";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const { isLoading, setIsLoading } = useContext(GlobalContext);
  const { listings, getActiveListings } = useContext(ContractContext);

  useEffect(() => {
    getActiveListings()
  }, []);

  useEffect(() => {
    if (search !== "") {
      let filteredListings = listings.filter(
        (l) =>
          l?.asset?.name?.toLowerCase().includes(search.toLowerCase()) &&
          l?.quantity.toNumber()
      );
      setSearchData(filteredListings);
    }
  }, [search, listings]);

  return (
    <SearchBarWrapper className="search-bar">
      <StyledSearchBar onSubmit={(e) => e.preventDefault()}>
        <MdSearch size={24} />
        <input
          type="text"
          placeholder="Search for Players"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch("")}>
            <MdClose size={20} />
          </button>
        )}
      </StyledSearchBar>
      {search && (
        <>
          {isLoading ? (
            <Suggestions>
              <h4>Searching...</h4>
            </Suggestions>
          ) : (
            <Suggestions>
              <h4>Search Results:</h4>
              {searchData && searchData.length > 0 ? (
                searchData.map((d) => (
                  <Link
                    href={`/${d?.type === 0 ? "asset" : "auction"}/${d?.id}`}
                    passHref
                    key={d?.id}
                  >
                    <a onClick={() => setSearch("")}>
                      <Image
                        src={
                          (d?.asset?.image.substring(0, 4) !== "ipfs" &&
                            d?.asset?.image) ||
                          "/logo.png"
                        }
                        alt={d?.asset?.name}
                        width={32}
                        height={32}
                      />
                      <span>
                        {d?.asset?.name}{" "}
                        <span className="type">
                          {d?.type === 0 ? "Buy Now" : "Auction"}
                        </span>
                      </span>
                    </a>
                  </Link>
                ))
              ) : (
                <p>No items found</p>
              )}
            </Suggestions>
          )}
        </>
      )}
    </SearchBarWrapper>
  );
}

const SearchBarWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  min-width: 250px;
  position: relative;
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const StyledSearchBar = styled.form`
  display: block;
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid rgba(${colors.tertiaryRGB}, 0.25);
  background-color: ${colors.background};
  position: relative;
  overflow: hidden;
  padding-left: 2rem;
  button {
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translateY(-50%);
    background: none;
    border: none;
    width: 2rem;
    cursor: pointer;
  }
  svg {
    position: absolute;
    top: 50%;
    left: 1rem;
    transform: translateY(-50%);
    color: ${colors.secondary};
  }
  input {
    background: none;
    width: 100%;
    height: 100%;
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: ${colors.secondary};
    border: none;
    &::placeholder {
      color: ${colors.secondary};
    }
    &:focus {
      outline: none;
    }
  }
  &:focus-within {
    box-shadow: 0 20px 25px -5px rgba(${colors.tertiaryRGB}, 0.1),
      0 10px 10px -5px rgba(${colors.tertiaryRGB}, 0.04);
  }
`;

const Suggestions = styled.div`
  position: absolute;
  z-index: 99;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 60vh;
  overflow-y: auto;
  background-color: ${colors.background};
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(${colors.tertiaryRGB}, 0.1),
    0 10px 10px -5px rgba(${colors.tertiaryRGB}, 0.04);
  border: none;
  transition: all 0.7s ease;
  h4 {
    font-size: 0.8rem;
    color: ${colors.primary};
    padding: 1rem 2rem;
    box-shadow: 0 20px 25px -5px rgba(${colors.tertiaryRGB}, 0.1),
      0 10px 10px -5px rgba(${colors.tertiaryRGB}, 0.04);
  }
  .type {
    font-size: 0.7rem;
    font-weight: 300;
    border: 1px solid rgba(${colors.tertiaryRGB}, 0.25);
    color: ${colors.tertiary};
    padding: 0.1rem 0.3rem;
    border-radius: 0.25rem;
    width: fit-content;
    @media (max-width: 500px) {
      display: none;
    }
  }
  a,
  p {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 1rem 2rem;
    transition: all 0.3s ease;
    img {
      display: inline-block;
      border-radius: 50%;
      object-fit: cover;
    }
    span {
      margin: 0 0.5rem 0 1rem;
    }
    svg {
      color: ${colors.secondary};
    }
    box-shadow: 0 20px 25px -5px rgba(${colors.tertiaryRGB}, 0.1),
      0 10px 10px -5px rgba(${colors.tertiaryRGB}, 0.04);
  }
`;
