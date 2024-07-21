import { IncomingMessage, ServerResponse } from "http";

const setHeaderName = "Set-Cookie";

export const setCookie = (res: ServerResponse, name: string, val: string) => {
  let cookieVal: any[] = [`${name}=${val}; Max-Age=300; SameSite=Strict`];
  if (res.hasHeader(setHeaderName)) {
    cookieVal.push(res.getHeader(setHeaderName));
  }
  res.setHeader(setHeaderName, cookieVal);
};

export const setJsonCookie = (res: ServerResponse, name: string, val: any) =>
  setCookie(res, name, JSON.stringify(val));

export const getCookie = (
  req: IncomingMessage,
  key: string
): string | undefined => {
  let result: string | undefined = undefined;
  req.headersDistinct["cookie"]?.forEach((header) => {
    header.split(";").forEach((cookie) => {
      const { name, val } = /^(?<name>.*)=(?<val>.*)$/.exec(cookie)
        ?.groups as any;
      if (name.trim() === key) {
        result = val;
      }
    });
  });
  return result;
};

export const getJsonCookie = (req: IncomingMessage, key: string): any => {
  const cookie = getCookie(req, key);
  return cookie ? JSON.parse(cookie) : undefined;
};
