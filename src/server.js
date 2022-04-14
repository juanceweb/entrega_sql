import express from "express"
import * as http from 'http';
import { Server } from "socket.io";
import { Productos } from "./class_producto.js"
import { Chats } from "./class_chat.js"
import { engine } from 'express-handlebars';
import { config_Maria, config_Lite } from "./bds.js";

//----------------------------------------------------

const app = express()
const server = http.createServer(app)
const io = new Server(server)

//----------------------------------------------------

io.on("connection", async (socket) => {
  // Apenas se conecta
    console.log("Nuevo usuario")
    socket.emit("mensajeConexion", "Bienvenido!")
    io.sockets.emit("messageBack", await chat.read_chats())

  // Evento Mensaje al desconectarse
    socket.on("disconnect", () => {
        console.log("Chau usuario")
    })

  // Evento que envia respuesta al front
    socket.on("mensajeRespuesta", (data) => {
        console.log(data)
    })

  // Evento que recien mensaje al front
    socket.on("messageFront", async (data) => {
        await chat.add_chat(data)
        io.sockets.emit("messageBack", await chat.read_chats())
    })
})
// --------------------------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"))

// --------------------------------------------------

app.set("views", "./src/templates")
app.set("view engine", "hbs")

app.engine(
    "hbs",
    engine({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: "src/templates/layouts",
    }),
);

// -------------------------------------------------------

app.get("/", (req,res) => {
    res.status(200).render("cargar", {})
})

app.get("/chat", (req,res) => {
    res.status(200).render("main", {})
})

app.get("/cargar_producto", async (req, res) => {
    res.status(200).render("cargar", {})
})

app.get("/eliminar_producto", async (req, res) => {
    res.status(200).render("eliminar", {})
})

app.get("/ver_productos", async (req, res) => {
    const productos = await bd1.read_productos()
    res.status(200).render("productos", {productos})
})

app.post("/ver_productos", async (req, res) => {
    const { body } = req;
    await bd1.add_producto(body)
    const productos = await bd1.read_productos()
    res.status(200).render("productos", {productos})
})

app.delete("/eliminar_producto/:id", async (req, res) => {
    const { id } = req.params;
    const respuesta = await bd1.delete_producto(id)
    res.status(200).json(respuesta)
})

app.put("/modificar_producto/:id", async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const respuesta = await bd1.update_producto(body, id)
    res.status(200).json(respuesta)
})

// --------------------------------------------------

const PORT = 8080;
server.listen(PORT, () =>
    console.log(`🚀 Server started on port http://localhost:${PORT}`),
);
server.on("error", (err) => console.log(err));


// --------------------------------------------------

const bd1 = new Productos(config_Maria, "productos")
const chat = new Chats(config_Lite, "chats")

