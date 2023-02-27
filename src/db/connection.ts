import { Sequelize } from "sequelize";

export function getConnection() {
    const sequelize = new Sequelize({
        database: 'college',
        username: "postgres",
        host: "localhost",
        dialect: "postgres",
        port: 5432,
        password: "!Q@W3e4r",
        logging: (sql) => {
            console.log("Query: %s", sql)
        }
    });
    return sequelize;
} 