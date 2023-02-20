import { Model, ModelStatic, Sequelize } from 'sequelize';
import { student_coursesModel } from '../models/student_coursesModel';
import { StudentInterface } from './student';
import { CourseInterface } from './course';

type Student_coursesModelSchemaModel = Model<student_coursesModel>

export interface Student_coursesInterface {
    Schema: ModelStatic<Student_coursesModelSchemaModel>
    getCourseWithItsUser: (Course_name: string) => Promise<string>
    addStudentToCourse :(studentId: string, courseId: string)=> Promise<void | undefined>

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
        },
        async addStudentToCourse(studentId: string, courseId: string) {
            const Course = sequelize.models.course;
            const Student = sequelize.models.student;

            const course = await Course.findByPk(courseId);
            if (!course) {
                throw new Error(`Course with ID ${courseId} not found`);
            }

            const student = await Student.findByPk(studentId);
            if (!student) {
                throw new Error(`Student with ID ${studentId} not found`);
            }

            await (course as any).addStudent(student);
        }


    }
}
export type Student_coursesTable = Awaited<ReturnType<typeof createTable>>;