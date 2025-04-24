export const convertTimestampToDate = (timestamp) => {
  return timestamp?._seconds
    ? new Date(timestamp._seconds * 1000).toISOString().split("T")[0]
    : "";
};
