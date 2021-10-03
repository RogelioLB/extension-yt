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
        ffmpeg(stream).audioBitrate(128).save(pathname).on('stderr', function(line) {
          if (line.trim().startsWith('Duration')) {
              var match = line.trim().match(/Duration:\s\d\d\:\d\d:\d\d/).toString().split('Duration:').slice(1).toString().split(':');
              duration = +match[0] * 60 * 60 + +match[1] * 60 + +match[2];
          } else if (line.trim().startsWith('size=')) {
              match = line.trim().match(/time=\d\d\:\d\d:\d\d/).toString().split('time=').slice(1).toString().split(':');
              var seconds = +match[0] * 60 * 60 + +match[1] * 60 + +match[2];
              percent = seconds / duration;
              percent = (percent * 100).toFixed()
              console.log(`stderr: ${line}`)
              console.log(`${percent}%`)
              io.emit("progress",{downloaded:percent})
          }
      }).on("end",()=>{
          const options = {
            artist:info.videoDetails.author.name,
            title:info.videoDetails.title,
            album:info.videoDetails.author.name
          }
          metadata.write(pathname,options,(err)=>{
            if(err) throw err;
            io.emit("close",{url:"https://api-yt-downloader.herokuapp.com/"+parserTitles(title)+".mp3",title:parserTitles(title)+".mp3"})
          });
          setTimeout(()=>fs.rmSync(path.resolve(__dirname,`../public/downloads/${parserTitles(title)}.mp3`)),300000)
        })
        res.json({url:"https://api-yt-downloader.herokuapp.com/"+parserTitles(title)+".mp3",message:"Downloading...",title:parserTitles(title)+".mp3"})
    }catch(err){
      console.log(err)
      io.emit('error', {message:"Error downloading. Please try again."})
      res.json({message:"Error downloading. Please try again."})
    }
}

module.exports = downloadFromAudio;