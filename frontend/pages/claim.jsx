import styled from "styled-components";
import ScrollAnimation from "react-animate-on-scroll";
import { colors } from "../styles/colors";

export default function Claim() {
  return (
    <StyledClaim>
      <div className="container">
        <div className="content">
          {/* <h1>Claim</h1> */}
          {/* <h3 className="title">Vouchers</h3> */}
          <div className="vouchers">
            <div className="voucher bronze">
              <div>
                <h3>Bronze Trophy</h3>
                <p>Top 500</p>
              </div>
              <button>Claim</button>
            </div>
            <div className="voucher silver">
              <div>
                <h3>Silver Trophy</h3>
                <p>Top 250</p>
              </div>
              <button>Claim</button>
            </div>
            <div className="voucher gold">
              <div>
                <h3>Gold Trophy</h3>
                <p>Top 100</p>
              </div>
              <button>Claim</button>
            </div>
            <div className="voucher platinum">
              <div>
                <h3>Platinum Trophy</h3>
                <p>Top 50</p>
              </div>
              <button>Claim</button>
            </div>
            <div className="voucher diamond">
              <div>
                <h3>Diamond Trophy</h3>
                <p>Top 10</p>
              </div>
              <button>Claim</button>
            </div>
          </div>
          {/* <div className="vouchers">
            <div className="voucher">
              <div>
                <h3>Bronze Trophy</h3>
                <p>Top 500</p>
              </div>
              <button>Claim</button>
            </div>
            <div className="voucher">
              <div>
                <h3>Silver Trophy</h3>
                <p>Top 250</p>
              </div>
              <button>Claim</button>
            </div>
            <div className="voucher">
              <div>
                <h3>Gold Trophy</h3>
                <p>Top 100</p>
              </div>
              <button>Claim</button>
            </div>
            <div className="voucher">
              <div>
                <h3>Platinum Trophy</h3>
                <p>Top 50</p>
              </div>
              <button>Claim</button>
            </div>
            <div className="voucher">
              <div>
                <h3>Diamond Trophy</h3>
                <p>Top 10</p>
              </div>
              <button>Claim</button>
            </div>
          </div> */}
        </div>
      </div>
    </StyledClaim>
  );
}

const StyledClaim = styled.div`
  padding: 2rem 2rem 6rem;
  min-height: 100vh;
  position: relative;
  background-color: #eef0f8;
  h1 {
    color: ${colors.primary};
  }
  .content {
    position: relative;
    z-index: 2;
    .title {
      margin-top: 2rem;
      color: ${colors.secondary};
    }
    .players {
      margin-top: 1.5rem;
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      @media (max-width: 1366px) {
        grid-template-columns: repeat(5, 1fr);
      }
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
    }
    .vouchers {
      margin-top: 2rem;
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
    }
    .bronze {
      // background: linear-gradient(
      //   -72deg,
      //   #dd9e7c,
      //   #ffdeca 8%,
      //   #ca7345 10.5%,
      //   #ffdeca 12%,
      //   #ce7552 13.5%,
      //   #ca7345 18%,
      //   #ffdeca 22.5%,
      //   #ffdeca 30%,
      //   #ca7345 36%,
      //   #ffdeca 40%,
      //   #ca7345 42%,
      //   #e48b69 50%,
      //   #dd9e7c 50%,
      //   #ffdeca 58%,
      //   #ca7345 60.5%,
      //   #ffdeca 62%,
      //   #ce7552 63.5%,
      //   #ca7345 68%,
      //   #ffdeca 72.5%,
      //   #ffdeca 80%,
      //   #ca7345 86%,
      //   #ffdeca 90%,
      //   #ca7345 92%,
      //   #e48b69 100%
      // );
      background: linear-gradient(
        90deg,
        rgba(133, 84, 32, 1) 0%,
        rgba(187, 122, 52, 1) 25%,
        rgba(231, 174, 114, 1) 50%,
        rgba(133, 84, 32, 1) 50%,
        rgba(187, 122, 52, 1) 75%,
        rgba(231, 174, 114, 1) 100%
      );
      transition: all 0.5s ease-in-out;
      background-size: 200% 100%;
      overflow: hidden;
      color: ${colors.secondary} !important;
      button {
        background: rgba(${colors.secondaryRGB}, 0.8) !important;
        color: ${colors.background} !important;
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
        content: "";
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
    }
    .silver {
      // background: linear-gradient(
      //   -72deg,
      //   #dedede,
      //   #ffffff 8%,
      //   #dedede 10.5%,
      //   #ffffff 12%,
      //   #cecece 13.5%,
      //   #dedede 18%,
      //   #ffffff 22.5%,
      //   #ffffff 30%,
      //   #dedede 36%,
      //   #ffffff 40%,
      //   #dedede 42%,
      //   #a1a1a1 50%,
      //   #dedede 50%,
      //   #ffffff 58%,
      //   #dedede 60.5%,
      //   #ffffff 62%,
      //   #cecece 63.5%,
      //   #dedede 68%,
      //   #ffffff 72.5%,
      //   #ffffff 80%,
      //   #dedede 86%,
      //   #ffffff 90%,
      //   #dedede 92%,
      //   #a1a1a1 100%
      // );
      background: linear-gradient(
        90deg,
        rgba(178, 178, 178, 1) 0%,
        rgba(194, 194, 194, 1) 25%,
        rgba(210, 210, 210, 1) 50%,
        rgba(178, 178, 178, 1) 50%,
        rgba(194, 194, 194, 1) 75%,
        rgba(210, 210, 210, 1) 100%
      );
      transition: all 0.5s ease-in-out;
      background-size: 200% 100%;
      overflow: hidden;
      color: ${colors.secondary} !important;
      button {
        background: rgba(${colors.secondaryRGB}, 0.8) !important;
        color: ${colors.background} !important;
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
        content: "";
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
    }
    .gold {
      // background: linear-gradient(
      //   -72deg,
      //   #ffde45,
      //   #ffffff 8%,
      //   #ffde45 10.5%,
      //   #ffffff 12%,
      //   #dd934d 13.5%,
      //   #ffde45 18%,
      //   #ffde45 22.5%,
      //   #ffffff 30%,
      //   #ffde45 36%,
      //   #ffffff 40%,
      //   #ffde45 42%,
      //   #cfa073 50%,
      //   #ffde45 50%,
      //   #ffffff 58%,
      //   #ffde45 60.5%,
      //   #ffffff 62%,
      //   #dd934d 63.5%,
      //   #ffde45 68%,
      //   #ffde45 72.5%,
      //   #ffffff 80%,
      //   #ffde45 86%,
      //   #ffffff 90%,
      //   #ffde45 92%,
      //   #cfa073 100%
      // );
      background: linear-gradient(
        90deg,
        rgba(244, 204, 4, 1) 0%,
        rgba(245, 209, 83, 1) 25%,
        rgba(255, 232, 147, 1) 50%,
        rgba(244, 204, 4, 1) 50%,
        rgba(245, 209, 83, 1) 75%,
        rgba(255, 232, 147, 1) 100%
      );
      transition: all 0.5s ease-in-out;
      background-size: 200% 100%;
      overflow: hidden;
      color: ${colors.secondary} !important;
      button {
        background: rgba(${colors.secondaryRGB}, 0.8) !important;
        color: ${colors.background} !important;
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
        content: "";
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
    }
    .platinum {
      // background: linear-gradient(
      //   -72deg,
      //   #dedeff,
      //   #ffffff 8%,
      //   #dedeff 10.5%,
      //   #ffffff 12%,
      //   #bdbdbd 13.5%,
      //   #dedeff 18%,
      //   #ffffff 22.5%,
      //   #ffffff 30%,
      //   #dedeff 36%,
      //   #ffffff 40%,
      //   #dedeff 42%,
      //   #d1d1d1 50%,
      //   #dedeff 50%,
      //   #ffffff 58%,
      //   #dedeff 60.5%,
      //   #ffffff 62%,
      //   #bdbdbd 63.5%,
      //   #dedeff 68%,
      //   #ffffff 72.5%,
      //   #ffffff 80%,
      //   #dedeff 86%,
      //   #ffffff 90%,
      //   #dedeff 92%,
      //   #d1d1d1 100%
      // );
      background: linear-gradient(
        90deg,
        rgba(50, 176, 207, 1) 0%,
        rgba(126, 210, 236, 1) 25%,
        rgba(223, 248, 254, 1) 50%,
        rgba(50, 176, 207, 1) 50%,
        rgba(126, 210, 236, 1) 75%,
        rgba(223, 248, 254, 1) 100%
      );
      transition: all 0.5s ease-in-out;
      background-size: 200% 100%;
      overflow: hidden;
      color: ${colors.secondary} !important;
      button {
        background: rgba(${colors.secondaryRGB}, 0.8) !important;
        color: ${colors.background} !important;
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
        content: "";
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
    }
    .diamond {
      // background: linear-gradient(
      //   -72deg,
      //   #dedede,
      //   #ffffff 8%,
      //   #dedede 10.5%,
      //   #ffffff 12%,
      //   #d7bce4 13.5%,
      //   #e0b6d2 15%,
      //   #dedede 19%,
      //   #ffffff 22.5%,
      //   #ffffff 30%,
      //   #dedede 36%,
      //   #ffffff 40%,
      //   #dedede 42%,
      //   #d0badb 46.5%,
      //   #dea1ca 50%,
      //   #dedede 50%,
      //   #ffffff 58%,
      //   #dedede 60.5%,
      //   #ffffff 62%,
      //   #d7bce4 63.5%,
      //   #e0b6d2 65%,
      //   #dedede 69%,
      //   #ffffff 72.5%,
      //   #ffffff 80%,
      //   #dedede 86%,
      //   #ffffff 90%,
      //   #dedede 92%,
      //   #d0badb 96.5%,
      //   #dea1ca 100%
      // );
      background: linear-gradient(
        90deg,
        rgba(34, 79, 195, 1) 0%,
        rgba(73, 120, 222, 1) 25%,
        rgba(108, 164, 244, 1) 50%,
        rgba(34, 79, 195, 1) 50%,
        rgba(73, 120, 222, 1) 75%,
        rgba(108, 164, 244, 1) 100%
      );
      transition: all 0.5s ease-in-out;
      background-size: 200% 100%;
      overflow: hidden;
      color: ${colors.secondary} !important;
      button {
        background: rgba(${colors.secondaryRGB}, 0.8) !important;
        color: ${colors.background} !important;
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
        content: "";
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
    }
    .voucher {
      box-shadow: 0px 0px 2rem rgb(76 76 109 / 50%);
      padding: 1rem;
      border-radius: 0.5rem;
      background-color: ${colors.secondary};
      color: ${colors.background};
      // border: 1px dashed ${colors.background};
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        margin-top: 0.5rem;
        font-weight: bold;
        color: white;
      }
      h3 {
        font-weight: bold;
        color: white;
      }
      button {
        background-color: rgba(${colors.background}, 0.8);
        color: ${colors.secondary};
        border: none;
        padding: 0.3rem 1rem;
        border-radius: 0.25rem;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        font-weight: bold;
      }
    }
  }
`;
