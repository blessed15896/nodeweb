export interface Credentials {
  username: string;
  hashedPassword: Buffer;
  salt: Buffer;
}

export interface AuthStore {
  getUser(name: string): Promise<Credentials | null>;
  storeOrUpdateUser(username: string, password: string): Promise<Credentials>;
  validateCredentials(username: string, password: string): Promise<boolean>;
}
