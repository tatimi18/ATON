import React from 'react'

const MySelect = ({value, onChange, options, defaultValue}) => {
  return (
    <select 
        value={value} 
        onChange={event => onChange(event.target.value)}
        style={{padding: '5px'}}
    >
        <option disabled value=''>{defaultValue}</option>
        {options.map(option => 
            <option key={option.value} value={option.value}>
                {option.name}
            </option>
        )}
    </select>
  )
}

export default MySelect