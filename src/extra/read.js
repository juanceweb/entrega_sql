import { knex } from "./bd.js"

async function readUser() {
    try {
        const users = await knex.select().from("usuarios")
        console.log(users);
    }
    catch (error) {
        console.log(error);    
    } 
    finally {
        knex.destroy()
    }
}

readUser()