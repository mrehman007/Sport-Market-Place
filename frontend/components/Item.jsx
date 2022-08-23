import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import { FaEthereum, FaRegHeart } from "react-icons/fa";
import { MdAccessTimeFilled, MdVerified } from "react-icons/md";
import { shimmer, toBase64 } from "../utils/placeholder";
import { colors } from "../styles/colors";

export default function Item({
  to,
  image,
  title,
  user,
  price,
  lastPrice,
  daysLeft,
  heart,
  isVerified,
  isFavorite,
  type,
  showPrice,
  provider,
  tokenContract,
  tokenId,
}) {

  return (
    <StyledItem>
      {to && (
        <Link href={to} passHref>
          <a className="item">
            <div className="image">
              <Image
                src={image.replace('https://gateway.pinata.cloud', 'https://ipfs.infura.io')}
                alt={title}
                layout="fill"
                quality={50}
                objectFit="cover"
                objectPosition="center"
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                  shimmer(200, 200)
                )}`}
              />
            </div>
            <div className="item__details">
              <div className="item__flex">
                <div className="item__flex__left">
                  <p className="item__details__user">
                    {user} {isVerified && <MdVerified size={12} />}
                  </p>
                  <p className="item__details__title">{title}</p>
                </div>
                <div className="item__flex__right">
                  {lastPrice && (
                    <p className="item__details__last">
                      Last{" "}
                      <span>
                        <FaEthereum size={12} /> {lastPrice}
                      </span>
                    </p>
                  )}
                  {daysLeft && (
                    <p className="item__details__time">
                      <MdAccessTimeFilled size={12} /> {daysLeft}{" "}
                      {daysLeft > 1 ? "days" : "day"} left
                    </p>
                  )}
                </div>
              </div>
            </div>
            {type && (
              <div className="type-set">
                <p className="type">{type}</p>
                {price && (
                  <p className="item__details__price">
                    <span>
                      <Image
                        src="/matic.svg"
                        alt="bnb"
                        height={18}
                        width={18}
                      />
                      {price}
                    </span>
                  </p>
                )}
              </div>
            )}
            {heart && (
              <div className="item__action">
                <FaRegHeart
                  size={16}
                  color={isFavorite ? "#EB5757" : "#707a83"}
                />
                <p>{heart}</p>
              </div>
            )}
          </a>
        </Link>
      )}
      {!to && (
        <div className="item">
          <div className="image">
            <Image
              src={image}
              alt={title}
              layout="fill"
              quality={50}
              objectFit="cover"
              objectPosition="center"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                shimmer(200, 200)
              )}`}
            />
          </div>
          <div className="item__details">
            <div className="item__flex">
              <div className="item__flex__left">
                <p className="item__details__user">
                  {user} {isVerified && <MdVerified size={12} />}
                </p>
                <p className="item__details__title">{title}</p>
              </div>
              <div className="item__flex__right">
                {lastPrice && (
                  <p className="item__details__last">
                    Last{" "}
                    <span>
                      <FaEthereum size={12} /> {lastPrice}
                    </span>
                  </p>
                )}
                {daysLeft && (
                  <p className="item__details__time">
                    <MdAccessTimeFilled size={12} /> {daysLeft}{" "}
                    {daysLeft > 1 ? "days" : "day"} left
                  </p>
                )}
              </div>
            </div>
          </div>
          {type && (
            <div className="type-set">
              <p className="type">{type}</p>

              {price && (
                <p className="item__details__price">
                  <span>
                    <Image src="/matic.svg" alt="bnb" height={18} width={18} />
                    {price}
                  </span>
                </p>
              )}
            </div>
          )}
          {heart && (
            <div className="item__action">
              <FaRegHeart
                size={16}
                color={isFavorite ? "#EB5757" : "#707a83"}
              />
              <p>{heart}</p>
            </div>
          )}
        </div>
      )}
    </StyledItem>
  );
}

const StyledItem = styled.div`
  display: block;
  // box-shadow: 0 20px 25px -5px rgba(${colors.tertiaryRGB}, 0.1),
  //   0 10px 10px -5px rgba(${colors.tertiaryRGB}, 0.04);
  box-shadow: 0px 0px 2rem rgb(76 76 109 / 50%);
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid rgba(${colors.tertiaryRGB}, 0.25);
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 30px -12px rgb(83 81 81 / 58%);
    transition: all 0.5s ease;
  }
  a {
    text-decoration: none;
    outline-offset: -2px;
  }
  img {
    width: 100%;
    height: 100%;
    max-height: 200px;
    object-fit: cover;
    object-position: center;
  }
  .type-set {
    padding: 0 1rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .type {
      font-size: 0.7rem;
      font-weight: 300;
      border: 1px solid rgba(${colors.tertiaryRGB}, 0.25);
      color: ${colors.tertiary};
      padding: 0.1rem 0.3rem;
      border-radius: 0.25rem;
      width: fit-content;
      margin-right: 0.5rem;
      white-space: nowrap;
    }
  }
  .item {
    display: block;
    min-height: 100%;
    position: relative;
    .image {
      position: relative;
      min-height: 100px;
      width: 100%;
      aspect-ratio: 1;
      background-color: white;
      img {
        object-fit: cover;
        object-position: center;
      }
    }
    &__flex {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
    }
    &__details {
      border-top: 1px solid rgba(${colors.tertiaryRGB}, 0.25);
      padding: 1rem;
      height: 100%;
      background-color: ${colors.background};
      &__user {
        font-size: 0.7rem;
        color: ${colors.secondary};
        font-weight: 600;
        display: flex;
        align-items: center;
        svg {
          margin-left: 0.25rem;
          color: #c4c6ec;
        }
      }
      &__title {
        font-size: 1rem;
        font-weight: 700;
        margin-top: 0.25rem;
        line-height: 1;
        color: ${colors.primary};
      }
      &__price {
        font-size: 0.7rem;
        text-align: right;
        color: ${colors.secondary};
        font-weight: 600;
        svg {
          color: ${colors.primary};
        }
        span {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          font-size: 0.9rem;
          font-weight: 700;
          color: ${colors.primary};
          gap: 0.25rem;
          min-width: fit-content;
        }
      }
      &__last {
        margin-top: 0.25rem;
        font-size: 0.7rem;
        color: #707a83;
        font-weight: 600;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        span {
          margin-left: 0.25rem;
          color: #000000;
        }
      }
      &__time {
        margin-top: 0.25rem;
        font-size: 0.7rem;
        color: #707a83;
        font-weight: 600;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        svg {
          margin-right: 0.25rem;
        }
      }
    }
    &__action {
      border-top: 1px solid #e5e8eb;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0.5rem 1rem;
      p {
        margin-left: 0.5rem;
        font-size: 0.8rem;
        font-weight: 600;
        color: #707a83;
      }
    }
  }
`;
