import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { trackEvent } from '@/lib/api'

export function useAnalytics() {
  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId') || uuidv4()
    localStorage.setItem('sessionId', sessionId)

    const trackPageView = () => {
      trackEvent({
        sessionId,
        eventType: 'pageView',
        url: window.location.pathname,
      })
    }

    const trackClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      trackEvent({
        sessionId,
        eventType: 'click',
        elementId: target.id,
        elementClass: target.className,
        elementText: target.textContent,
      })
    }

    trackPageView()
    window.addEventListener('click', trackClick)

    return () => {
      window.removeEventListener('click', trackClick)
    }
  }, [])

  const trackCustomEvent = (eventName: string, eventData: any) => {
    const sessionId = localStorage.getItem('sessionId')
    if (sessionId) {
      trackEvent({
        sessionId,
        eventType: eventName,
        ...eventData,
      })
    }
  }

  return { trackCustomEvent }
}

