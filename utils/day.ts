// TYPE
type FormatType = "date" | "time" | "datetime";

// FORMAT
export const formatLocalDateTime = (
  isoString: string,
  type: FormatType = "datetime",
) => {
  if (!isoString) return "";

  const date = new Date(isoString);

  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Ho_Chi_Minh", // fix timezone VN
  };

  switch (type) {
    case "date":
      Object.assign(options, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      break;

    case "time":
      Object.assign(options, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      break;

    case "datetime":
    default:
      Object.assign(options, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
      break;
  }

  return new Intl.DateTimeFormat("vi-VN", options).format(date);
};
