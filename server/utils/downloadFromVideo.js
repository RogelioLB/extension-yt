const ytdl = require("ytdl-core")
const ffmpeg = require("ffmpeg-static")
const cp = require("child_process")
const fs = require("fs")
const path = require("path")
const parserTitles = require("./parserTitles")

const downloadFromVideo = (res,url,title,io,itag) =>{
    const tracker = {
        start: Date.now(),
        audio: { downloaded: 0, total: Infinity },
        video: { downloaded: 0, total: Infinity },
        merged: { frame: 0, speed: '0x', fps: 0 },
      };
      
    try{
      const audio = ytdl(url, { quality: 'highestaudio' }).on('progress', (_, downloaded, total) => {
        tracker.audio = { downloaded, total };
      });
      const video = ytdl(url, { quality: itag }).on('progress', (_, downloaded, total) => {
        tracker.video = { downloaded, total };
      });
      
        
      const ffmpegProcess = cp.spawn(ffmpeg, [
        '-loglevel', '8', '-hide_banner',
        '-progress', 'pipe:3',
        '-i', 'pipe:4',
        '-i', 'pipe:5',
        '-map', '0:a',
        '-map', '1:v',
        '-c:v', 'copy',
        `${path.resolve(__dirname, `../public/downloads/${parserTitles(title)}.mp4`)}`,
      ], {
        windowsHide: true,
        stdio: [
          /* Standard: stdin, stdout, stderr */
          'inherit', 'inherit', 'inherit',
          /* Custom: pipe:3, pipe:4, pipe:5 */
          'pipe', 'pipe', 'pipe',
        ],
      });
      ffmpegProcess.on('close', () => {
        io.emit("close",{url:"http://localhost:3000/"+parserTitles(title)+".mp4",title:parserTitles(title)})
      });
      
      // Link streams
      // FFmpeg creates the transformer streams and we just have to insert / read data
      ffmpegProcess.stdio[3].on('data', chunk => {
        // Parse the param=value list returned by ffmpeg
        const lines = chunk.toString().trim().split('\n');
        const args = {};
        for (const l of lines) {
          const [key, value] = l.split('=');
          args[key.trim()] = value.trim();
        }
        tracker.merged = args;
        const percentageAudio = (tracker.audio.downloaded / tracker.audio.total)
        const percentageVideo = (tracker.video.downloaded / tracker.video.total)
        const total = ((percentageVideo)+(percentageAudio))/2*100
        io.emit("progress",{downloaded:total.toFixed(2)})
      });
      audio.pipe(ffmpegProcess.stdio[4]);
      video.pipe(ffmpegProcess.stdio[5]);
      setTimeout(()=>fs.rmSync(path.resolve(__dirname,`../public/downloads/${parserTitles(title)}.mp4`)),300000)
  
      res.json({message:"Downloading",url:"http://localhost:3000/"+parserTitles(title)+".mp4",title:parserTitles(title)+".mp4"})
    }catch(err){
      io.emit("error",err)
      res.json({message:"Error downloading. Please try again!"})
    }
}


module.exports = downloadFromVideo