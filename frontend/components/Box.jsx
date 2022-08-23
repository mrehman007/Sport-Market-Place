import styled from "styled-components";
import { colors } from "../styles/colors";

export default function Box({ top, children, styles }) {
  return (
    <StyledBox style={styles}>
      <BoxTitle>{top}</BoxTitle>
      <BoxContent>{children}</BoxContent>
    </StyledBox>
  );
}

const StyledBox = styled.div`
  border-radius: 0.5rem;
  overflow: hidden;
  height: 100%;
  width: 100%;
  background: ${colors.background};
  border: 1px solid rgba(${colors.tertiaryRGB}, 0.25);
`;

const BoxTitle = styled.div`
  overflow: hidden;
`;

const BoxContent = styled.div`
  overflow: hidden;
`;
