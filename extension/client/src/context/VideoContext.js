import React,{createContext} from 'react';
import {useVideo} from '../hooks/useVideo'


export const VideoContext = createContext()

const VideoContextProvider = ({children}) =>{
    const {title,loading,src,formatsAudio,formatsVideo,url,urlResponse,setUrlResponse} = useVideo()

    return(
        <VideoContext.Provider value={{title,loading,src,formatsAudio,formatsVideo,url,urlResponse,setUrlResponse}}>
            {children}
        </VideoContext.Provider>
    )
}

export default VideoContextProvider