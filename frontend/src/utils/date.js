export const timeAgo = (date) => {
  const now = new Date();
  const sessionDate = new Date(date);
  const differenceInTime = now - sessionDate;
  const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

  if (differenceInDays === 0) {
    return "Today";
  } else if (differenceInDays === 1) {
    return "1 day ago";
  } else {
    return `${differenceInDays} days ago`;
  }
};
