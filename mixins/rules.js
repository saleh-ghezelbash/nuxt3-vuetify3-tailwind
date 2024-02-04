import moment from "moment-jalaali";
export const rules = {
  methods: {
    hasValue(v, title) {
      if (v || v === false || v === 0) {
        return true;
      }
      return title + " نمی تواند خالی باشد!";
    },
    arrayHasItems(v, title) {
      if (v.length > 0) {
        return true;
      }
      return title + " نمی تواند خالی باشد!";
    },
    checkLessThan(value, target) {
      if (value <= target || !target) {
        return true;
      } else {
        return "حداقل نمی تواند از حداکثر بزرگتر باشد!";
      }
    },
    checkMoreThan(value, targetTitle, target) {
      if (value >= target || !target) {
        return `${targetTitle} نمی تواند بیشتر از ${target} باشد`;
      } else {
        return true;
      }
    },
    checkNegative(value) {
      if (value >= 0) {
        return true;
      } else {
        return "مقدار نمی تواند منفی باشد!";
      }
    },
    isDate(value) {
      if (value) {
        const DATE_PATTERN =
          /^14\d{2}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/;
        if (DATE_PATTERN.test(value)) {
          return true;
        }
        return "تاریخ وارد شده صحیح نیست!";
      }
      return true;
    },
    dateCheck(value, previous, next) {
      if (
        previous &&
        moment(value, "jYYYY/jmm/jDD").isBefore(
          moment(previous, "jYYYY/jmm/jDD"),
        )
      ) {
        return "تاریخ نمی تواند قبل از " + previous + " باشد!";
      } else if (
        next &&
        moment(value, "jYYYY/jmm/jDD").isAfter(moment(next, "jYYYY/jmm/jDD"))
      ) {
        return "تاریخ نمی تواند بعد از " + next + " باشد!";
      } else {
        return true;
      }
    },
    isTime(value) {
      if (value) {
        const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
        if (TIME_PATTERN.test(value)) {
          return true;
        }
        return "ساعت وارد شده صحیح نیست!";
      }
      return true;
    },
    timeCheck(value, previous, next) {
      if (next.length > 10) {
        if (
          previous &&
          moment(value, "jYYYY/jmm/jDDHH:mm").isBefore(
            moment(previous, "jYYYY/jmm/jDDHH:mm"),
          )
        ) {
          return "ساعت نمی تواند قبل از " + previous.slice(10, 16) + " باشد!";
        } else if (
          next &&
          moment(value, "jYYYY/jmm/jDDHH:mm").isAfter(
            moment(next, "jYYYY/jmm/jDDHH:mm"),
          )
        ) {
          return "ساعت نمی تواند بعد از " + next.slice(10, 16) + " باشد!";
        } else {
          return true;
        }
      }
      return true;
    },
    sleepCheck(v) {
      if (v && v.includes("-")) {
        return "خواب نمی تواند منفی باشد!";
      }
      return true;
    },
    beforeCurrentTime(v, currentTime) {
      if (
        v &&
        moment(v, "jYYYY-jMM-jDDTHH:mm").isAfter(
          moment(currentTime, "jYYYY-jMM-jDDTHH:mm"),
        )
      ) {
        return "ساعت خروج صحیح نیست!";
      }
      return true;
    },
  },
};
