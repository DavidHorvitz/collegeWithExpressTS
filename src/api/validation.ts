import { Lecturer } from "../model/mainModels";
import validate from 'uuid-validate'


export function isUUID(uuid: string): boolean {
  return validate(uuid, 4);
}


export function validateLecturer(input: Lecturer.Lecturer): Omit<Lecturer.Lecturer, "Id"> {
  // validate input
  return {
    Name: input.Name,
    PhoneNumber: input.PhoneNumber,
    Email: input.Email,
    ImageProfile: input.ImageProfile
  }
}
// import { validate } from 'uuid-validate';

