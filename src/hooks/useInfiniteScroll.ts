import { useEffect, useRef } from 'react'

interface UseInfiniteScrollOptions {
  hasMore: boolean
  loading: boolean
  onLoadMore: () => void
}

// Attach the returned ref to a sentinel element at the bottom of a list.
// Fires onLoadMore once it scrolls into view, as long as more pages exist
// and a fetch isn't already in flight.
export function useInfiniteScroll({ hasMore, loading, onLoadMore }: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !hasMore || loading) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) onLoadMore()
      },
      { rootMargin: '200px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, loading, onLoadMore])

  return sentinelRef
}
