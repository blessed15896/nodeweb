import type { Express, Response } from "express";

export interface WebService<T> {
  getOne(id: any): Promise<T | undefined>;
  getMany(query: any): Promise<T[]>;
  store(data: any): Promise<T | undefined>;
  delete(id: any): Promise<boolean>;
  replace(id: any, data: any): Promise<T | undefined>;
  modify(id: any, data: any): Promise<T | undefined>;
}

export function createAdapter<T>(
  app: Express,
  ws: WebService<T>,
  baseUrl: string
) {
  app.get(baseUrl, async (req, res) => {
    try {
      res.json(await ws.getMany(req.query));
      res.end();
    } catch (err) {
      writeResponse(err, res);
    }
  });

  app.get(`${baseUrl}/:id`, async (req, res) => {
    try {
      const data = await ws.getOne(req.params.id);
      if (data == undefined) res.writeHead(404);
      else res.json(data);
    } catch (err) {
      writeResponse(err, res);
    }
    res.end();
  });

  app.post(baseUrl, async (req, res) => {
    try {
      const data = await ws.store(req.body);
      res.json(data);
      res.end();
    } catch (err) {
      writeResponse(err, res);
    }
  });

  app.delete(`${baseUrl}/:id`, async (req, res) => {
    try {
      res.json(await ws.delete(req.params.id));
      res.end();
    } catch (err) {
      writeResponse(err, res);
    }
  });

  app.put(`${baseUrl}/:id`, async (req, res) => {
    try {
      res.json(await ws.replace(req.params.id, req.body));
      res.end();
    } catch (err) {
      writeResponse(err, res);
    }
  });

  app.patch(`${baseUrl}/:id`, async (req, res) => {
    try {
      res.json(await ws.modify(req.params.id, req.body));
      res.json();
    } catch (err) {
      writeResponse(err, res);
    }
  });

  const writeResponse = (err: any, res: Response) => {
    console.error(err);
    res.writeHead(500);
    res.end();
  };
}
