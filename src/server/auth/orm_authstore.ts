import { Sequelize } from "sequelize";
import { AuthStore, Credentials } from "./auth_types";
import { CredentialsModel, initializeAuthModels } from "./orm_auth_models";
import { pbkdf2, randomBytes, timingSafeEqual } from "crypto";

export class OrmAuthStore implements AuthStore {
  sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize({
      dialect: "sqlite",
      storage: "orm_auth.db",
      logging: console.log,
      logQueryParameters: true,
    });
    this.initModelAndDatabase();
  }

  async initModelAndDatabase(): Promise<void> {
    initializeAuthModels(this.sequelize);
    await this.sequelize.drop();
    await this.sequelize.sync();
    await this.storeOrUpdateUser("alice", "mysecret");
    await this.storeOrUpdateUser("bob", "mysecret");
  }

  async getUser(name: string): Promise<Credentials | null> {
    return await CredentialsModel.findByPk(name);
  }

  async storeOrUpdateUser(
    username: string,
    password: string
  ): Promise<Credentials> {
    const salt = randomBytes(16);
    const hashedPassword = await this.createHashCode(password, salt);
    const [model] = await CredentialsModel.upsert({
      username,
      hashedPassword,
      salt,
    });
    return model;
  }

  async validateCredentials(
    username: string,
    password: string
  ): Promise<boolean> {
    const storeCreds = await this.getUser(username);
    if (storeCreds) {
      const candidateHash = await this.createHashCode(
        password,
        storeCreds.salt
      );
      return timingSafeEqual(candidateHash, storeCreds.hashedPassword);
    }
    return false;
  }

  private createHashCode(password: string, salt: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      pbkdf2(password, salt, 100_000, 64, "sha512", (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
  }
}
