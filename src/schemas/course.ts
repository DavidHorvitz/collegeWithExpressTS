import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize';
import { courseModel } from '../models/courseModel';
type CourseSchemaModel = Model<courseModel>
export interface CourseInterface {
    Schema: ModelStatic<CourseSchemaModel>
    insert: (course: Omit<courseModel, "id">) => Promise<courseModel>
    searchById: (id: string) => Promise<courseModel | undefined>
    searchByName: (course_name: string) => Promise<courseModel | undefined>
    updateCourseByName: (course_name: string, updates: Partial<courseModel>) => Promise<courseModel | undefined>

}

export async function createTable(sequelize: Sequelize): Promise<CourseInterface> {
    const CourseSchema = sequelize.define<CourseSchemaModel>('course', {
        Id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        Course_name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        Starting_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        End_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        Minimum_pass_score: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Maximum_students: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Is_ready: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    },
        {
            schema: "college",
            createdAt: false,
        });

    await CourseSchema.sync();
    return {
        Schema: CourseSchema,
        async insert(course) {
            const result = await CourseSchema.create(course as courseModel)
            return result.toJSON();
        },
        async searchById(id: string) {
            const result = await CourseSchema.findByPk(id)
            return result?.toJSON();
        },
        async searchByName(course_name: string) {
            const result = await CourseSchema.findOne({
                where: { Course_name: course_name }
            })
            return result?.toJSON();
        },
        async updateCourseByName(course_name: string, updates: Partial<courseModel>) {
            try {
                let [rowsAffected, [updatedCourse]] = await CourseSchema.update(updates, {
                    where: {
                        Course_name: course_name,
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
        }
    };

}
export type CourseTable = Awaited<ReturnType<typeof createTable>>;
