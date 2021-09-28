const route = require('express').Router();
const ytdl = require('ytdl-core');
const downloadFromVideo = require('../utils/downloadFromVideo');
const downloadFromAudio = require('../utils/downloadFromAudio');

route.post("/audio",async(req,res)=>{
    const io = req.app.get("io")
    const {url,itag} = req.body;
    const {title} = await (await ytdl.getInfo(url)).videoDetails
    downloadFromAudio(res,url,title,io,itag)
})

route.post("/video",async (req,res)=>{
    const {itag,url} = req.body;
    const {title} = await (await ytdl.getInfo(url)).videoDetails
    const io = req.app.get("io")
    downloadFromVideo(res,url,title,io,itag)
})

route.post("/info",async(req,res)=>{
    const {url} = req.body;
    console.log(url)
    try{
      const data = await ytdl.getInfo(url)
      let formats= data.formats.map((format)=>({quality:format.qualityLabel,audioQuality:format.audioQuality,itag:format.itag,hasVideo:format.hasVideo,hasAudio:format.hasAudio}))
      let formatsVideo = formats.filter((format)=>format.hasVideo)
      let formatsAudio = formats.filter((format)=>format.hasAudio)
      res.json({data:data.videoDetails,formatsVideo:formatsVideo,formatsAudio:formatsAudio})
    }catch(err){
      res.json(err.message)
    }
})


module.exports = route;