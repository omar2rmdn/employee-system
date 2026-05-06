function startOfDay(value: Date) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Africa/Cairo",
  }).format(date);
}

function timeToMinutes(value: string) {
  const match = value.match(/^(\d{2}):(\d{2}) (AM|PM)$/);

  if (!match) {
    return null;
  }

  const [, hourPart, minutePart, meridiem] = match;
  let hours = Number(hourPart) % 12;
  const minutes = Number(minutePart);

  if (meridiem === "PM") {
    hours += 12;
  }

  return hours * 60 + minutes;
}

function getDayType(checkIn: string, checkOut: string) {
  const checkInMinutes = timeToMinutes(checkIn);
  const checkOutMinutes = timeToMinutes(checkOut);

  if (checkInMinutes == null || checkOutMinutes == null) {
    return null;
  }

  const duration = checkOutMinutes - checkInMinutes;
  return duration >= 8 * 60 ? "FULL" : "HALF";
}

function getMonthLabel(month: number) {
  return new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    new Date(2000, month - 1, 1),
  );
}

function getPayslipPeriodLabel(month: number, year: number) {
  return `${getMonthLabel(month)} ${year}`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value || 0);
}

export {
  startOfDay,
  formatTime,
  timeToMinutes,
  getDayType,
  getMonthLabel,
  getPayslipPeriodLabel,
  formatCurrency,
};
