import { useEffect, useRef, useCallback } from 'react'

function useTimer(isRunning, onTick) {
  const intervalRef = useRef(null)
  const callbackRef = useRef(onTick)

  // Update callback ref when onTick changes
  useEffect(() => {
    callbackRef.current = onTick
  }, [onTick])

  // Memoized tick function to prevent unnecessary effect re-runs
  const tick = useCallback(() => {
    if (callbackRef.current) {
      callbackRef.current()
    }
  }, [])

  useEffect(() => {
    if (isRunning) {
      // Start the interval if not already running
      if (!intervalRef.current) {
        intervalRef.current = setInterval(tick, 1000)
      }
    } else {
      // Clear the interval if it exists
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    // Cleanup function to clear interval on unmount or dependency change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning, tick])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])
}

export default useTimer