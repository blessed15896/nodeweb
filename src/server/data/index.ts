import { OrmRepository } from "./orm_repository";
import { ApiRepository } from "./repository";

// const repository: Repository = new SqlRepository();
const repository: ApiRepository = new OrmRepository();

export default repository;
