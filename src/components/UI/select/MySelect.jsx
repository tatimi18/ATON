import React from 'react'

const MySelect = ({value, title, onChange, options, defaultValue}) => {
  return (
    <>
      <p>{title}</p>
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
    </>
  )
}

export default MySelect