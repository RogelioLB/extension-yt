import React, { useState } from 'react'
import Loader from './Loader'
import './Button.css'

const Button = ({children,type,onClick,itag}) => {
    const [loading,setLoading] = useState(false)

    return (
        <button onClick={e=>type ? onClick(type,setLoading,itag) : onClick(setLoading)}>
            {children}
            {loading && (
                <Loader />
            )} 
        </button>
    )
}

export default Button
