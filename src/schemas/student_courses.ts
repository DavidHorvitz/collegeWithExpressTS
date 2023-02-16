import { Model, ModelStatic, Sequelize } from 'sequelize';
import { student_coursesModel } from '../models/student_coursesModel';
import { StudentInterface } from './student';
import { CourseInterface } from './course';

type Student_coursesModelSchemaModel = Model<student_coursesModel>

export interface Student_coursesInterface {
    Schema: ModelStatic<Student_coursesModelSchemaModel>
    getCourseWithItsUser: (Course_name: string) => Promise<string>

}

export async function createTable(sequelize: Sequelize, Student: StudentInterface["Schema"], Course: CourseInterface["Schema"]):
    Promise<Student_coursesInterface> {
    const Student_coursesSchema = sequelize.define<Student_coursesModelSchemaModel>('student_courses', {

    } as student_coursesModel, {
        schema: "college",
        createdAt: false

    });
    Student.belongsToMany(Course, { through: Student_coursesSchema });
    Course.belongsToMany(Student, { through: Student_coursesSchema });
    await Student_coursesSchema.sync();
    return {
        Schema: Student_coursesSchema,
        async getCourseWithItsUser(Course_name: any) {
            const result = await Course.findOne({
                where: {
                    Course_name: Course_name,
                },
                attributes: ['ProductName', 'ProductNumber'],
                include: [
                    {
                        model: Student,
                        attributes: ['Id', 'FirstName', 'LastName'],
                        through: {
                            attributes: [],
                        }
                    }
                ]
            });
            if (!result) {
                throw new Error('User not found');
            }
            const data: any = result.toJSON();
            return data;
        }


    }
}
export type Student_coursesTable = Awaited<ReturnType<typeof createTable>>;



