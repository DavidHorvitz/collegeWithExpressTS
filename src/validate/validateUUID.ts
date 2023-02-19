// import { validate } from 'uuid-validate';
import validate from 'uuid-validate'

export function isUUID(uuid: string): boolean {
  return validate(uuid, 4);
}