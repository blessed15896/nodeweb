import { OrmRepository } from "./orm_repository";
import { Repository } from "./repository";
import { SqlRepository } from "./sqlRepository";

// const repository: Repository = new SqlRepository();
const repository: Repository = new OrmRepository();

export default repository;
