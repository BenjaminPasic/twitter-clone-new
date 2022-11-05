import moment from "moment";

const dateFormat = (date) => {
  if (date === "now") {
    return date;
  }

  const currentDate = moment();
  const datePosted = moment(date);

  const dateDiffInSeconds = currentDate.diff(datePosted, "seconds");
  if (dateDiffInSeconds < 60) {
    return dateDiffInSeconds + "s";
  }

  const dateDiffInMinutes = currentDate.diff(datePosted, "minutes");
  if (dateDiffInMinutes < 60) {
    return dateDiffInMinutes + "m";
  }

  const dateDiffInHours = currentDate.diff(datePosted, "hours");
  if (dateDiffInHours < 60) {
    return dateDiffInHours + "h";
  }

  return datePosted.format("DD/MM/YYYY");
};

export default dateFormat;
