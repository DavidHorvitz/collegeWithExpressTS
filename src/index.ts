import { createTables } from './DbConnection';
export async function main() {
    const DB = await createTables();
    return DB;
}
main().then(() => {
    console.log("Connection to database is Success !!!");

});
export type DB = Awaited<ReturnType<typeof main>>
