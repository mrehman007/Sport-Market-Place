import styled from 'styled-components';
import { colors } from '../styles';

const FormCard = ({ children }) => {
  return <StyledFormCard>{children}</StyledFormCard>;
};

export default FormCard;

const StyledFormCard = styled.div`
  background-color: ${colors.background};
  padding: 1rem;
  color: #fff;
  border-radius: 0.5rem;
  border: 1px solid ${colors.secondary}80;
  transition: all 0.3s ease;
`;
