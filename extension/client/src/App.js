/* global chrome */
import React, { useState, useContext} from 'react'
import Loader from './components/Loader'
import './App.css'
import Switch from './components/Switch'
import {socket} from './Socket'
import { VideoContext } from './context/VideoContext'
import Video from './components/Video'
import Playlist from './components/Playlist'

// eslint-disable-next-line no-unused-vars
socket.on("close",({url,title})=>{
  alert("Downloaded "+ title)
  chrome.downloads.download({
    url:url
  })
})

const App = () => {
  const [playlist,setPlaylist] = useState(false)
  const {loading} = useContext(VideoContext)

  socket.on("connect",()=>console.log("Connected with id " +socket.id))

  return (
    <div className="app">
      {loading ? (<Loader />)
      :
      (
        <>
          <div className="switch-container">
            <h3>¿Playlist?</h3>
            <Switch onChange={setPlaylist} value={playlist}/>
          </div>
          {!playlist ? <Video /> : <Playlist />}
        </>
      )
      }
    </div>
  )
}

export default App
