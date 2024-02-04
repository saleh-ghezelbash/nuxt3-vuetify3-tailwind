export default function () {
  const auth = useCookie("auth");
  if (auth.value) {
    return navigateTo("/login");
  }
}
