import React,{createContext} from 'react';
import { usePlaylist } from '../hooks/usePlaylist';


export const PlaylistContext = createContext()

const PlaylistContextProvider = ({children}) =>{
    const {title,src,error,loading,total,url} = usePlaylist()

    return(
        <PlaylistContext.Provider value={{title,loading,src,error,total,url}}>
            {children}
        </PlaylistContext.Provider>
    )
}

export default PlaylistContextProvider