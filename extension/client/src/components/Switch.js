import React,{Fragment} from 'react';
import './switch.css'

const Switch = ({value,onChange}) => {
    return (
        <label style={{width:"52px",height:"32px"}} onClick={(e)=>onChange(!value)}>
            {
                !value ? (
                    <Fragment>
                        <span className="disabled-track" />
                        <span className="disabled-thumb" />
                    </Fragment>
                ):
                (
                    <Fragment>
                        <span className="enabled-track" />
                        <span className="enabled-thumb" />
                    </Fragment>
                )
            }
        </label>
    )
}

export default Switch;