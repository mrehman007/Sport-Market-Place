function getWeekNumber(d) {
  d = new Date(+d);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  var yearStart = new Date(d.getFullYear(), 0, 1);
  var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return [d.getFullYear(), weekNo];
}

export function weeksInYear(year) {
  var d = new Date(year, 11, 31);
  var week = getWeekNumber(d)[1];
  return week == 1 ? 52 : week;
}
