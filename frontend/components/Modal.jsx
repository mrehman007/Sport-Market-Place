import styled from 'styled-components';
import { MdClose } from 'react-icons/md';
import { colors } from '../styles/colors';

export default function Modal({ children, onClose }) {
  return (
    <StyledModal>
      <div className="modal-c">
        <button onClick={onClose} className="close">
          <MdClose className="close__icon" />
        </button>
        {children}
      </div>
    </StyledModal>
  );
}

const StyledModal = styled.div`
  * {
    margin: 0;
    box-sizing: border-box;
  }
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  z-index: 99;
  .modal-c {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: ${colors.background};
    border-radius: 0.5rem;
    padding: 2rem;
    width: calc(100% - 2rem);
    max-width: 768px;
    max-height: calc(100% - 2rem);
    overflow: auto;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
    border: 1px solid ${colors.secondary};
    z-index: 100;
    &__status {
      padding: 0.8rem 1rem;
      background: #e6e6e6;
      margin-top: 1rem;
      border-radius: 0.5rem;
      font-weight: 600;
    }
    h3 {
      font-size: 1.2rem;
      font-weight: 700;
    }
    input {
      display: block;
      width: 100%;
      border: none;
      border-radius: 0.5rem;
      padding: 1rem;
      font-size: 1rem;
      font-weight: 600;
      color: ${colors.secondary};
      background: ${colors.background};
      border: 1px solid ${colors.secondary};
      &::placeholder {
        color: ${colors.secondary};
      }
    }
    .close {
      position: absolute;
      top: 1.2rem;
      right: 2rem;
      font-size: 2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 0;
      background: transparent;
      color: ${colors.secondary};
      border: none;
      &__icon {
        transition: all 0.3s ease;
        transform: rotateZ(0deg);
      }
      &:hover {
        .close__icon {
          transform: rotateZ(90deg);
        }
      }
    }
  }
`;
