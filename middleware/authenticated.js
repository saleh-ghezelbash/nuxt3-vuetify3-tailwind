export default defineNuxtRouteMiddleware(() => {
  const auth = useCookie("auth");
  if (auth.value) {
    return navigateTo("/");
  }
});
