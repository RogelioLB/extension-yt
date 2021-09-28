const ytdl = require("ytdl-core")
const fs = require("fs")
const path = require("path")
const parserTitles = require("./parserTitles")
const ffmpeg = require("fluent-ffmpeg");

const metadata = require("ffmetadata");

ffmpeg.setFfmpegPath(require("ffmpeg-static"))

metadata.setFfmpegPath(require("ffmpeg-static"));


const downloadFromAudio = async(res,url,title,io,itag) =>{
    try{
        const info = await ytdl.getBasicInfo(url);
        const stream = ytdl(url,{filter:"audio",quality:itag});
        const pathname = path.join(__dirname,`../public/downloads/${parserTitles(title)}.mp3`)
        ffmpeg(stream).audioBitrate(128).save(pathname).on("progress", p=>{
          io.emit("progress",{downloaded:p.percent})
          console.log(p)
        }).on("end",()=>{
          io.emit("close",{url:"http://localhost:3000/"+parserTitles(title)+".mp3",title:parserTitles(title)+".mp3"})
          const options = {
            artist:info.videoDetails.author.name,
            title:info.videoDetails.title
          }
          metadata.write(pathname,options,(err)=>{
            if(err) throw err;
          });
          setTimeout(()=>fs.rmSync(path.resolve(__dirname,`../public/downloads/${parserTitles(title)}.mp3`)),300000)
        })
        res.json({url:"http://localhost:3000/"+parserTitles(title)+".mp3",message:"Downloading...",title:parserTitles(title)+".mp3"})
    }catch(err){
      console.log(err)
      io.emit('error', {message:"Error downloading. Please try again."})
      res.json({message:"Error downloading. Please try again."})
    }
}

module.exports = downloadFromAudio;