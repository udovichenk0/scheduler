export const setCookie = (name: string, value: string | number | boolean) =>
  (document.cookie = `${name}=${value};path=/`)
