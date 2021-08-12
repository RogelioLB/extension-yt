const route = require("express").Router()
const ytpl = require("ytpl");
const downloadPlaylist = require("../utils/downloadPlaylist");

route.post("/",async (req,res)=>{
    try{
        const {url} = req.body;
        const playlist = await ytpl(url);
        res.send(playlist);
    }catch(err){
        res.send({error:err.message});
    }
})


route.post("/download", async (req,res)=>{
    const {urlPlaylist,index,end,id} = req.body;
    const io = req.app.get("io");
    const playlist = await ytpl(urlPlaylist);
    const items = playlist.items.slice(index-1,end);
    const rooms = []
    items.forEach((video,i)=>{
        downloadPlaylist(video.url,video.title,io,136,id,i)
        rooms.push(i)
    })
    res.json({allItems:items,total:items.length,rooms:rooms})
})

module.exports = route;