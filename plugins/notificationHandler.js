export default defineNuxtPlugin(() => {
  const translateError = (error) => {
    switch (error.response.status) {
      case 401:
        return "نام کاربری یا رمز عبور اشتباه می باشد!";
      case 404:
        return "اطلاعات یافت نشد!";
      case "ERR_NETWORK":
        return "خطای شبکه";
      case "ERR_BAD_RESPONSE":
        return "خطای سمت سرور؛ لطفاً دقایقی بعد سعی کنید!";
      default:
        return "خطای سیستمی؛ لطفاً به پشتیبانی اطلاع دهید!";
    }
  };

  return {
    provide: {
      notificationHandler: translateError,
    },
  };
});
