
export interface syllabusModel {
    Id: string, //uuid
    Title: string,
    Description: string,
    Reference: string,
    Course_id: string, // FK reference for the course table
}