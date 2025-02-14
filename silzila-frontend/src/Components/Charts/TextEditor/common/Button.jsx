import React from 'react'

const Button =(props)=>{
    const {children,format,active, disable, ...rest} = props
    return(
        <button disabled={disable} className={active?'btnActive':'lol'} title={format}  {...rest} style={{width:'30px',height:'20px',margin:'0 2px'}}>
            {children}
        </button>
    )
}

export default Button;