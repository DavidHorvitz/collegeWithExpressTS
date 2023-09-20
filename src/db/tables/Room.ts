import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import * as AppModel from "../../model/mainModels"

type RoomSchemaModel = Model<AppModel.Course.Room>

export interface RoomInterface {
    Schema: ModelStatic<RoomSchemaModel>
    insert: (room: Omit<AppModel.Course.Room, "Id">) => Promise<AppModel.Course.Room>
    getAllRooms: () => Promise<AppModel.Course.Room[] | undefined>
    countRooms: () => Promise<number>;

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
        ClassDatumId: {
            type: DataTypes.STRING,
            allowNull: true
        }

    }, {
        schema: "college1",
        createdAt: false,
    })

    await RoomSchema.sync();
    // await RoomSchema.sync({ force: true });

    return {
        Schema: RoomSchema,
        async insert(room) {
            const result = await RoomSchema.create(room as AppModel.Course.Room)
            return result.toJSON();
        },
        // async getAllRooms(): Promise<AppModel.Course.Room[] | undefined> {
        //     const results = await RoomSchema.findAll();
        //     if (results.length === 0) {
        //         return undefined;
        //     }
        //     const rooms: AppModel.Course.Room[] = results.map((result: any) => ({
        //         Id: result.Id,
        //         ClassNumber: result.ClassNumber,
               
        //     }));
        //     return rooms;

        // },
        async getAllRooms(): Promise<AppModel.Course.Room[] | undefined> {
            const results = await RoomSchema.findAll();
            if (results.length === 0) {
                return undefined;
            }
            const rooms: AppModel.Course.Room[] = results.map((result: any) => ({
                Id: result.Id,
                ClassNumber: result.ClassNumber,
                // ClassDatumId: result.ClassDatumId,
               
            }));
            return rooms;
        },
        async countRooms() {
            try {
                const count = await RoomSchema.count();
                return count;
            } catch (error) {
                console.error(error);
                return 0; // Return 0 in case of an error
            }
        },

    }
}