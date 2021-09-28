import axios from 'axios'
import React, { useContext, useState, useEffect} from 'react'
import { toast } from 'react-toastify'
import { PlaylistContext } from '../context/PlaylistContext'
import {socket} from '../Socket'
import Button from './Button'
import "./Playlist.css"


const Playlist = ({setPlaylist}) => {
    const {title,src,total,error,url} = useContext(PlaylistContext)
    const [percentages,setPercentage] = useState(new Map())
    const [allPercentages,setAllPercentages] = useState([])
    const [index,setIndex] = useState(1)
    const [end,setEnd] = useState(1)

    useEffect(()=>{
        socket.on("progressPlay",({downloaded,room})=>{
            setPercentage(prev=>new Map(prev.set(room,downloaded)))
        })
    },[])

    if(error) {alert(error); setPlaylist(false)}

    const handleClick = async (setLoading) =>{
        setLoading(true);
        const res = await axios.post("http://localhost:3000/playlist/download",JSON.stringify({urlPlaylist:url,index:index,end:end,id:socket.id}),{headers:{"Content-Type": "application/json"}})
        toast(`Downloading ${res.data.allItems} from ${res.data.total}`)
        setLoading(false)
    }


    useEffect(()=>{
        setAllPercentages(Array.from(percentages,(value,key)=>value[1]))
    },[percentages])
    return (
        <>
            {!error && (
                <>
                    <h1>{title}</h1>
                    <img src={src.url} alt={title} />
                    <h2>Total Videos: {total.length}</h2>
                    <div className="selects-container">
                        <div className="select-container">
                            <h3>Where to begin?</h3>
                            <select onChange={e=>setIndex(e.target.value)} value={index}>
                                {total.map((element,i)=>(
                                    <option>{i+1}</option>
                                ))}
                            </select>
                        </div>
                        <h2>To</h2>
                        <div className="select-container">
                            <h3>Where to end?</h3>
                            <select onChange={e=>setEnd(e.target.value)} value={end}>
                                {total.map((element,i)=>(
                                    <option>{i+1}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <Button onClick={handleClick}>Download</Button>
                    <div className="container-percentages">
                        {allPercentages.length && allPercentages.map((percentage) => (
                            <h3>{percentage}%</h3>
                        ))}
                    </div>
                </>
            )}
        </>
    )
}

export default Playlist
