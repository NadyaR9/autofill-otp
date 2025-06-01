import styled from 'styled-components';
import { Flex } from 'antd';

export const OTPContainer = styled(Flex)`
  #otpCode {
    gap: 8px !important;
  }
  input {
    box-sizing: border-box;
    height: 58px;
    line-height: 58px;
    font-size: 18px;
    text-align: center;
    padding: 0;
    max-width: 66px;
    background: ${({ theme }) => theme.backgroundInput};
    border: 1px solid ${({ theme }) => theme.otpBorderColor};
    color: ${({ theme }) => theme.inputColor};
    font-weight: 400;
    border-radius: 12px;
    transition: box-shadow 0.2s ease;
    :focus,
    :hover {
      background: ${({ theme }) => theme.backgroundActiveInput} !important;
      border-color: ${({ theme }) => theme.colorActiveInput} !important;
      border-width: ${({ theme }) => theme.borderActiveWidth};
    }
  }

  @media (min-width: 300px) and (max-width: 498px) {
    input {
      width: 45px;
    }
  }

  input.is-focused {
    background: ${({ theme }) => theme.backgroundActiveInput} !important;
    box-shadow: 0 0 0 ${({ theme }) => theme.borderActiveWidth}
      ${({ theme }) => theme.colorActiveInput};
  }
`;
