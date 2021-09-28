import axios from 'axios'
import React from 'react'
import { toast } from 'react-toastify'
import Button from './Button'
import "./ButtonsContainer.css"

const ButtonsContainer = ({formatsAudio,formatsVideo,url,setUrlResponse}) => {
    const handleClick = async(type,setLoading,itag) =>{
        setLoading(true)
        const res =await axios.post("http://localhost:9000/download/"+type,JSON.stringify({itag:itag,url:url}),{headers:{"Content-Type": "application/json"}})
        const data = res.data;
        toast(`Downloading ${data.title}`)
        setUrlResponse(data.url)
        setLoading(false)
    }

    return (
        <div className="formatsContainer">
            <h2>MP4:</h2>
            <div className="formatsVideo">
                {formatsVideo && formatsVideo.map((format,i)=>{
                    if(!format) return <></>
                    return (
                        <Button key={i} onClick={handleClick} itag={format.itag} type="video">{format.quality.toUpperCase() !== "LARGE" ? format.quality.toUpperCase() : "480"}</Button>
                    )
                })}
            </div>
            <h2>MP3:</h2>
            <div className="formatsAudio">
                {formatsAudio && formatsAudio.map((format,i) =>{
                    if(!format) return <></>
                    return (
                        <Button key={i} onClick={handleClick} itag={format.itag} type="audio">{format.audioQuality.toUpperCase()}</Button>
                    )
                })}
            </div>
        </div>
    )
}

export default ButtonsContainer
