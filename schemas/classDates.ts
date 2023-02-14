import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize';
import { classDatesModel } from '../models/classDatesModel';
import { CourseInterface } from './course';
import { LecturerInterface } from './lecturer';


type ClassDatesSchemaModel = Model<classDatesModel>
export interface ClassDatesInterface {
    Schema: ModelStatic<ClassDatesSchemaModel>

}

export async function createTable(sequelize: Sequelize, Course: CourseInterface["Schema"], lecturer: LecturerInterface["Schema"]): Promise<ClassDatesInterface> {
    const ClassDatesSchema = sequelize.define<ClassDatesSchemaModel>('classDates', {
        Id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        Date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        Start_hour: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        End_hour: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        Room_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Entry_in_syllabus: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

    } as any, {
        createdAt: false,
    });
    Course.hasMany(ClassDatesSchema, { foreignKey: 'Course_id' });
    ClassDatesSchema.belongsTo(Course, { foreignKey: 'Course_id' });
    lecturer.hasMany(ClassDatesSchema, { foreignKey: 'Lecturer_id' });
    ClassDatesSchema.belongsTo(lecturer, { foreignKey: 'Lecturer_id' });
    await ClassDatesSchema.sync();
    return {
        Schema: ClassDatesSchema

    }

}
export type ClassDatesTable = Awaited<ReturnType<typeof createTable>>;