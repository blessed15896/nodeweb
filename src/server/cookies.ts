import type { CookieOptions, Response, Request } from "express";

export const setCookie = (
  res: Response,
  name: string,
  val: string,
  opts?: CookieOptions
) => {
  res.cookie(name, val, {
    maxAge: 300 * 1000,
    sameSite: "strict",
    signed: true,
    ...opts,
  });
};

export const setJsonCookie = (res: Response, name: string, val: any) =>
  setCookie(res, name, JSON.stringify(val));

export const getCookie = (req: Request, key: string): string | undefined =>
  req.signedCookies[key];

export const getJsonCookie = (req: Request, key: string): any => {
  const cookie = getCookie(req, key);
  return cookie ? JSON.parse(cookie) : undefined;
};
