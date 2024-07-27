import type { Request } from "express";
import type { SessionData } from "express-session";
import session from "express-session";
import sessionStore from "connect-session-sequelize";
import { Result } from "../data/repository";
import { Sequelize } from "sequelize";

declare module "express-session" {
  interface SessionData {
    personalHistory: Result[];
  }
}

export const getSession = (req: Request): SessionData => (req as any).session;

export const sessionMiddleware = () => {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "pkg_sessions.db",
  });
  const store = new (sessionStore(session.Store))({
    db: sequelize,
  });
  store.sync();
  return session({
    secret: "mysecret",
    store,
    cookie: { maxAge: 300 * 1000, sameSite: "strict" },
    resave: false,
    saveUninitialized: false,
  });
};
