
import { createTables } from './DbConnection';


async function main() {
    await createTables();
}
main().then(()=>{
    console.log("Connection to database is Success !!!");
    
});
