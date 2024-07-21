import type { Request } from "express";
import { Session } from "./repository";

export const getSession = (req: Request): Session => (req as any).session;

declare global {
  module Express {
    interface Request {
      session: Session;
    }
  }
}
