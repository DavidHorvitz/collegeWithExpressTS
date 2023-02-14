
export interface syllabusModel {
    Id: string, //uuid
    title: string,
    description: string,
    reference: string,
    course_id: string, // FK reference for the course table
}