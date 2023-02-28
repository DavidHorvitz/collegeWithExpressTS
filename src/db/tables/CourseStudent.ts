import { Model, ModelStatic, Sequelize } from 'sequelize';
import * as AppModel from "../../model/mainModels"
import { CourseInterface } from "./Course";
import { StudentInterface } from './Student';
import { Op } from 'sequelize';

type CourseStudentModelSchemaModel = Model<AppModel.CourseStudent.course_student>

export interface CourseStudentInterface {
    Schema: ModelStatic<CourseStudentModelSchemaModel>
    getCourseWithHimStudents: (courseId: string) => Promise<string>
    getStudentWithHimCourses: (studentId: string) => Promise<string>
    getStudentWithHimCoursesWhereTimeBetween: (studentId: string) => Promise<string>
    addStudentToCourse: (studentId: string, courseId: string) => Promise<void | undefined>
    // addStudentToCourseIfNotRegisterToAnotherCourseAtSameDate: (studentId: string, courseId: string) => Promise<void | undefined>

}

export async function createCourseStudentTable(sequelize: Sequelize, Student: StudentInterface["Schema"], Course: CourseInterface["Schema"]):
    Promise<CourseStudentInterface> {
    const Course_StudentSchema = sequelize.define<CourseStudentModelSchemaModel>('Course_Student', {

    } as AppModel.CourseStudent.course_student, {
        schema: "college",
        createdAt: false

    });
    Student.belongsToMany(Course, { through: Course_StudentSchema });
    Course.belongsToMany(Student, { through: Course_StudentSchema });
    await Course_StudentSchema.sync();
    return {
        Schema: Course_StudentSchema,
        async getCourseWithHimStudents(courseId) {
            const result = await Course.findOne({
                where: {
                    Id: courseId,
                },
                attributes: ['Course_name', 'Starting_date', 'End_date'],
                include: [
                    {
                        model: Student,
                        attributes: ['Name', 'Phone_number', 'Email'],
                        through: {
                            attributes: [],
                        }
                    }
                ]
            });
            if (!result) {
                throw new Error('Course not found');
            }
            const data: any = result.toJSON();
            return data;
        },
        async getStudentWithHimCoursesWhereTimeBetween(studentId) {
            const result = await Student.findOne({
                where: {
                    Id: studentId,
                },
                attributes: ['Name', 'Phone_number', 'Email'],
                include: [
                    {
                        model: Course,
                        attributes: ['Course_name', 'Starting_date', 'End_date'],
                        through: {
                            attributes: [],
                        },
                        where: {
                            StartingDate: { [Op.between]: ['2023-01-01 02:00:00+02', '2023-05-01 03:00:00+03'] },
                            EndDate: { [Op.between]: ['2023-01-01 02:00:00+02', '2023-05-01 03:00:00+03'] },
                        }
                    }
                ]
            });
            if (!result) {
                throw new Error(' not found student or course');
            }
            const data: any = result.toJSON();
            return data;
        },
        async getStudentWithHimCourses(studentId) {
            const result = await Student.findOne({
                where: {
                    Id: studentId,
                },
                attributes: ['Name', 'Phone_number', 'Email'],
                include: [
                    {
                        model: Course,
                        attributes: ['Course_name', 'Starting_date', 'End_date'],
                        through: {
                            attributes: [],
                        },
                    }
                ]
            });
            if (!result) {
                throw new Error(' not found student or course');
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

        },
        // async addStudentToCourseIfNotRegisterToAnotherCourseAtSameDate(studentId: string, courseId: string) {
        //     const Course = sequelize.models.course;
        //     const Student = sequelize.models.student;

        //     const course = await Course.findByPk(courseId);
        //     if (!course) {
        //         throw new Error(`Course with ID ${courseId} not found`);
        //     }

        //     const student: any = await Student.findByPk(studentId);
        //     if (!student) {
        //         throw new Error(`Student with ID ${studentId} not found`);
        //     }

        //     // Find all the courses that the student is currently registered for
        //     const registeredCourses = await student.getStudentWithHimCourses()

        //     // Check if any of those courses overlap with the start and end dates of the new course
        //     // const overlaps = registeredCourses.some((registeredCourse: { Starting_date: string | number | Date; End_date: string | number | Date; }) => {
        //     const overlaps = registeredCourses.some(registeredCourse => {
        //         const registeredCourseStart = new Date(registeredCourse.Starting_date).getTime();
        //         const registeredCourseEnd = new Date(registeredCourse.End_date).getTime();
        //         const newCourseStart = new Date((course as any).Starting_date).getTime();
        //         const newCourseEnd = new Date((course as any).End_date).getTime();

        //         return (
        //             newCourseStart < registeredCourseEnd &&
        //             newCourseEnd > registeredCourseStart
        //         );
        //     });

        //     if (overlaps) {
        //         throw new Error(`Student is already registered for another course on the same date`);
        //     }

        //     await (course as any).addStudent(student);
        // }

    }
}
export type Student_coursesTable = Awaited<ReturnType<typeof createCourseStudentTable>>;