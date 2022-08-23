import styled from 'styled-components';
import { colors } from '../../styles';

const Select = ({ id, name, children }) => {
  return (
    <StyledSelect id={id} name={name}>
      {children}
    </StyledSelect>
  );
};

export default Select;

export const Option = ({ value, children }) => {
  return <StyledOption value={value}>{children}</StyledOption>;
};

const StyledSelect = styled.select`
  width: 100%;
  padding: 15px 30px !important;
  margin: 4px 0 10px !important;
  display: inline-block;
  // border: none;
  box-sizing: border-box;
  border-radius: 5px;
  background-color: ${colors.background};
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    box-shadow: 0 0 0 0.25rem rgb(13 110 253 / 25%);
  }

  &:focus-visible {
    outline: none;
  }
`;

const StyledOption = styled.option`
  padding: 15px 30px;
`;
