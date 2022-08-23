import React from 'react';
import styled from 'styled-components';
import { colors } from '../../styles';

// text, password, email, image
const Input = ({ type = 'text', ...rest }) => {
  return <StyledInput type={type} {...rest} />;
};

export default Input;

const StyledInput = styled.input`
  &[type='date'] {
    cursor: pointer;
  }

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
