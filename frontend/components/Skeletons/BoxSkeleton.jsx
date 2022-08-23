import styled, { keyframes } from "styled-components";
import { colors } from "../../styles/colors";

export default function BoxSkeleton() {
  return (
    <StyledBoxSkeleton>
      <p>Loading...</p>
    </StyledBoxSkeleton>
  );
}

const animation = keyframes`
    0% {
        opacity: 1.0;
    }
    50% {
        opacity: 0.5;
    }
    100% {
        opacity: 1.0;

    }
`;

const StyledBoxSkeleton = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${colors.background};
  z-index: 90;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    color: ${colors.secondary};
    font-size: 2rem;
    font-weight: 700;
    animation: ${animation} 2s infinite linear;
  }
`;
