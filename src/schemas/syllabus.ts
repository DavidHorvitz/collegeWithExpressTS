import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize';
import { syllabusModel } from '../models/syllabusModel';
import { CourseInterface } from './course';
type SyllabusSchemaModel = Model<syllabusModel>
export interface SyllabusInterface {
    Schema: ModelStatic<SyllabusSchemaModel>

}

export async function createTable(sequelize: Sequelize, Course: CourseInterface["Schema"]): Promise<SyllabusInterface> {
    const SyllabusSchema = sequelize.define<SyllabusSchemaModel>('syllabus', {
        Id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        Title: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        Description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        Reference: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    } as any, {
        schema:"college",
        createdAt: false,
    });
    Course.hasMany(SyllabusSchema, { foreignKey: 'Course_id' });
    SyllabusSchema.belongsTo(Course, { foreignKey: 'Course_id' });

    await SyllabusSchema.sync({force:true});
    return {
        Schema: SyllabusSchema

    }

}
export type SyllabusTable = Awaited<ReturnType<typeof createTable>>;