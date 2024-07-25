const addZero = (time: number) => {
  return time < 10 ? "0" + time : time;
};

export const getFormattedTime = (date: number) => {
  const curDate = new Date(date);
  return `${addZero(curDate.getHours())}:${addZero(curDate.getMinutes())}`;
};
