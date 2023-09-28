export interface Room {
    Id: string,
    ClassNumber: number,
    ClassDatumId?: string
}
export interface ClassDate {
    Id: string;
    StartHour: Date;
    EndHour: Date;
    RoomId?: Array<Room>;
    EntryInSyllabus: string;
    LecturerId?: string;
}

export interface Syllabus {
    Id: string;
    Title: string;
    Description: string;
    References: Array<string>
    CourseOutline: Array<string>
}


export interface Course {
    Id: string;
    CourseName: string;
    StartingDate: Date;
    EndDate: Date;
    MinimumPassingScore: number;
    MaximumStudents: number;
    Image: string;
    IsReady: boolean;
    ClassDates?: Array<ClassDate>;
    Syllabus?: Array<Syllabus>
}

export interface Test {
    Id: string;
    TestName: string;
    TestNumber: number;

}