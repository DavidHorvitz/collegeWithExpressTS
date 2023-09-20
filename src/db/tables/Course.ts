
import { Op } from "sequelize";
import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import * as AppModel from "../../model/mainModels"
import { LecturerInterface } from "./Lecturer";


type Course = Omit<AppModel.Course.Course, "ClassDates" | "Syllabus">
type CourseSchemaModel = Model<Course>

export interface CourseInterface {
    Schema: ModelStatic<CourseSchemaModel>
    insert: (course: Partial<Course>) => Promise<Course>
    delete: (courseId: string) => Promise<boolean>
    getAllCourses: () => Promise<AppModel.Course.Course[] | undefined>
    searchByIdWithDetails: (id: string, details: string) => Promise<AppModel.Course.Course | undefined>
    searchByName: (course_name: string) => Promise<AppModel.Course.Course | undefined>
    getCourseById: (courseId: string) => Promise<AppModel.Course.Course | undefined>
    updateCourseById: (courseId: string, updates: Partial<AppModel.Course.Course>) => Promise<AppModel.Course.Course | undefined>
    updateCourseByName: (course_name: string, updates: Partial<AppModel.Course.Course>) => Promise<AppModel.Course.Course | undefined>
    getLecturerWithCurrentCourses: (lecturerId: string) => Promise<string>
    getLecturerWithBetweenDates: (lecturerId: string, startDate: Date, endDate: Date) => Promise<string | undefined>
    addCourseToLecturer: (lecturerId: string, courseId: string) => Promise<void | undefined>
    addLectureDataEntryToCourse: (courseId: string, updates: Pick<Course, "StartingDate" | "EndDate">) => Promise<AppModel.Course.Course | undefined>
    deleteLectureDataEntryFromCourse: (courseId: string, updates: Pick<Course, "StartingDate" | "EndDate">) => Promise<AppModel.Course.Course | undefined>
    countCourses: () => Promise<number>;

}

export async function createCourseTable(sequelize: Sequelize, Lecturer: LecturerInterface["Schema"]): Promise<CourseInterface> {
    const CourseSchema = sequelize.define<CourseSchemaModel>("Course", {
        Id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        CourseName: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        StartingDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        EndDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        MinimumPassingScore: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        MaximumStudents: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        Image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        IsReady: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    }, {
        schema: "college1",
        createdAt: false,
    })
    Lecturer.hasMany(CourseSchema, { foreignKey: 'LecturerId' });
    CourseSchema.belongsTo(Lecturer, { foreignKey: 'LecturerId' });
    await CourseSchema.sync();

    return {
        Schema: CourseSchema,
        async insert(course) {
            const result = await CourseSchema.create(course as AppModel.Course.Course)
            // const result = await CourseSchema.create(course as Course)
            return result.toJSON();
        },
        async delete(courseId) {
            const result = await CourseSchema.destroy({
                cascade: true,
                where: {
                    Id: courseId
                }
            })
            return result === 1;
        },
        async getAllCourses(): Promise<AppModel.Course.Course[] | undefined> {
            const results = await CourseSchema.findAll();
            if (results.length === 0) {
                return undefined;
            }
            const courses: AppModel.Course.Course[] = results.map((result: any) => ({
                Id: result.Id,
                CourseName: result.CourseName,
                StartingDate: result.StartingDate,
                EndDate: result.EndDate,
                MinimumPassingScore: result.MinimumPassingScore,
                MaximumStudents: result.MaximumStudents,
                Image: result.Image,
                IsReady: result.IsReady
            }));
            return courses;
        },
        // New method to count all rows in the "courses" table
        async countCourses() {
            try {
                const [result]:any = await sequelize.query('SELECT COUNT(*) FROM "college1"."Courses"');
                const count = parseInt(result[0].count, 10);
                return count;
            } catch (error) {
                console.error(error);
                return 0; // Return 0 in case of an error
            }
        },


        async searchByIdWithDetails(id: string, details: string | undefined) {
            const result = await CourseSchema.findByPk(id);

            if (!result) {
                console.log('Course not found');
                return undefined;
            }
            const data: any = result.toJSON();
            if (details === "full") {

                return data;
            }
            else if (details === "part") {
                return {
                    CourseName: data.CourseName,
                    StartingDate: data.StartingDate,
                    EndDate: data.EndDate
                };
            }
            else {
                return "Please pass a correct parameter in the http request"

            }

        },
        async updateCourseById(courseId: string, updates: Partial<AppModel.Course.Course>) {
            // console.log(updates);
            console.error(updates);

            try {
                const [rowsAffected, [updatedStudent]] = await CourseSchema.update(updates, {
                    where: {
                        Id: courseId,
                    },
                    returning: true, // Return the updated record
                    //   plain: true, // Return only the updated record (without metadata)
                });
                if (rowsAffected > 0) {
                    return updatedStudent.toJSON() as any
                } else {
                    return undefined;
                }
            } catch (error) {
                console.error(error);
                return undefined;
            }
        },

        async searchByName(course_name: string) {
            const result = await CourseSchema.findOne({
                where: { CourseName: course_name }
            })
            return result?.toJSON();
        },
        async getCourseById(courseId: string) {
            const result = await CourseSchema.findByPk(courseId)
            return result?.toJSON();
        },
        async updateCourseByName(course_name: string, updates: Partial<AppModel.Course.Course>) {
            try {
                const [rowsAffected, [updatedCourse]] = await CourseSchema.update(updates, {
                    where: {
                        CourseName: course_name,
                    },
                    returning: true, // Return the updated record
                    //   plain: true, // Return only the updated record (without metadata)
                });
                if (rowsAffected > 0) {
                    return updatedCourse.toJSON() as any
                } else {
                    return undefined;
                }
            } catch (error) {
                console.error(error);
                return undefined;
            }
        },

        async addLectureDataEntryToCourse(courseId, updates) {
            try {
                const [rowsAffected, [updatedCourse]] = await CourseSchema.update(updates, {
                    where: {
                        Id: courseId,
                    },
                    returning: true, // Return the updated record
                    //   plain: true, // Return only the updated record (without metadata)
                });
                if (rowsAffected > 0) {
                    return updatedCourse.toJSON() as any
                } else {
                    return undefined;
                }
            } catch (error) {
                console.error(error);
                return undefined;
            }
        },
        async deleteLectureDataEntryFromCourse(courseId, updates) {
            try {
                const { StartingDate, EndDate } = updates;
                console.log(`StartingDate${StartingDate} EndDate ${EndDate} in the Function before`);

                const [rowsAffected, [updatedCourse]] = await CourseSchema.update(
                    { StartingDate, EndDate },
                    {
                        where: { Id: courseId },
                        returning: true, // Return the updated record
                    }
                );
                console.log(`StartingDate${StartingDate} EndDate ${EndDate} in the Function after !!!!`);
                if (rowsAffected > 0) {
                    return updatedCourse.toJSON() as AppModel.Course.Course;
                } else {
                    return undefined;
                }
            } catch (error) {
                console.error(error);
                return undefined;
            }
        },
        async addCourseToLecturer(lecturerId: string, courseId: string) {

            const course = await CourseSchema.findByPk(courseId);
            if (!course) {
                throw new Error(`Course with ID ${courseId} not found`);
            }

            const lecturer = await Lecturer.findByPk(lecturerId);
            if (!lecturer) {
                throw new Error(`Student with ID ${lecturerId} not found`);
            }

            await (lecturer as any).addCourse(course);

        },
        async getLecturerWithCurrentCourses(lecturerId) {
            const today = new Date();
            const result = await Lecturer.findOne({
                where: {
                    Id: lecturerId,
                },
                attributes: ['Name', 'Id',],
                include: [
                    {
                        model: CourseSchema,
                        //     attributes: ['CourseName','StartingDate','EndDate',
                        // ''],

                        where: {
                            EndDate: { [Op.gte]: today },
                        }
                    },
                ]
            });
            if (!result) {
                throw new Error('Course not found');
            }
            const data: any = result.toJSON();
            return data;
        },
        async getLecturerWithBetweenDates(lecturerId, startDate, endDate) {
            const result = await Lecturer.findOne({
                where: {
                    Id: lecturerId,
                },
                attributes: ['Name', 'Id'],
                include: [
                    {
                        model: CourseSchema,
                        attributes: ['CourseName'],

                        where: {
                            StartingDate: { [Op.between]: [startDate, endDate] },
                            EndDate: { [Op.between]: [startDate, endDate] },
                        }
                    },
                ]
            });
            if (!result) {
                throw new Error('Course not found');
            }
            const data: any = result.toJSON();
            return data;
        },

    }
}
