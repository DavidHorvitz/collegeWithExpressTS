import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize';
import { lecturerModel } from '../models/lecturerModel';

type LecturerSchemaModel = Model<lecturerModel>
export interface LecturerInterface {
    Schema: ModelStatic<LecturerSchemaModel>

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
        Schema: LecturerSchema

    }

}
export type LecturerTable = Awaited<ReturnType<typeof createTable>>;
