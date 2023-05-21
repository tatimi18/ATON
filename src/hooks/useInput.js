import { useState } from "react";

const useInput = (initialValue) => {
    const [value, setValue] = useState(initialValue);

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const setVal = (value) => {
        setValue(value);
    }

    const clear = () => {
        setValue('');
    }

    return {
        value,
        onChange: handleChange,
        setVal: setVal, 
        clear: clear
    };
};

export default useInput;