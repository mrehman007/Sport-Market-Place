import styled from "styled-components";
import { colors } from "../styles/colors";

export default function Button({ primary, type, children, ...rest }) {
  return (
    <StyledButton type={type ? type : "button"} primary={primary} {...rest}>
      {children}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  background: ${(props) => (props.primary ? colors.primary : "transparent")};
  color: ${(props) => (props.primary ? "#ffffff" : colors.primary)};
  padding: 0.8rem 2rem;
  border: 2px solid ${colors.primary};
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0 20px 25px -5px rgba(${colors.tertiaryRGB}, 0.1),
      0 10px 10px -5px rgba(${colors.tertiaryRGB}, 0.04);
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    
  }
`;
