import {
  DataTypes,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import { Credentials } from "./auth_types";

export class CredentialsModel
  extends Model<
    InferAttributes<CredentialsModel>,
    InferCreationAttributes<CredentialsModel>
  >
  implements Credentials
{
  declare username: string;
  declare hashedPassword: Buffer;
  declare salt: Buffer;
}

export class RoleModel extends Model<
  InferAttributes<RoleModel>,
  InferCreationAttributes<RoleModel>
> {
  declare name: string;
  declare CredentialsModels?: InferAttributes<CredentialsModel>[];
  declare setCredentialsModels: HasManySetAssociationsMixin<
    CredentialsModel,
    string
  >;
}

export const initializeAuthModels = (sequelize: Sequelize) => {
  CredentialsModel.init(
    {
      username: { type: DataTypes.STRING, primaryKey: true },
      hashedPassword: { type: DataTypes.BLOB },
      salt: { type: DataTypes.BLOB },
    },
    { sequelize }
  );
  RoleModel.init(
    {
      name: { type: DataTypes.STRING, primaryKey: true },
    },
    { sequelize }
  );
  const through = "RoleMembershipJunction";
  RoleModel.belongsToMany(CredentialsModel, {
    through,
    foreignKey: "name",
  });
  CredentialsModel.belongsToMany(RoleModel, {
    through,
    foreignKey: "username",
  });
};
