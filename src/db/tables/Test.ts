import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import * as AppModel from "../../model/mainModels";


type TestSchemaModel = Model<AppModel.Course.Test>

export interface TestInterface {
    Schema: ModelStatic<TestSchemaModel>
    // insert: (test: Omit<AppModel.Course.Test, "Id">) => Promise<AppModel.Course.Test>
    insert: (test: Omit<AppModel.Course.Test, "Id" | "TestNumber">) => Promise<AppModel.Course.Test>
    getAllTests: () => Promise<AppModel.Course.Test[] | undefined>
    countTests: () => Promise<number>;
}


export async function createTestTable(sequelize: Sequelize): Promise<TestInterface> {
    const TestSchema = sequelize.define<TestSchemaModel>("Test", {
        Id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        TestName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        TestNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true, // Automatically increment the TestNumber
            unique: true         // Ensure uniqueness
        },
    }, {
        schema: "college1",
        createdAt: false,
    })
    await TestSchema.sync();
    return {
        Schema: TestSchema,
        async insert(test) {
            const result = await TestSchema.create(test as AppModel.Course.Test)
            return result.toJSON();
        },
        async getAllTests(): Promise<AppModel.Course.Test[] | undefined> {
            const results = await TestSchema.findAll();
            if (results.length === 0) {
                return undefined;
            }
            const tests: AppModel.Course.Test[] = results.map((result: any) => ({
                Id: result.Id,
                TestName: result.TestName,
                TestNumber: result.TestNumber

            }));
            return tests;
        },
        async countTests() {
            try {
                const count = await TestSchema.count();
                return count;
            } catch (error) {
                console.error(error);
                return 0; // Return 0 in case of an error
            }
        },
    }
}