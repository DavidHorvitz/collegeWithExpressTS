import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize';
import { lecturerModel } from '../models/lecturerModel';

type LecturerSchemaModel = Model<lecturerModel>
export interface LecturerInterface {
    Schema: ModelStatic<LecturerSchemaModel>
    insert: (lecturer: Omit<lecturerModel, "id">) => Promise<lecturerModel>
    searchById: (id: string) => Promise<lecturerModel | undefined>
}

export async function createTable(sequelize: Sequelize): Promise<LecturerInterface> {
    const LecturerSchema = sequelize.define<LecturerSchemaModel>('lecturer', {
        Id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        Name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        Phone_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Email: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
        {
            schema:"college",
            createdAt: false,
        });

    await LecturerSchema.sync();
    return {
        Schema: LecturerSchema,
        async insert(lecturer) {
            const result = await LecturerSchema.create(lecturer as lecturerModel)
            return result.toJSON();
        },
        async searchById(id: string) {
            const result = await LecturerSchema.findByPk(id)
            return result?.toJSON();
        }

    }

}
export type LecturerTable = Awaited<ReturnType<typeof createTable>>;