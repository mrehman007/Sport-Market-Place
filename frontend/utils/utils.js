/**
 * Gets a future date based on the secondsUntilFutureDate given
 * @param {secondsUntilFutureDate} secondsUntilFutureDate - seconds to from now to the future date
 * @returns Future date in format yyyy-MM-ddThh:mm:ss
 */
export const getFutureDate = (secondsUntilFutureDate) => {
  const futureDate = new Date(Date.now() + secondsUntilFutureDate * 1000); //  1 yearsInSeconds later year
  return `${futureDate.getFullYear()}-${appendLeadingZeroes(
    futureDate.getMonth() + 1
  )}-${futureDate.getDate()}T${futureDate.getHours()}:${futureDate.getMinutes()}:${futureDate.getSeconds()}`;
};

/**
 * Prepends leading zeros to a number n if it's less than 9 else returns the number as is
 * @param {n} n - number to prepend
 */
function appendLeadingZeroes(n) {
  if (n <= 9) {
    return "0" + n;
  }
  return n;
}
