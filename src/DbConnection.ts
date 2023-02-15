import { createTable as createClassDatesTable } from './schemas/classDates';
import { createTable as createCourseTable } from './schemas/course';
import { createTable as createLecturerTable } from './schemas/lecturer';
import { createTable as createStudent_coursesTable } from './schemas/student_courses';
import { createTable as createStudentTable } from './schemas/student';
import { createTable as createSyllabusTable } from './schemas/syllabus';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const { DB_NAME, DB_USER, DB_HOST, DB_PASSWORD } = process.env;
export function getConnection() {
    const sequelize = new Sequelize({
        database: DB_NAME,
        username: DB_USER,
        host: DB_HOST,
        dialect: "postgres",
        port: 5432,
        password: DB_PASSWORD,
        logging: (sql) => {
            console.log("Query: %s", sql)
        }
    });
    return sequelize;
}

export async function createTables() {
    const connection = getConnection()
    const Course = await createCourseTable(connection);
    const Lecturer = await createLecturerTable(connection);
    const Student = await createStudentTable(connection);
    const ClassDates = await createClassDatesTable(connection, Course.Schema, Lecturer.Schema);
    const Student_courses = await createStudent_coursesTable(connection, Student.Schema, Course.Schema,);
    const Syllabus = await createSyllabusTable(connection, Course.Schema);
    return {
        ClassDates,
        Course,
        Lecturer,
        Student_courses,
        Student,
        Syllabus
    }
}