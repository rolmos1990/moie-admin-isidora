import {useCallback, useState} from 'react'

function useHookValue(initialValue) {
    const [value, setValue] = useState(initialValue)

    const onChange = useCallback((_, newValue) => {
        setValue(newValue)
    }, [setValue])
    const onAdd = useCallback((...args) => {
    }, [])

    return [value, onChange, onAdd, setValue];
}

export default useHookValue;
