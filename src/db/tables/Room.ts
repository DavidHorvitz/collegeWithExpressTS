import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import * as AppModel from "../../model/mainModels"

type RoomSchemaModel = Model<AppModel.Course.Room>

export interface RoomInterface {
    Schema: ModelStatic<RoomSchemaModel>
    insert: (room: Omit<AppModel.Course.Room, "Id">) => Promise<AppModel.Course.Room>

}
export async function createRoomTable(sequelize: Sequelize): Promise<RoomInterface> {
    const RoomSchema = sequelize.define<RoomSchemaModel>("Room", {
        Id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        ClassNumber: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
 
    }, {
        schema: "college",
        createdAt: false,
    })

    await RoomSchema.sync();

    return {
        Schema: RoomSchema,
        async insert(room) {
            const result = await RoomSchema.create(room as AppModel.Course.Room)
            return result.toJSON();
        },
    };
}