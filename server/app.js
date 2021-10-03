const express = require("express")
const cors = require("cors")
const app = express()
const http = require("http")
const {Server} = require("socket.io")
const path = require("path")
const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:"*"
    }
})

app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use(express.static(path.resolve(__dirname,"./public/downloads")))

app.set("io",io)


app.use("/download",require("./routes/download"))
app.use("/playlist",require("./routes/playlist"))


server.listen(process.env.PORT || 3000,()=>console.log("Listen on port "+process.env.PORT || 3000))