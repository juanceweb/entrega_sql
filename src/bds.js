export const config_Lite = {
    client: "better-sqlite3",
    connection: {
        filename: "./src/mydb.sqlite"
    },
    useNullAsDefault: true,
}

export const config_Maria = {
    client:"mysql2",
    connection: {
        host: process.env.HOSTDB,
        user: process.env.USERDB,
        password: process.env.PASSWORDDB,
        database: process.env.DATABASE,
    }
}