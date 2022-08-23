let random = 5;
export const colors = {
  primary:
    random === 0
      ? '#2081E2'
      : random === 1
      ? '#219F94'
      : random === 2
      ? '#F1935C'
      : random === 3
      ? '#632626'
      : '#1572A1',
  secondary: '#30475E',
  tertiary: '#4C4C6D',
  quaternary: '#BEDCFA',
  background: '#FFFFFF',
  primaryRGB:
    random === 0
      ? '32, 129, 226'
      : random === 1
      ? '33, 159, 148'
      : random === 2
      ? '241, 147, 92'
      : random === 3
      ? '99, 38, 38'
      : '21, 114, 161',
  secondaryRGB: '48, 71, 94',
  tertiaryRGB: '76, 76, 109',
  iconBar: '#000',
};
