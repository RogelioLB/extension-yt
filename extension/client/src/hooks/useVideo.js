/* global browser */
import axios from "axios";
import { useEffect, useState } from "react"


export const useVideo = () =>{
    const [title,setTitle] = useState("");
    const [loading,setLoading] = useState(false)
    const [src,setSrc] = useState("")
    const [formatsAudio,setFormatsAudio] = useState([])
    const [formatsVideo,setFormatsVideo] = useState([]) 
    const [url,setUrl] = useState("")
    const [urlResponse,setUrlResponse] = useState("")

    const getInfo = async(url) =>{
        setLoading(true)
        setUrl(url)
        const res = await axios.post("http://localhost:9000/download/info",JSON.stringify({url:url}),{headers: {'Content-Type': 'application/json'}})
        const data = res.data;
        console.log(data)
        const thumb = data.data.thumbnails[3]
        setTitle(data.title)
        setSrc(thumb);
        const formatsVideo = data.formatsVideo;
        const formatsAudio = data.formatsAudio;
        const format1080 = formatsVideo.find((format)=>format.quality === "1080p" || format.quality === "hd1080")
        const format720 = formatsVideo.find((format)=>format.quality === "720p" || format.quality === "hd720")
        const format480 = formatsVideo.find((format)=>format.quality === "large" || format.quality === "hd480")
        const medium = formatsAudio.find((format)=>format.audioQuality === "AUDIO_QUALITY_MEDIUM") 
        const tiny = formatsAudio.find((format)=>format.audioQuality === "AUDIO_QUALITY_LOW")
        setFormatsVideo([format1080,format720,format480])
        setFormatsAudio([medium,tiny])
        setLoading(false)
    }

    useEffect(()=>{
        let url;
        browser.tabs.executeScript(null,{file:"background.js"},(arr)=>{
            url = arr[0]
            if(!url.includes("https://www.youtube.com/watch")) alert("Need to be in a youtube video")
            getInfo(url)
        })
    },[])

    return {title,loading,formatsAudio,formatsVideo,src,url,setUrlResponse,urlResponse}
}
