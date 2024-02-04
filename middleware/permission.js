import permissionsList from "~/globals/permissions-list";

export default () => {
  const route = useRoute();
  const auth = useCookie("auth");

  setTimeout(() => {
    // const CURRENT_ROUTE = app.router.history.current.path;
    // const USER_ROLE = app.$cookies.get("auth").user.role;
    const CURRENT_ROUTE = route.path;
    const USER_ROLE = auth.value.user.role;
    if (
      !permissionsList[CURRENT_ROUTE].includes(USER_ROLE) &&
      USER_ROLE !== "admin" &&
      CURRENT_ROUTE !== "/"
    ) {
      navigateTo("/");
    }
  }, 50);
};
