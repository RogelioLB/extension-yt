import axios from "axios";

const { useEffect, useState } = require("react");


export const usePlaylist = () =>{
    const [error,setError] = useState(false);
    const [title,setTitle] = useState("");
    const [src,setSrc] = useState("");
    const [total,setTotal] = useState("");
    const [loading,setLoading] = useState(false);
    const [url,setUrl] = useState("")

    useEffect(()=>{
        let url;
        // eslint-disable-next-line no-undef
        /*chrome.tabs.executeScript(null,{file:"background.js"},(arr)=>{
            url = arr[0]
            if(!url.includes("https://www.youtube.com/watch")) alert("Need to be in a youtube video")
            getInfo(url)
        })*/
        getInfo("https://www.youtube.com/watch?v=sDGVmJx5RC8&list=RDMM&start_radio=1&rv=lwDJ5nDn_5A&ab_channel=4x3Oficial")
    },[])
    
    const getInfo = async(url) =>{
        try{
            setLoading(true)
            setUrl(url)
            const res = await axios.post("http://localhost:3000/playlist",JSON.stringify({url:url}),{headers:{"Content-Type": "application/json"}});
            console.log(res.data);
            const data = res.data;
            setError(data.error)
            setSrc(data.thumbnails[0])
            setTitle(data.title)
            setTotal(data.items)
            setLoading(false)
        }catch(err){
            setError("No hay")
        }
    }

    return {title,src,total,error,loading,url}
}