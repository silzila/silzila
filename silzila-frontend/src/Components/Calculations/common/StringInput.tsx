import React from 'react'

const StringInput = ({
    inputValue,
    placeholder,
    autofocus,
    setInputValue,
    setInputFocused,
}: {
    inputValue: string,
    placeholder: string,
    autofocus: boolean,
    setInputValue: React.Dispatch<React.SetStateAction<string>>,
    setInputFocused: React.Dispatch<React.SetStateAction<boolean>>,
}) => {
    return (
        <input
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            autoFocus={autofocus}
            style={{
                height: "1.5rem",
                lineHeight: "1rem",
                width: "100%",
                margin: "0 4px",
                marginRight: "5px",
                paddingRight: "5px",
                border: 'none',
                outline: 'none',
                color: "rgb(128, 128, 128)"
            }}
            type="text"
            value={inputValue}
            placeholder={placeholder}
            onChange={e => { setInputValue(e.target.value) }}
        />
    )
}

export default StringInput