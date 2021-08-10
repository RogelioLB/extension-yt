import React, { useRef, useState } from 'react'
import Loader from './Loader'
import axios from 'axios'
import './Button.css'

const Button = ({children,type,onClick,itag}) => {
    const [loading,setLoading] = useState(false)

    return (
        <button onClick={e=>onClick(type,setLoading,itag)}>
            {children}
            {loading && (
                <Loader />
            )} 
        </button>
    )
}

export default Button
