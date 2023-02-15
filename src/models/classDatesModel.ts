
export interface classDatesModel {
    Id: string, //uuid
    Date: Date,
    Start_hour: Date,
    End_hour: Date,
    Room_id: number,
    Entry_in_syllabus: number,
    Lecturer_id: string, //uuidv FK reference to lecture table
    Course_id: string  //uuidv FK reference to course table
}