import { knex } from "./bd.js"

async function updateUser() {
    try {
        await knex.from("usuarios").update({name: "nombre7", apellido: "apellido7"}).where("id", 5)
        console.log("Usuarios actualizado");        
    }
    catch (error) {
        console.log(error);    
    } 
    finally {
        knex.destroy()
    }
}

updateUser()