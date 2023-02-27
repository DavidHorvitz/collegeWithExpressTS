
import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import * as AppModel from "../../model/mainModels"


type Course = Omit<AppModel.Course.Course, "ClassDates" | "Syllabus">
type CourseSchemaModel = Model<Course>

export interface CourseInterface {
    Schema: ModelStatic<CourseSchemaModel>
    insert: (course: Omit<Course, "Id">) => Promise<Course>
    delete: (courseId: string) => Promise<boolean>
    searchById: (id: string) => Promise<AppModel.Course.Course | undefined>
    searchByName: (course_name: string) => Promise<AppModel.Course.Course  | undefined>
    updateCourseByName: (course_name: string, updates: Partial<AppModel.Course.Course >) => Promise<AppModel.Course.Course  | undefined>
}

export async function createCourseTable(sequelize: Sequelize): Promise<CourseInterface> {
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
            type: DataTypes.DATE,
            allowNull: false
        },
        EndDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        MinimumPassingScore: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        MaximumStudents: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        IsReady: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        schema: "college",
        createdAt: false,
    })

    await CourseSchema.sync();

    return {
        Schema: CourseSchema,
        async insert(course) {
            const result = await CourseSchema.create(course as Course)
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
        async searchById(id: string) {
            const result = await CourseSchema.findByPk(id)
            return result?.toJSON();
        },
        async searchByName(course_name: string) {
            const result = await CourseSchema.findOne({
                where: { CourseName: course_name }
            })
            return result?.toJSON();
        },
        async updateCourseByName(course_name: string, updates: Partial<AppModel.Course.Course >) {
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
    }
}
