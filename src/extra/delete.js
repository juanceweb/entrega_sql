import { knex } from "./bd.js"

async function deleteUser() {
    try {
        await knex.del().from("usuarios").where("id", 5)
        console.log("Usuarios borrado");        
    }
    catch (error) {
        console.log(error);    
    } 
    finally {
        knex.destroy()
    }
}

deleteUser()