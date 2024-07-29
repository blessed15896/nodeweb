import type { Express } from "express";
import { AuthStore } from "./auth_types";
import { OrmAuthStore } from "./orm_authstore";
import jwt from "jsonwebtoken";

type User = { username: string };

declare module "express-session" {
  interface SessionData {
    username: string;
  }
}

declare global {
  module Express {
    interface Request {
      user: User;
      authenticated: boolean;
    }
  }
}

const jwtSecret = "mytokensecret";

const store: AuthStore = new OrmAuthStore();

export const createAuth = (app: Express) => {
  app.use((req, res, next) => {
    const username = req.session.username;
    if (username) {
      req.authenticated = true;
      req.user = { username };
    } else if (req.headers.authorization) {
      let token = req.headers.authorization;
      if (token.startsWith("Bearer ")) token = token.substring(7);
      try {
        const decoded = jwt.verify(token, jwtSecret) as User;
        req.authenticated = true;
        req.user = { username: decoded.username };
      } catch (err) {
        // do nothing - cannot verify token
      }
    } else req.authenticated = false;
    res.locals.user = req.user;
    res.locals.authenticated = req.authenticated;
    next();
  });

  app.get("/signin", (req, res) => {
    const data = {
      username: req.query["username"],
      password: req.query["password"],
      failed: req.query["failed"] ? true : false,
      signinpage: true,
    };
    res.render("signin", data);
  });

  app.post("/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const valid = await store.validateCredentials(username, password);
    if (valid) {
      req.session.username = username;
      res.redirect("/");
    } else
      res.redirect(
        `/signin?username=${username}&password=${password}&failed=1`
      );
  });

  app.post("/api/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const result: any = {
      success: await store.validateCredentials(username, password),
    };
    if (result.success)
      result.token = jwt.sign({ username }, jwtSecret, { expiresIn: "1hr" });
    res.json(result);
    res.end();
  });

  app.post("/signout", async (req, res) =>
    req.session.destroy(() => res.redirect("/"))
  );
};
