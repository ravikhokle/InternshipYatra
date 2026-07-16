import { format } from "date-fns";

export const safeFormatDate = (value, pattern = "dd MMM yyyy") => {
  if (value == null || value === "") return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  try {
    return format(date, pattern);
  } catch {
    return null;
  }
};
