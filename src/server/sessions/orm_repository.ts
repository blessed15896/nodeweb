import { Op, Sequelize, where } from "sequelize";
import { Session, SessionRepository } from "./repository";
import { initializeModel, SessionModel } from "./orm_models";
import { randomUUID } from "crypto";

export class OrmRepository implements SessionRepository {
  sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize({
      dialect: "sqlite",
      storage: "orm_sessions.db",
      logging: console.log,
      logQueryParameters: true,
    });
    this.initModelAndDatabase();
  }

  async initModelAndDatabase(): Promise<void> {
    initializeModel(this.sequelize);
    await this.sequelize.drop();
    await this.sequelize.sync();
  }

  async createSession(): Promise<Session> {
    return { id: randomUUID(), data: {} };
  }

  async getSession(id: string): Promise<Session | undefined> {
    const dbSession = await SessionModel.findOne({
      where: { id, expires: { [Op.gt]: new Date(Date.now()) } },
    });
    if (dbSession) return { id, data: dbSession.data };
  }

  async saveSession(session: Session, expires: Date): Promise<void> {
    await SessionModel.upsert({ id: session.id, data: session.data, expires });
  }

  async touchSession(session: Session, expires: Date): Promise<void> {
    await SessionModel.update({ expires }, { where: { id: session.id } });
  }
}
