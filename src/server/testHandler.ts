import type { Request, Response } from "express";

export const testHandler = async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.json(req.body);
  res.end();
};
