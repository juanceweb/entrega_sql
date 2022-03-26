const express = require("express");
const http = require("http")
const app = express()
const fs = require("fs")
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)
const {engine} = require("express-handlebars")

io.on("connection", async (socket) => {
  // Apenas se conecta
  console.log("Nuevo usuario")
  socket.emit("mensajeConexion", "Bienvenido!")
  
  io.sockets.emit("messageBack", await chat.getAll())

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
    const salvar = await chat.save(data)
    io.sockets.emit("messageBack", await chat.getAll())
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
        layoutsDir: __dirname + "/templates/layouts",
    }),
);

// -------------------------------------------------------

app.get("/", (req,res) => {
    res.render("main", {})
})

app.post("/", async (req, res) => {
    const { body } = req;
    await archivo.save(body);
    res.status(200).render("main", {})
})

app.get("/productos", async (req, res) => {
    const productos = await archivo.getAll()
    res.status(200).render("productos", {productos})
})

// --------------------------------------------------

const PORT = 8080;
server.listen(PORT, () =>
  console.log(`🚀 Server started on port http://localhost:${PORT}`),
);
server.on("error", (err) => console.log(err));


// --------------------------------------------------


class Contenedor{
  constructor(archivo){
      this.productos = []
      this.maxID = 0
      this.archivo = archivo
  }

  async save(producto){
      await this.getAll()
      this.maxId++
      producto.id = this.maxId
      this.productos.push(producto)
      try {
          await fs.promises.writeFile(this.archivo, JSON.stringify(this.productos))
          return producto
      }
      catch (error){
          throw new Error(error)
      }
  }

  async getById(id){
      try {
          const resultado = await this.getAll()
          const found = resultado.find(element => element.id == id)
          if (found == undefined) {
              return {error: "producto no encontrado"}
          }
          else{
              return found
          }
      }
      catch (error){
          throw new Error(error)
      }

  }

  async getAll(){
      try {
          const productos = JSON.parse( await fs.promises.readFile(this.archivo, "utf-8"))
          this.productos = productos
          this.productos.map((producto) => {
              if (producto.id && this.maxID < producto.id)
              this.maxId = producto.id
              
          })
          return this.productos
      } 
      catch(error) {
          throw new Error(error)
      }
  }

  async deleteById(id){
      try {
          const resultado = await this.getAll()
          const found = resultado.find(element => element.id == id)
          if (found == undefined) {
              return null
          }
          else{
              const new_array = resultado.filter(element => element.id != found.id)
              try {
                  await fs.promises.writeFile(this.archivo, JSON.stringify(new_array))
                  return "producto borrado!"
              }
              catch (error){
                  throw new Error(error)
              }
          }
      }
      catch (error){
          throw new Error(error)
      }
  }

  async deleteAll(){
      try {
          await fs.promises.writeFile(this.archivo, JSON.stringify([]))
      }
      catch (error){
          throw new Error(error)
      }
  }

}

archivo = new Contenedor("./src/archivo.txt")
chat = new Contenedor("./src/chats.txt")