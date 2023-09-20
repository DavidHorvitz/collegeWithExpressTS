import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import * as AppModel from "../../model/mainModels"

type StudentSchemaModel = Model<AppModel.Student.Student>

export interface StudentInterface {
    Schema: ModelStatic<StudentSchemaModel>
    insert: (student: Omit<AppModel.Student.Student, "Id">) => Promise<AppModel.Student.Student>
    search: (id: string) => Promise<AppModel.Student.Student | undefined>
    getAllStudent: () => Promise<AppModel.Student.Student[] | undefined>
    delete: (studentId: string) => Promise<boolean>
    updateStudentById: (studentId: string, updates: Partial<AppModel.Student.Student>) => Promise<AppModel.Student.Student | undefined>
    countStudents: () => Promise<number>;

}

export async function createStudentTable(sequelize: Sequelize): Promise<StudentInterface> {
    const StudentSchema = sequelize.define<StudentSchemaModel>("Student", {
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
        },
        ImageProfile: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        schema: "college1",
        createdAt: false,
    })

    await StudentSchema.sync();

    return {
        Schema: StudentSchema,
        async insert(student) {
            const result = await StudentSchema.create(student as AppModel.Student.Student)
            return result.toJSON();
        },
        async search(id: string) {
            const result = await StudentSchema.findByPk(id)
            return result?.toJSON();
        },
        
        async getAllStudent(): Promise<AppModel.Student.Student[] | undefined> {
            const results = await StudentSchema.findAll();
            if (results.length === 0) {
                return undefined;
            }
            const students: AppModel.Student.Student[] = results.map((result: any) => ({
                Id: result.Id,
                Name: result.Name,
                PhoneNumber: result.PhoneNumber,
                Email: result.Email,
                ImageProfile: result.ImageProfile
            }));
            return students;
        },
        async countStudents() {
            try {
                const count = await StudentSchema.count();
                return count;
            } catch (error) {
                console.error(error);
                return 0; // Return 0 in case of an error
            }
        },
        async delete(studentId) {
            const result = await StudentSchema.destroy({
                where: {
                    Id: studentId
                }
            })
            return result === 1;
        },
        async updateStudentById(studentId: string, updates: Partial<AppModel.Student.Student>) {
            try {
                const [rowsAffected, [updatedStudent]] = await StudentSchema.update(updates, {
                    where: {
                        Id: studentId,
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