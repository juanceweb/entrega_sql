import dotenv from "dotenv";
import _knex from "knex"
dotenv.config()

export class Productos{
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
                        table.string("producto", 100).notNullable()
                        table.string("precio", 100).notNullable()
                        table.string("stock", 100).notNullable()
                        table.string("imagen", 100).notNullable()
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

    async read_productos() {
        try {
            const productos = await this.knex.select().from(this.table)
            return productos
        }
        catch (error) {
            console.log(error);    
        }
    }

    async add_producto(data) {
        try {
            await this.knex.insert(data).from(this.table)
            console.log('Producto Cargado!');
        }
        catch (error) {
            console.log(error);    
        } 
    }

    async delete_producto(id) {
        try {
            await this.knex.del().from(this.table).where("id", id)
            return "Producto borrado!";        
        }
        catch (error) {
            console.log(error);    
        } 
    }

    async update_producto(data, id) {
        try {
            await this.knex.from(this.table).update(data).where("id", id)
            return "Producto actualizado!";        
        }
        catch (error) {
            console.log(error);    
        } 
    }
}



