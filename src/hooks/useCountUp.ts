import { useEffect, useState } from 'react'
import { useScrollAnimation } from './useScrollAnimation'

export function useCountUp(
  target: number,
  duration = 2000,
  suffix = ''
) {
  const { ref, isVisible } = useScrollAnimation(0.3)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    let startTime: number | null = null
    let animationId: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))

      if (progress < 1) {
        animationId = requestAnimationFrame(animate)
      }
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [isVisible, target, duration])

  const formatted =
    count >= 1000
      ? `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K${suffix}`
      : `${count}${suffix}`

  return { ref, value: formatted, raw: count }
}
