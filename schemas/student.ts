import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize';
import { studentModel } from '../models/studentModel';
type StudentSchemaModel = Model<studentModel>
export interface StudentInterface {
    Schema: ModelStatic<StudentSchemaModel>

}

export async function createTable(sequelize: Sequelize): Promise<StudentInterface> {
    const StudentSchema = sequelize.define<StudentSchemaModel>('student', {
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
            createdAt: false,
        });

    await StudentSchema.sync();
    return {
        Schema: StudentSchema

    }

}
export type StudentTable = Awaited<ReturnType<typeof createTable>>;
