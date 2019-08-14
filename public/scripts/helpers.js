const getTimeSincePost = function(initialTime) {
  const timeInSeconds = (Date.now() - initialTime) / 1000;
  const timeInMinutes = timeInSeconds / 60;
  const timeInHours = timeInMinutes / 60;
  const timeInDays = timeInHours / 24;

  if (timeInSeconds < 60) {
    return `${Math.floor(timeInSeconds)} seconds ago`;
  } else if (timeInMinutes < 60) {
    return `${Math.floor(timeInMinutes)} minutes ago`;
  } else if (timeInHours < 24) {
    return `${Math.floor(timeInHours)} hours ago`;
  } else {
    return `${Math.floor(timeInDays)} days ago`;
  }
};