export function formatTimeString(ms: number): string {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

export function formatDateString(timestamp: number): string {
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleDateString("en-GB").replace(/\//g, "-");
  return formattedDate;
}
