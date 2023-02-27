import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import * as AppModel from "../../model/mainModels"
import { CourseInterface } from "./Course";
import { LecturerInterface } from "./Lecturer";
type ClassDateSchemaModel = Model<Omit<AppModel.Course.ClassDate, 'lecturerId'>>

export interface ClassDateInterface {
    Schema: ModelStatic<ClassDateSchemaModel>
    insert: (classDate_id: Omit<AppModel.Course.ClassDate, "Id">) => Promise<AppModel.Course.ClassDate>
    delete: (classDate_id: string) => Promise<boolean>
}

export async function createClassDateTable(sequelize: Sequelize,
    Course: CourseInterface["Schema"], Lecturer: LecturerInterface["Schema"]):
    Promise<ClassDateInterface> {
    const ClassDateSchema = sequelize.define<ClassDateSchemaModel>("ClassData", {
        Id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        StartHour: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        EndDate: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        RoomId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        EntryInSyllabus: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        schema: "college",
        createdAt: false,
    })
    Course.hasMany(ClassDateSchema, { foreignKey: 'Course_id' });
    ClassDateSchema.belongsTo(Course, { foreignKey: 'Course_id' });
    Lecturer.hasMany(ClassDateSchema, { foreignKey: 'Lecturer_id' });
    ClassDateSchema.belongsTo(Lecturer, { foreignKey: 'Lecturer_id' });
    await ClassDateSchema.sync();

    return {
        Schema: ClassDateSchema,
        async insert(classDate) {
            const result = await ClassDateSchema.create(classDate as AppModel.Course.ClassDate)
            return result.toJSON();
        },
        async delete(classDate_id) {
            const result = await ClassDateSchema.destroy({
                where: {
                    Id: classDate_id
                }
            })
            return result === 1;
        },
    };
}
