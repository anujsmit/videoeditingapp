export function openRoute(navigate, route) {
  if (navigate && route) {
    navigate(route);
  }
}

export function closeCurrentWindow(navigate, fallbackRoute = '/') {
  if (navigate) {
    if (fallbackRoute) {
      navigate(fallbackRoute);
    } else {
      navigate(-1);
    }
  }
}
