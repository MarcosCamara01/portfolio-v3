const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Dates are authored as `Month DD, YYYY`; parse the parts so the output never
// depends on the server's time zone.
function parts(date: string) {
  const [, month, day, year] = date.match(/^(\w+)\s+(\d{1,2}),\s*(\d{4})$/) ?? [];
  const index = MONTHS.findIndex((m) => month?.startsWith(m));
  return { month: MONTHS[index] ?? month, day, year };
}

export const formatMonth = (date: string) => {
  const { month, year } = parts(date);
  return `${month} ${year}`;
};

export const formatDay = (date: string) => {
  const { month, day } = parts(date);
  return `${month} ${day}`;
};

export const isoDate = (date: string) => {
  const { month, day, year } = parts(date);
  const m = String(MONTHS.indexOf(month) + 1).padStart(2, '0');
  return `${year}-${m}-${String(day).padStart(2, '0')}`;
};

export const formatFull = (date: string) => {
  const { month, day, year } = parts(date);
  return `${month} ${day}, ${year}`;
};
