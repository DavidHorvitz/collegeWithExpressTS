import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize';
import { studentModel } from '../models/studentModel';
type StudentSchemaModel = Model<studentModel>
export interface StudentInterface {
    Schema: ModelStatic<StudentSchemaModel>
    insert: (student: Omit<studentModel, "id">) => Promise<studentModel>
    searchById: (id: string) => Promise<studentModel | undefined>

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
            schema:"college",
            createdAt: false,
        });

    await StudentSchema.sync();
    return {
        Schema: StudentSchema,
        async insert(student) {
            const result = await StudentSchema.create(student as studentModel)
            return result.toJSON();
        },
        async searchById(id: string) {
            const result = await StudentSchema.findByPk(id)
            return result?.toJSON();
        }

    }

}
export type StudentTable = Awaited<ReturnType<typeof createTable>>;
