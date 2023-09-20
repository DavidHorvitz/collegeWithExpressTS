import { Console } from "console";
import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import * as AppModel from "../../model/mainModels";
import { CourseInterface } from "./Course";

type SyllabusSchemaModel = Model<AppModel.Course.Syllabus>

export interface SyllabusInterface {
    Schema: ModelStatic<SyllabusSchemaModel>
    insert: (syllabus: Omit<AppModel.Course.Syllabus, "Id">) => Promise<AppModel.Course.Syllabus>
    delete: (syllabus: string) => Promise<boolean>
    addSyllabusToCourse: (syllabusId: string, courseId: string) => Promise<void | undefined>
    deleteSyllabusFromCourse: (syllabusId: string, courseId: string) => Promise<void | undefined>
    getAllSyllabuses: () => Promise<AppModel.Course.Syllabus[] | undefined>
    countSyllabuses: () => Promise<number>;



}

export async function createSyllabusTable(sequelize: Sequelize, Course: CourseInterface["Schema"]): Promise<SyllabusInterface> {
    const SyllabusSchema = sequelize.define<SyllabusSchemaModel>("Syllabus", {
        Id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        Title: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        Description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        References: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        CourseOutline: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        
    }, {
        schema: "college1",
        createdAt: false,
    })
    Course.hasMany(SyllabusSchema, { foreignKey: 'Course_id' });
    SyllabusSchema.belongsTo(Course, { foreignKey: 'Course_id' });
    await SyllabusSchema.sync();

    return {
        Schema: SyllabusSchema,
        async insert(syllabus) {
            const result = await SyllabusSchema.create(syllabus as AppModel.Course.Syllabus)
            return result.toJSON();
        },

        async delete(syllabusId) {
            const result = await SyllabusSchema.destroy({
                where: {
                    Id: syllabusId
                }
            })
            return result === 1;
        },
        async getAllSyllabuses(): Promise<AppModel.Course.Syllabus[] | undefined> {
            const results = await SyllabusSchema.findAll();
            if (results.length === 0) {
                return undefined;
            }
            const syllabuses: AppModel.Course.Syllabus[] = results.map((result: any) => ({
                Id: result.Id,
                Title: result.Title,
                Description: result.Description,
                References: result.References,
                CourseOutline:result.CourseOutline
            }));
            return syllabuses;
        },
        async countSyllabuses() {
            try {
                const count = await SyllabusSchema.count();
                return count;
            } catch (error) {
                console.error(error);
                return 0; // Return 0 in case of an error
            }
        },
        async addSyllabusToCourse(syllabusId: string, courseId: string) {

            const course = await Course.findByPk(courseId);
            const syllabus = await SyllabusSchema.findByPk(syllabusId);
            if (!course || !syllabus) {
                throw new Error('Course or syllabus not found');
            }
            await (course as any).addSyllabus(syllabus);

        },
        async deleteSyllabusFromCourse(syllabusId: string, courseId: string) {
            const course = await Course.findByPk(courseId);
            const syllabus = await SyllabusSchema.findByPk(syllabusId);

            if (!course || !syllabus) {
                throw new Error('Course or syllabus not found');
            }
            await (course as any).removeSyllabus(syllabus); // remove the syllabus from the course
        },

    }
}

