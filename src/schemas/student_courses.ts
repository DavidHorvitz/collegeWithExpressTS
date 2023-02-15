import {  Model, ModelStatic, Sequelize } from 'sequelize';
import { student_coursesModel } from '../models/student_coursesModel';
import { StudentInterface } from './student';
import { CourseInterface } from './course';

type Student_coursesModelSchemaModel = Model<student_coursesModel>

export interface Student_coursesInterface {
    Schema: ModelStatic<Student_coursesModelSchemaModel>
}

export async function createTable(sequelize: Sequelize, Student: StudentInterface["Schema"], Course: CourseInterface["Schema"]):
    Promise<Student_coursesInterface> {
    const Student_coursesSchema = sequelize.define<Student_coursesModelSchemaModel>('student_courses', {

    } as student_coursesModel,{
        schema:"college",
        createdAt: false

    });
    Student.belongsToMany(Course, { through: Student_coursesSchema });
    Course.belongsToMany(Student, { through: Student_coursesSchema });
    await Student_coursesSchema.sync();
    return {
        Schema: Student_coursesSchema

    }
}
export type Student_coursesTable = Awaited<ReturnType<typeof createTable>>;




