export const humanizeAddress = (address) => {
  address = address || '';
  return address.slice(0, 6) + '...' + address.slice(-4);
};
