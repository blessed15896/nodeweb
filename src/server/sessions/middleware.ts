import { getCookie, setCookie } from "../cookies";
import { MemoryRepository } from "./memory_repository";
import { OrmRepository } from "./orm_repository";
import { SessionRepository } from "./repository";
import type { Request, Response, NextFunction } from "express";

const sessionCookieName = "custom_session";
const expirySeconds = 300;

const getExpiryDate = () => new Date(Date.now() + expirySeconds * 1_000);

export const CustomSessionMiddleware = () => {
  // const repo: SessionRepository = new MemoryRepository();
  const repo: SessionRepository = new OrmRepository();

  return async (req: Request, res: Response, next: NextFunction) => {
    const id = getCookie(req, sessionCookieName);
    const session =
      (id ? await repo.getSession(id) : undefined) ??
      (await repo.createSession());
    (req as any).session = session;
    setCookie(res, sessionCookieName, session.id, {
      maxAge: expirySeconds * 1000,
    });
    res.once("finish", async () => {
      if (Object.keys(session.data).length > 0) {
        if (req.method == "POST") {
          await repo.saveSession(session, getExpiryDate());
        } else {
          await repo.touchSession(session, getExpiryDate());
        }
      }
    });
    next();
  };
};
