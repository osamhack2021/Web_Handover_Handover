import humanizeDuration from "humanize-duration";

export const dateElapsed = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  return `${humanizeDuration(now - date, {
    language: "ko",
    largest: 1,
    spacer: "",
    round: true,
  })} 전`;
};

export const dateToString = (dateString) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString("ko-KR")} ${date.toLocaleTimeString("en-GB")}`;
};
