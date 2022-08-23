import styled, { keyframes } from "styled-components";
import { colors } from "../../styles/colors";

export default function ItemSkeleton() {
  return (
    <StyledItemSkeleton>
      <div className="item">
        <div className="item__image"></div>
        <div className="item__details">
          <div className="item__inner"></div>
          <div className="item__inner-2"></div>
        </div>
      </div>
    </StyledItemSkeleton>
  );
}

const shimmer = keyframes`

    100% {
      transform: translateX(100%);
    }
  `;

const StyledItemSkeleton = styled.div`
  display: block;
  box-shadow: 0 20px 25px -5px rgba(${colors.tertiaryRGB}, 0.1),
    0 10px 10px -5px rgba(${colors.tertiaryRGB}, 0.04);
  border-radius: 0.5rem;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(${colors.tertiaryRGB}, 0.25);
  position: relative;
  &:hover {
    box-shadow: 0 20px 25px -5px rgba(${colors.tertiaryRGB}, 0.1),
      0 10px 10px -5px rgba(${colors.tertiaryRGB}, 0.04);
  }
  .item {
    &__image {
      min-height: 200px;
      background: ${colors.background}
      position: relative;
      &::after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        height: 200px;
        transform: translateX(-100%);
        background: linear-gradient(
          90deg,
          rgba(${colors.primaryRGB}, 0) 0%,
          rgb(${colors.primaryRGB}, 0.8) 40%,
          rgb(${colors.primaryRGB}, 0.8) 60%,
          rgba(${colors.primaryRGB}, 0) 100%
        );
        animation: ${shimmer} 2s infinite;
        content: "";
      }
    }
    &__details {
      padding: 1rem;
    }
    &__inner {
      background-color: ${colors.primary};
      height: 0.9rem;
      border-radius: 0.5rem;
      position: relative;
      &::after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgb(255, 255, 255, 0.8) 40%,
          rgb(255, 255, 255, 0.8) 60%,
          rgba(255, 255, 255, 0) 100%
        );
        animation: ${shimmer} 2s infinite;
        content: "";
      }
    }
    &__inner-2 {
      background-color: ${colors.primary};
      height: 0.8rem;
      border-radius: 0.5rem;
      width: 50%;
      margin-top: 0.5rem;
      position: relative;
      &::after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgb(255, 255, 255, 0.8) 40%,
          rgb(255, 255, 255, 0.8) 60%,
          rgba(255, 255, 255, 0) 100%
        );
        animation: ${shimmer} 2s infinite;
        content: "";
      }
    }
  }
`;
