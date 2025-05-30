import Cookies from "js-cookie";

export const clientCookies = {
  get: (name: string): string | undefined => {
    return Cookies.get(name);
  },
  set: (name: string, value: string, options?: Cookies.CookieAttributes) => {
    Cookies.set(name, value, {
      ...options,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
  },
  remove: (name: string, options?: Cookies.CookieAttributes) => {
    Cookies.remove(name, {
      ...options,
      path: "/",
    });
  },
};
