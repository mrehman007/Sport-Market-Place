import styled from 'styled-components';
import { colors } from '../../styles';

const Label = ({ children, ...rest }) => {
  return (
    <StyledLabel {...rest}>
      <h4>{children}</h4>
    </StyledLabel>
  );
};

export default Label;

const StyledLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  h4 {
    font-size: 1rem;
    font-weight: 700;
    color: ${(props) => colors.secondary};
  }
`;
