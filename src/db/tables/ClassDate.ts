import { Op, Transaction } from "sequelize";
import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import * as AppModel from "../../model/mainModels"
import { CourseInterface } from "./Course";
import { LecturerInterface } from "./Lecturer";
import { SyllabusInterface } from "./Syllabus";
import { RoomInterface } from "./Room";
import { ClassDate } from "../../model/course";

type ClassDateSchemaModel = Model<Omit<AppModel.Course.ClassDate, 'lecturerId'>>

export interface ClassDateInterface {
    Schema: ModelStatic<ClassDateSchemaModel>

    // createClassDateWithRoom: (classDate: Pick<ClassDate, "StartHour" | "EndHour" | "EntryInSyllabus" | "RoomId">) => Promise<AppModel.Course.ClassDate>
    insert: (classDate_id: Omit<AppModel.Course.ClassDate, "Id">) => Promise<AppModel.Course.ClassDate>
    // delete: (classDate_id: string) => Promise<boolean>
    // addClassDateToLecturer: (lecturerId: string, classDateId: string) => Promise<void>
    // addClassDateToCourse: (courseId: string, classDateId: string) => Promise<void>
    // gettingLecturersScheduleBetweenDates: (lecturerId: string, startingDate: Date, endDate: Date) => Promise<AppModel.Lecturer.Lecturer | undefined>
    // routeForSettingTheCourseToReady: (courseId: string, updates: Omit<AppModel.Course.Course, "IsReady">) => Promise<AppModel.Course.Course | undefined>



}

export async function createClassDateTable(sequelize: Sequelize,
    Course: CourseInterface["Schema"], Lecturer: LecturerInterface["Schema"], Syllabus: SyllabusInterface["Schema"], Room: RoomInterface["Schema"]):
    Promise<ClassDateInterface> {
    const ClassDateSchema = sequelize.define<ClassDateSchemaModel>("ClassData", {
        Id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        StartHour: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        EndHour: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        EntryInSyllabus: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // RoomId: {
        //     type: DataTypes.UUID,
        //     allowNull: false,
        // },
    }, {
        schema: "college1",
        createdAt: false,
    })

    Course.hasMany(ClassDateSchema, { foreignKey: 'Course_id' });
    ClassDateSchema.belongsTo(Course, { foreignKey: 'Course_id' });
    Lecturer.hasMany(ClassDateSchema, { foreignKey: 'Lecturer_id' });
    ClassDateSchema.belongsTo(Lecturer, { foreignKey: 'Lecturer_id' });
    ClassDateSchema.hasMany(Room);
    Room.belongsTo(ClassDateSchema);
    await ClassDateSchema.sync();
    return {
        Schema: ClassDateSchema,
        // async createClassDateWithRoom(classDate): Promise<AppModel.Course.ClassDate> {
        //     const transaction: Transaction = await sequelize.transaction();
        //     const data: any = classDate;
        //     try {
        //       const roomId = data.RoomId.ClassNumber; // Extract the room id from the nested object
        //       const room: any = await Room.findByPk(roomId);
        //       if (!room) {
        //         throw new Error(`Room with id ${roomId} not found`);
        //       }

        //       const classDate: any = await ClassDateSchema.create(
        //         {
        //           ...data,
        //           Room: room,
        //           RoomId: roomId // Set the room id directly
        //         },
        //         { transaction }
        //       );

        //       await transaction.commit();

        //       return classDate;
        //     } catch (error) {
        //       await transaction.rollback();
        //       throw error;
        //     }
        //   },

        // async createClassDateWithRoom(classDate): Promise<AppModel.Course.ClassDate> {
        //     const transaction: Transaction = await sequelize.transaction();
        //     const data: any = classDate;
        //     try {
        //         const room: any = await Room.findByPk(data.RoomId);
        //         if (!room) {
        //             throw new Error(`Room with id ${data.RoomId} not found`);
        //         }

        //         const classDate: any = await ClassDateSchema.create(
        //             {
        //                 ...data,
        //                 Room: room,
        //             },
        //             { transaction }
        //         );

        //         await transaction.commit();

        //         return classDate;
        //     } catch (error) {
        //         await transaction.rollback();
        //         throw error;
        //     }
        // },
        async insert(classDate) {
            const result = await ClassDateSchema.create(classDate as AppModel.Course.ClassDate)
            return result.toJSON();
        },
        // async delete(classDate_id) {
        //     const result = await ClassDateSchema.destroy({
        //         where: {
        //             Id: classDate_id
        //         }
        //     })
        //     return result === 1;
        // },
        // async addClassDateToLecturer(lecturerId, classDateId) {

        //     const classDate = await ClassDateSchema.findByPk(classDateId);
        //     if (!classDate) {
        //         throw new Error(`classDate with ID ${classDateId} not found`);
        //     }

        //     const lecturer = await Lecturer.findByPk(lecturerId);
        //     if (!lecturer) {
        //         throw new Error(`lecturer with ID ${lecturerId} not found`);
        //     }
        //     await (classDate as any).setLecturer(lecturer);
        // },
        // async addClassDateToCourse(courseId, classDateId) {

        //     const classDate = await ClassDateSchema.findByPk(classDateId);
        //     if (!classDate) {
        //         throw new Error(`classDate with ID ${classDateId} not found`);
        //     }

        //     const course = await Course.findByPk(courseId);
        //     if (!course) {
        //         throw new Error(`lecturer with ID ${courseId} not found`);
        //     }
        //     await (classDate as any).setCourse(course);
        // },
        // async gettingLecturersScheduleBetweenDates(lecturerId, startDate, endDate) {
        //     const classDate = await Lecturer.findByPk(lecturerId, {
        //         attributes: ['Name'],
        //         include: [
        //             {
        //                 model: Course,
        //                 attributes: ['CourseName'],
        //                 where: {
        //                     StartingDate: { [Op.gte]: startDate, },
        //                     EndDate: { [Op.lte]: endDate, },
        //                 },
        //                 include: [
        //                     {
        //                         model: ClassDateSchema,
        //                         attributes: ['RoomId', 'StartHour', 'EndHour', 'EntryInSyllabus'],
        //                         required: true, // Add required option to only include class dates with a linked course
        //                     },
        //                 ],

        //             },
        //         ],
        //     });
        //     if (!classDate) {
        //         return undefined;
        //     }
        //     const data: any = classDate;
        //     return data;
        // },
        // async routeForSettingTheCourseToReady(courseId, updates) {
        //     try {
        //         const result = await Course.findAll({
        //             where: { Id: courseId },
        //             include: [{
        //                 model: ClassDateSchema,
        //                 required: true,
        //                 include: [{
        //                     model: Syllabus,
        //                     required: true,
        //                 },
        //                 {
        //                     model: Lecturer,
        //                     required: true,
        //                 }]
        //             }]
        //         })
        //         if (!result) {
        //             console.log('Course not found');
        //             return undefined;
        //         }

        //         const data: any = result;
        //         const { CourseName, StartingDate, EndDate, MinimumPassingScore, MaximumStudents } = data;

        //         if (!CourseName || !StartingDate || !EndDate || !MinimumPassingScore || !MaximumStudents) {
        //             return {
        //                 error: "Course information is not set properly. Please set all fields."
        //             };
        //         }

        //         const [rowsAffected, [updatedCourse]] = await Course.update({
        //             ...updates,
        //             IsReady: true
        //         }, {
        //             where: {
        //                 Id: courseId,
        //             },
        //             returning: true
        //         });

        //         if (rowsAffected > 0) {
        //             return updatedCourse.toJSON() as any;
        //         } else {
        //             return undefined;
        //         }
        //     } catch (error) {
        //         console.error(error);
        //         return undefined;
        //     }
        // },


    };
}
