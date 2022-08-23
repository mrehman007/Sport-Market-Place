export const getScore = (value, factor) => {
  let _score = 0;
  switch (value) {
    case 'diamond':
      _score = 1000 * factor;
      break;
    case 'platinum':
      _score = 800 * factor;
      break;
    case 'gold':
      _score = 600 * factor;
      break;
    case 'silver':
      _score = 400 * factor;
      break;
    case 'bronze':
      _score = 200 * factor;
      break;
    case 'vote':
      _score = 500;
      break;
    default:
      _score = 0;
      break;
  }
  return _score;
};

export const groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
