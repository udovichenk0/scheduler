import { useEffect } from 'react';
export const onMount = (cb: () => void) => {
  useEffect(() => {
    cb()
  }, [])
}