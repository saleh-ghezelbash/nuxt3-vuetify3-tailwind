import moment from "moment-jalaali";

export default {
  timeDifference(start, end) {
    const DIFF = moment(start, "jYYYY/jMM/jDDThh:mm:ss").diff(
      moment(end, "jYYYY/jMM/jDDThh:mm:ss"),
      true,
    );
    const MINUTES_DIFF = moment.duration(DIFF).asMinutes();
    const HOURS =
      Math.floor(MINUTES_DIFF / 60) < 10
        ? "0" + Math.floor(MINUTES_DIFF / 60)
        : Math.floor(MINUTES_DIFF / 60);
    const MINUTES =
      MINUTES_DIFF % 60 < 10 ? "0" + (MINUTES_DIFF % 60) : MINUTES_DIFF % 60;
    return HOURS + ":" + MINUTES;
  },
  timeMask(value) {
    const hours = [/[0-2]/, value.charAt(0) === "2" ? /[0-3]/ : /[0-9]/];
    const minutes = [/[0-5]/, /[0-9]/];
    return value.length > 2 ? [...hours, ":", ...minutes] : hours;
  },
  timeRangeMask(value) {
    if (value) {
      const numbers = value.replace(/[^0-9]/g, "");
      if (numbers.length > 4) {
        return [...this.timeMask(numbers.substring(0, 4))];
      }
      return [...this.timeMask(numbers)];
    }
    return [];
  },
  today() {
    moment.loadPersian({ usePersianDigits: false });
    return moment().format("jYYYY/jMM/jDD");
  },
  currentTime() {
    moment.loadPersian({ usePersianDigits: false });
    return moment().format("HH:mm");
  },
  baseUrl() {
    return "http://localhost:8000/";
    // return 'http://172.23.10.244/'
  },
  getTankerNumber($axios, plaque) {
    return new Promise((resolve) => {
      if (plaque) {
        $axios
          .get("/api/tankerNumber", {
            params: {
              plaque,
            },
          })
          .then((res) => {
            resolve(res.data);
          });
      }
    });
  },
  getCurrentTime() {
    const { $axios } = useNuxtApp();
    return new Promise((resolve) => {
      $axios.get("/api/currentTime").then((res) => {
        resolve(moment(res.data));
      });
    });
  },
  calculateDeepDate(date, time) {
    moment.loadPersian({ usePersianDigits: false });
    let result = date;
    if (moment(time, "hh:mm a").isBefore(moment("07:01", "hh:mm a"))) {
      result = moment(date, "jYYYY/jMM/jDD")
        .subtract(1, "days")
        .format("jYYYY/jMM/jDD");
    }
    return result;
  },
};
