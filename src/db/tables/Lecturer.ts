import { Op } from "sequelize";
import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import * as AppModel from "../../model/mainModels"

type LecturerSchemaModel = Model<AppModel.Lecturer.Lecturer>

export interface LecturerInterface {
    Schema: ModelStatic<LecturerSchemaModel>
    insert: (lecturer: Omit<AppModel.Lecturer.Lecturer, "Id">) => Promise<AppModel.Lecturer.Lecturer>
    searchById: (id: string) => Promise<AppModel.Lecturer.Lecturer | undefined>
    delete: (lecturerId: string) => Promise<boolean>
    updateLecturerById: (lecturerId: string, updates: Partial<AppModel.Lecturer.Lecturer>) => Promise<AppModel.Lecturer.Lecturer | undefined>
    getAllLecturers: () => Promise<AppModel.Lecturer.Lecturer[] | undefined>




}

export async function createLecturerTable(sequelize: Sequelize): Promise<LecturerInterface> {
    const LecturerSchema = sequelize.define<LecturerSchemaModel>("Lecturer", {
        Id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        Name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        PhoneNumber: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        Email: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        schema: "college",
        createdAt: false,
    })

    await LecturerSchema.sync();

    return {
        Schema: LecturerSchema,
        async insert(lecturer) {
            const result = await LecturerSchema.create(lecturer as AppModel.Lecturer.Lecturer)
            return result.toJSON();
        },
        async searchById(id: string) {
            const result = await LecturerSchema.findByPk(id)
            return result?.toJSON();
        },
        async delete(lecturerId) {
            const result = await LecturerSchema.destroy({
                where: {
                    Id: lecturerId
                }
            })
            return result === 1;
        },
        async getAllLecturers(): Promise<AppModel.Lecturer.Lecturer[] | undefined> {
            const results = await LecturerSchema.findAll();
            if (results.length === 0) {
                return undefined;
            }
            const lectures: AppModel.Lecturer.Lecturer[] = results.map((result: any) => ({
                Id: result.Id,
                Name: result.Name,
                PhoneNumber: result.PhoneNumber,
                Email: result.Email,
            }));
            return lectures;
        },
        async updateLecturerById(lecturerId: string, updates: Partial<AppModel.Lecturer.Lecturer>) {
            try {
                const [rowsAffected, [updatedStudent]] = await LecturerSchema.update(updates, {
                    where: {
                        Id: lecturerId,
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

    };
}
