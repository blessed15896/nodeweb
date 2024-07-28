import repository from "../data";
import { WebService } from "./http_adapter";
import { Result } from "../data/repository";
import * as jsonpatch from "fast-json-patch";

export class ResultWebService implements WebService<Result> {
  async modify(id: any, data: any): Promise<Result | undefined> {
    const dbData = await this.getOne(id);
    if (dbData !== undefined) {
      console.log("data =>", data);
      console.log("dbData =>", dbData);
      let result = jsonpatch.applyPatch(dbData, data).newDocument;
      console.log("result =>", result);
      return await this.replace(id, result);
    }
  }

  replace(id: any, data: any): Promise<Result | undefined> {
    const { name, age, years, nextage } = data;
    return repository.update({ id, name, age, years, nextage });
  }

  getOne(id: any): Promise<Result | undefined> {
    return repository.getResultById(Number.parseInt(id));
  }

  getMany(query: any): Promise<Result[]> {
    if (query.name) return repository.getResultsByName(query.name, 10);
    else return repository.getAllResults(10);
  }

  async store(data: any): Promise<Result | undefined> {
    const { name, age, years } = data;
    const nextage = Number.parseInt(age) + Number.parseInt(years);
    const id = await repository.saveResult({
      id: 0,
      name,
      age,
      years,
      nextage,
    });
    return await repository.getResultById(id);
  }

  delete(id: any): Promise<boolean> {
    return repository.delete(Number.parseInt(id));
  }
}
