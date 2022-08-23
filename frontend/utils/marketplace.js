export const hasListingExpired = (secondsUntilEnd) => {
  return parseInt(secondsUntilEnd?.toString()) > 0;
};
