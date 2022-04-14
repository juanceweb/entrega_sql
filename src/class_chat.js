import dotenv from "dotenv";
import _knex from "knex"
dotenv.config()

export class Chats{
    constructor(config, tabla){
        this.knex = _knex(config)
        this.table = tabla
        this.create_table(this.table)
    }

    async create_table(tabla) {
        try {
            const exist = await this.knex.schema.hasTable(tabla)
            if (!exist) {
                await this.knex.schema.createTable(tabla, (table) =>{
                    table.increments("id").primary().notNullable()
                        table.string("author", 100).notNullable()
                        table.string("text", 100).notNullable()

                })
                console.log("Tabla Creada");
            }
            else {
                console.log('Tabla Ya Existe');
                
            }
        } 
        catch (error) {
            console.log(error);    
        }
    }

    async read_chats() {
        try {
            const chats = await this.knex.select().from(this.table)         
            return chats
        }
        catch (error) {
            console.log(error);    
        }
    }

    async add_chat(data) {
        try {
            await this.knex.insert(data).from(this.table)
            console.log('Hay un Mensaje Nuevo!');
        }
        catch (error) {
            console.log(error);    
        } 
    }
}