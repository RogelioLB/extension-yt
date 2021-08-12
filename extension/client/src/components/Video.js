import React,{useContext, useState} from 'react'
import ButtonsContainer from './ButtonsContainer'
import {socket} from '../Socket'
import { VideoContext } from '../context/VideoContext'


const Video = () => {
    const [percentage,setPercentage] = useState(null)
    const {title,src,formatsAudio,formatsVideo,url,setUrlResponse} = useContext(VideoContext)

    socket.on("progress",(data)=>{
        setPercentage(data.downloaded)
    })

    return (
        <>
            <h1>{title}</h1>
            <img src={src.url} alt={title}/>
            <ButtonsContainer formatsAudio={formatsAudio} formatsVideo={formatsVideo} url={url} setUrlResponse={setUrlResponse}/>
            {percentage && (<h3>{percentage}%</h3>)}
        </>
    )
}

export default Video
