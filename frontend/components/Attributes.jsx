import styled from 'styled-components';
import { useState, useRef } from 'react';
import Button from './Button';
import { toast } from 'react-toastify';
import { colors } from '../styles';

export default function Attributes({ attributes, setAttributes }) {
  const updateAttributes = (index, attribute) => {
    const newAttributes = [...attributes];
    newAttributes[index] = attribute;
    setAttributes(newAttributes);
  };

  return (
    <StyledAttributes>
      <div className="attr">
        <div className="attr__name">
          <p>Name</p>
        </div>
        <div className="attr__value">
          <p>Value</p>
        </div>
      </div>
      {attributes.map((d, index) => (
        <div className="attr" key={index}>
          <div className="attr__name">
            {index !== 0 && (
              <button
                type="button"
                onClick={() => {
                  const newAttributes = [...attributes];
                  newAttributes.splice(index, 1);
                  setAttributes(newAttributes);
                }}
              >
                X
              </button>
            )}
            <input
              type="text"
              placeholder="type"
              value={d.trait_type}
              onChange={(e) =>
                updateAttributes(index, {
                  ...d,
                  trait_type: e.target.value,
                })
              }
            />
          </div>
          <div className="attr__value">
            <input
              type="text"
              placeholder="diamond"
              value={d.value}
              onChange={(e) =>
                updateAttributes(index, {
                  ...d,
                  value: e.target.value,
                })
              }
            />
          </div>
        </div>
      ))}
      <Button
        onClick={() => {
          if (attributes.length < 5) {
            setAttributes([...attributes, { trait_type: '', value: '' }]);
          } else {
            toast.error('You can only have 5 attributes');
          }
        }}
      >
        Add More
      </Button>
    </StyledAttributes>
  );
}

const StyledAttributes = styled.div`
  * {
    box-sizing: border-box;
    margin: 0;
  }
  .attr {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.25rem;
    &__name {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      button {
        border: none;
        background: none;
        font-size: 1rem;
        font-weight: 700;
        color: #707a83;
        margin-top: 0.5rem;
        cursor: pointer;
        &:hover {
          color: #df3f3f;
        }
      }
    }
    &__value {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
  p {
    font-size: 1rem;
    font-weight: 600;
    margin-top: 0.5rem;
    color: inherit;
  }
  button {
    margin-top: 1rem;
  }
  input {
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
  }
`;
