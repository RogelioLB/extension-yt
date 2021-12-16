const ytdl = require("ytdl-core");
const fs = require("fs");
const cp = require("child_process")
const ffmpeg = require("ffmpeg-static")
const path = require("path");
const parserTitles = require("./parserTitles");
const metadata = require("ffmetadata");

metadata.setFfmpegPath(require("ffmpeg-static"));

const downloadFromAudio = async (res, url, title, io, itag, id) => {
  try {
    const tracker = {
      start: Date.now(),
      audio: { downloaded: 0, total: Infinity },
      merged: { frame: 0, speed: '0x', fps: 0 },
    };
    const info = await ytdl.getInfo(url);
    const format = info.formats.find(format=>(format.itag === itag && format.hasAudio && (format.audioBitrate === 128 || format.audioBitrate === 96)));
    console.log(format)
    console.log(format.audioBitrate, format.audioCodec)
    const stream = ytdl(url, { filter: "audioonly", quality: itag }).on('progress', (_, downloaded, total) => {
      tracker.audio = { downloaded, total };
    });
    const pathname = path.join(
      __dirname,
      `../public/downloads/${parserTitles(title)}.mp3`
    );
    const ffmpegProcess = cp.spawn(ffmpeg, [
      '-loglevel', '8', '-hide_banner',
      '-progress', 'pipe:3',
      '-i', 'pipe:4',
      "-b:a", `${format.audioBitrate}`,
      `${pathname}`,
    ], {
      windowsHide: true,
      stdio: [
        /* Standard: stdin, stdout, stderr */
        'inherit', 'inherit', 'inherit',
        /* Custom: pipe:3, pipe:4, pipe:5 */
        'pipe', 'pipe',
      ],
    });
    ffmpegProcess.on('close', () => {
      const options = {
        artist:info.videoDetails.author.name,
        title:info.videoDetails.title,
        album:info.videoDetails.author.name
      }
      metadata.write(pathname,options,(err)=>{
        if(err) throw err;
        io.to(id).emit("close",{url:"http://192.168.0.28:3000/"+parserTitles(title)+".mp3",title:parserTitles(title)+".mp3"})
      });
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
      const total = (tracker.audio.downloaded / tracker.audio.total) * 100
      console.log(total);
      io.to(id).emit("progress",{downloaded:total.toFixed(2)})
    });
    stream.pipe(ffmpegProcess.stdio[4]);
  
    res.json({
      url:
        "https://api-yt-downloader.herokuapp.com/" +
        parserTitles(title) +
        ".mp3",
      message: "Downloading...",
      title: parserTitles(title) + ".mp3",
    });
  } catch (err) {
    console.log(err);
    io.to(id).emit("error", {
      message: "Error downloading. Please try again.",
    });
    res.json({ message: "Error downloading. Please try again." });
  }
};

module.exports = downloadFromAudio;
