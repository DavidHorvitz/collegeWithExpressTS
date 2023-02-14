
export interface classDatesModel {
    Id: string, //uuid
    date: Date,
    start_hour: Date,
    end_hour: Date,
    room_id: number,
    entry_in_syllabus: number,
    lecturer_id: string, //uuidv FK reference to lecture table
    course_id: string  //uuidv FK reference to course table
}