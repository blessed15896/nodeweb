import repository from "../data";
import { WebService } from "./http_adapter";
import { Result } from "../data/repository";

export class ResultWebService implements WebService<Result> {
  async modify(id: any, data: any): Promise<Result | undefined> {
    const dbData = await this.getOne(id);
    if (dbData !== undefined) {
      Object.entries(dbData).forEach(([prop, val]) => {
        (dbData as any)[prop] = data[prop] ?? val;
      });
      return await this.replace(id, dbData);
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
