type Time = {
  hours: number;
  minutes: number;
  seconds: number;
};

export const convertSeconds = (totalSeconds: number): Time => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
};

export const formatTime = (time: Time): string => {
  const { hours, minutes, seconds } = time;

  const pad = (num: number) => String(num);

  let result = "";

  // giờ > 0 mới hiển thị
  if (hours > 0) {
    result += `${pad(hours)}h`;
  }

  // phút > 0 mới hiển thị
  if (minutes > 0) {
    result += `${pad(minutes)}p`;
  }

  // giây > 0 mới hiển thị
  if (seconds > 0) {
    result += `${pad(seconds)}s`;
  }

  return result;
};
