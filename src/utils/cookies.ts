export const clientCookies = {
  get: (name: string): string | undefined => {
    const cookies = document.cookie.split(";");
    const cookie = cookies.find((c) => c.trim().startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : undefined;
  },
  set: (name: string, value: string) => {
    const cookieValue = encodeURIComponent(value);
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    document.cookie = `${name}=${cookieValue}; path=/; secure; samesite=none; expires=${expires.toUTCString()}`;
  },
  remove: (name: string) => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },
};
