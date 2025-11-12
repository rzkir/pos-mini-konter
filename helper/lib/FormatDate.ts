type DateFormat = "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";

const DEFAULT_DATE_FORMAT: DateFormat = "DD/MM/YYYY";

/**
 * Format date with custom format
 * @param dateInput - The date to format
 * @param format - Date format (default: "DD/MM/YYYY")
 */
export function formatDate(
  dateInput: string | number | Date,
  format: DateFormat = DEFAULT_DATE_FORMAT
): string {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "-";

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();

  switch (format) {
    case "DD/MM/YYYY":
      return `${day}/${month}/${year}`;
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`;
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
    default:
      return `${day}/${month}/${year}`;
  }
}

/**
 * Format date with time using Intl.DateTimeFormat
 * @param dateInput - The date to format
 * @param format - Date format (default: "DD/MM/YYYY")
 * @param options - Intl.DateTimeFormatOptions for time formatting
 * @param locale - Locale (default: "id-ID")
 */
export function formatDateTime(
  dateInput: string | number | Date,
  format: DateFormat = DEFAULT_DATE_FORMAT,
  options?: Intl.DateTimeFormatOptions,
  locale: string = "id-ID"
): string {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "-";

  const dateStr = formatDate(dateInput, format);
  const timeOptions = options ?? {
    hour: "2-digit",
    minute: "2-digit",
  };

  const formatter = new Intl.DateTimeFormat(locale, timeOptions);
  const timeStr = formatter.format(date);

  return `${dateStr} ${timeStr}`;
}

/**
 * Format time only
 * @param dateInput - The date to format
 * @param options - Intl.DateTimeFormatOptions for time formatting
 * @param locale - Locale (default: "id-ID")
 */
export function formatTime(
  dateInput: string | number | Date,
  options?: Intl.DateTimeFormatOptions,
  locale: string = "id-ID"
): string {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "-";

  const formatter = new Intl.DateTimeFormat(
    locale,
    options ?? {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
  );

  return formatter.format(date);
}

export default formatDate;
