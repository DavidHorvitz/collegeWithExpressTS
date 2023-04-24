import { Sequelize } from "sequelize";

export function getConnection() {
    const sequelize = new Sequelize({
        database: 'college',
        username: "postgres",
        host: "college.cr8zlgy1itgd.us-east-2.rds.amazonaws.com",
        dialect: "postgres",
        port: 5432,
        password: "12345678",
        logging: (sql) => {
            console.log("Query: %s", sql)
        }
    });
    return sequelize;
} 

