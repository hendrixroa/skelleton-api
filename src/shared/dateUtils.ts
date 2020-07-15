export function formatDateToUSAFormat(date?: Date) {
  if (!date) {
    date = new Date();
  }
  const year = date.getFullYear();
  const month = [10, 11].includes(date.getUTCMonth())
    ? date.getUTCMonth()
    : `0${date.getUTCMonth() + 1}`;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  return `${month}-${day}-${year}`;
}

export function dateRange(start: Date, end: Date) {
  const arrDates: string[] = [];
  const datePivot = new Date(start);
  while (datePivot <= end) {
    arrDates.push(this.formatDatetoYYYYmmdd(new Date(datePivot)));
    datePivot.setDate(datePivot.getDate() + 1);
  }
  return arrDates;
}
