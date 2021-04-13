import { useEffect, useState } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

export const useResizeObserver = ref => {
    const [dimensions, setDimensions] = useState(null)
    useEffect(() => {
      const observeTarget = ref.current
      const resizeObserer = new ResizeObserver(entries => {
        entries.forEach(entry => {
          setDimensions(entry.contentRect)
        })
      })
      resizeObserer.observe(observeTarget)
      return () => {
        resizeObserer.unobserve(observeTarget)
      }
    }, [ref])
    return dimensions
  }