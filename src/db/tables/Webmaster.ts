import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import * as AppModel from "../../model/mainModels"

type WebmasterInterfaceSchemaModel = Model<AppModel.Webmaster.Webmaster>

export interface WebmasterInterface {
    Schema: ModelStatic<WebmasterInterfaceSchemaModel>
    insert: (webmaster: Omit<AppModel.Webmaster.Webmaster, "Id">) => Promise<AppModel.Webmaster.Webmaster>
    search: (id: string) => Promise<AppModel.Webmaster.Webmaster | undefined>
    getAllWebmaster: () => Promise<AppModel.Webmaster.Webmaster[] | undefined>
    delete: (webmasterId: string) => Promise<boolean>
    updateWebmasterById: (webmasterId: string, updates: Partial<AppModel.Webmaster.Webmaster>) => Promise<AppModel.Webmaster.Webmaster | undefined>

}

export async function createWebmasterTable(sequelize: Sequelize): Promise<WebmasterInterface> {
    const WebmasterSchema = sequelize.define<WebmasterInterfaceSchemaModel>("Webmaster", {
        Id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        Name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        PhoneNumber: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        Email: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        ImageProfile: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Password: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        schema: "college1",
        createdAt: false,
    })

    await WebmasterSchema.sync();

    return {
        Schema: WebmasterSchema,
        async insert(webmaster) {
            const result = await WebmasterSchema.create(webmaster as AppModel.Webmaster.Webmaster)
            return result.toJSON();
        },
        async search(id: string) {
            const result = await WebmasterSchema.findByPk(id)
            return result?.toJSON();
        },

        async getAllWebmaster(): Promise<AppModel.Webmaster.Webmaster[] | undefined> {
            const results = await WebmasterSchema.findAll();
            if (results.length === 0) {
                return undefined;
            }
            const webmasters: AppModel.Webmaster.Webmaster[] = results.map((result: any) => ({
                Id: result.Id,
                Name: result.Name,
                PhoneNumber: result.PhoneNumber,
                Email: result.Email,
                ImageProfile: result.ImageProfile,
                Password : result.Password
            }));
            return webmasters;
        },

        async delete(webmasterId) {
            const result = await WebmasterSchema.destroy({
                where: {
                    Id: webmasterId
                }
            })
            return result === 1;
        },
        async updateWebmasterById(webmasterId: string, updates: Partial<AppModel.Student.Student>) {
            try {
                const [rowsAffected, [updateWebmaster]] = await WebmasterSchema.update(updates, {
                    where: {
                        Id: webmasterId,
                    },
                    returning: true, // Return the updated record
                    //   plain: true, // Return only the updated record (without metadata)
                });
                if (rowsAffected > 0) {
                    return updateWebmaster.toJSON() as any
                } else {
                    return undefined;
                }
            } catch (error) {
                console.error(error);
                return undefined;
            }
        },
    };
}