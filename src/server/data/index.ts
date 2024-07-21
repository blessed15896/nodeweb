import { Repository } from "./repository";
import { SqlRepository } from "./sqlRepository";

const repository: Repository = new SqlRepository();

export default repository;
