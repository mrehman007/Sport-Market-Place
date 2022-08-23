import styled from 'styled-components';
import { colors } from '../../styles';

const TextArea = ({ children, ...rest }) => {
  return <StyledTextArea {...rest}>{children}</StyledTextArea>;
};

export default TextArea;

const StyledTextArea = styled.textarea`
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0.8rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 400;
  color: ${(props) => colors.secondary};
  &:focus {
    outline: none;
    border: 1px solid ${(props) => colors.primary};
  }
`;
