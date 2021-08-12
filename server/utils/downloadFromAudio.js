const ytdl = require("ytdl-core")
const fs = require("fs")
const path = require("path")
const parserTitles = require("./parserTitles")

const downloadFromAudio = (res,url,title,io,itag) =>{
    try{
        ytdl(url,{filter:"audio",quality:itag}).on("progress",(_,downloaded,total)=>{
          io.emit("progress",{downloaded:(downloaded/total*100).toFixed(2)})
        }).on("end",()=>{
            io.emit("close",{url:"http://localhost:3000/"+parserTitles(title)+".mp3"})
            setTimeout(()=>{
              fs.rmSync(path.resolve(__dirname,`../public/downloads/${parserTitles(title)}.mp3`))
          },300000)
        }).pipe(fs.createWriteStream(path.resolve(__dirname,`../public/downloads/${parserTitles(title)}.mp3`)))
        res.json({url:"http://localhost:3000/"+parserTitles(title)+".mp3",message:"Downloading..."})
      }catch(err){
        console.log(err)
        io.emit('error', {message:"Error downloading. Please try again."})
        res.json({message:"Error downloading. Please try again."})
      }
}

module.exports = downloadFromAudio