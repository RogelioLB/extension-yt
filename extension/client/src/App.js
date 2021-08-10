/* global chrome */
import React, { useState, useEffect} from 'react'
import Loader from './components/Loader'
import { useVideo } from './hooks/useVideo'
import {io} from 'socket.io-client'
import './App.css'
import ButtonsContainer from './components/ButtonsContainer'

let response;
const socket = io("http://localhost:3000",{
  transports:["websocket"],
});

socket.on("close",()=>{
  chrome.downloads.download({
    url:response
  })
})

const App = () => {
  const {title,loading,src,formatsAudio,formatsVideo,url,urlResponse,setUrlResponse} = useVideo()
  const [percentage,setPercentage] = useState(null)

  socket.on("connect",()=>console.log("Connected with id " +socket.id))

  socket.on("progress",(data)=>{
    setPercentage(data.downloaded)
  })

  useEffect(()=>{
    response=urlResponse
  },[urlResponse])

  return (
    <div className="app">
      {loading ? (<Loader />)
      :
      (
        <>
          <h1>{title}</h1>
          <img src={src.url} alt={title}/>
          <ButtonsContainer formatsAudio={formatsAudio} formatsVideo={formatsVideo} url={url} setUrlResponse={setUrlResponse}/>
          {percentage && (<h3>{percentage}%</h3>)}
        </>
      )
      }
    </div>
  )
}

export default App
