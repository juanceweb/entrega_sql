import { knex } from "./bd.js"

const users = [
    {name: "name1", lastname: "last1", email: "n1@n"},
    {name: "name2", lastname: "last2", email: "n2@n"},
    {name: "name3", lastname: "last3", email: "n3@n"}
]

async function createUsers() {
    try {
        const response = await knex.insert(users).from("usuarios")
        console.log("Usuarios agregados");
        console.log(response);     
    }
    catch (error) {
        console.log(error);    
    } 
    finally {
        knex.destroy()
    }
}

createUsers()