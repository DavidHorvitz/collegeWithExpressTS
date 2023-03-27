
import { Sequelize } from "sequelize";
import { LecturerInterface, createLecturerTable } from "./Lecturer"
import { CourseInterface, createCourseTable } from "./Course";
import { ClassDateInterface, createClassDateTable } from "./ClassDate";
import { SyllabusInterface, createSyllabusTable } from "./Syllabus";
import { StudentInterface, createStudentTable } from "./Student";
import { CourseStudentInterface, createCourseStudentTable } from "./CourseStudent";
import { RoomInterface, createRoomTable } from "./Room";


export async function initTables(connection: Sequelize) {
    const room = await createRoomTable(connection);
    const lecturer = await createLecturerTable(connection);
    const course = await createCourseTable(connection, lecturer.Schema);
    const student = await createStudentTable(connection);
    const syllabus = await createSyllabusTable(connection, course.Schema);
    const classDate = await createClassDateTable(connection, course.Schema, lecturer.Schema, syllabus.Schema, room.Schema);
    const courseStudent = await createCourseStudentTable(connection, student.Schema, course.Schema, classDate.Schema);


    return {
        Room: room,
        Lecturer: lecturer,
        Course: course,
        ClassDate: classDate,
        Syllabus: syllabus,
        Student: student,
        CourseStudent: courseStudent
    }
}

export type DB = {
    Room: RoomInterface,
    Lecturer: LecturerInterface,
    Course: CourseInterface,
    ClassDate: ClassDateInterface,
    Syllabus: SyllabusInterface,
    Student: StudentInterface,
    CourseStudent: CourseStudentInterface
}