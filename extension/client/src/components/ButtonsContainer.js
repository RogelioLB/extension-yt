import axios from 'axios'
import React from 'react'
import Button from './Button'
import "./ButtonsContainer.css"

const ButtonsContainer = ({formatsAudio,formatsVideo,url,setUrlResponse}) => {
    const handleClick = async(type,setLoading,itag) =>{
        setLoading(true)
        const res =await axios.post("http://localhost:3000/download/"+type,JSON.stringify({itag:itag,url:url}),{headers:{"Content-Type": "application/json"}})
        const data = res.data;
        setUrlResponse(data.url)
        setLoading(false)
    }

    return (
        <div className="formatsContainer">
            <h2>MP4:</h2>
            <div className="formatsVideo">
                {formatsVideo && formatsVideo.map((format,i)=>(
                    <Button key={i} onClick={handleClick} itag={format.itag} type="video">{format.quality.toUpperCase() !== "LARGE" ? format.quality.toUpperCase() : "480"}</Button>
                ))}
            </div>
            <h2>MP3:</h2>
            <div className="formatsAudio">
                {formatsAudio && formatsAudio.map((format,i) =>(
                    <Button key={i} onClick={handleClick} itag={format.itag} type="audio">{format.quality.toUpperCase()}</Button>
                ))}
            </div>
        </div>
    )
}

export default ButtonsContainer
