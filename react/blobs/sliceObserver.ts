'use client';

/**
 * This is a bit of a mess. Before I knew about useCallback or memoization
 * 
 * I wrote it a long time ago, and it is an unfinished experiment. It does work, but it's a little bit of spaghetti that would need a rewrite.
 * At any rate, my attempt at implementation observer pattern.
 */

import { Dispatch, SetStateAction, useEffect } from "react"
import { Point } from "./blobPhysics";

export interface SlicesObserver {
  subscribe: (subject: SlicesSubject) => void
  unsubscribe: (target: HTMLElement) => void
}

export const createSlicesObserver = (): SlicesObserver => {
  let listeners = [] as Array<SlicesSubject>

  const subscribe = (subject: SlicesSubject) => {
    listeners.push(subject)
  }

  const unsubscribe = (target: HTMLElement) => {
    listeners = listeners.filter((listener) => listener.target !== target)
  }

  useEffect(() => {
    const updateSlices = (listener: SlicesSubject) => {
      listener.setSlices(Array.from(listener.slicesMap.values()))
    }

    const translateToLocal = (point: Point, listener: SlicesSubject): Point => {
      const elementRect = listener.target.getBoundingClientRect()

      return {
        x: point.x - elementRect.x,
        y: point.y - elementRect.y
      }
    }

    const handleEnter = (listener: SlicesSubject, event: PointerEvent) => {
      let enterance = {
        x: event.x,
        y: event.y
      }

      if (listener.useLocalCoordinates) {
        enterance = translateToLocal(enterance, listener)
      }

      const current = enterance;

      listener.slicesMap.set(event.pointerId, {
        pointerId: event.pointerId,
        enterance,
        enteranceTime: new Date().getTime(),
        current
      })
    }

    const handleOut = (listener: SlicesSubject, event: PointerEvent) => {
      listener.slicesMap.delete(event.pointerId)
    }

    const handleUpdate = (listener: SlicesSubject, event: PointerEvent, slice: Slice) => {
      let current = {
        x: event.x,
        y: event.y
      }

      if (listener.useLocalCoordinates) {
        current = translateToLocal(current, listener)
      }

      slice.current = current

      listener.slicesMap.set(event.pointerId, slice)
    }

    const handlePointerMove = (event: PointerEvent) => {
      handleIdlePointer(event)

      const elements = document.elementsFromPoint(event.x, event.y)

      listeners.forEach((listener, index) => {
        const isOverTarget = elements.includes(listener.target)
        const activeSlice = listener.slicesMap.get(event.pointerId)
        if (isOverTarget) {
          if (activeSlice) {
            handleUpdate(listener, event, activeSlice)
          } else {
            handleEnter(listener, event)
          }
        } else {
          if (activeSlice) {
            handleOut(listener, event)
          } else {
            return
          }
        }
        updateSlices(listener)
      })
    }

    const idlePointers = new Map() as Map<number, NodeJS.Timeout>
    const handleIdlePointer = (event: PointerEvent) => {
      clearIdlePointer(event.pointerId)

      const timeoutID = setTimeout(() => {
        handlePointerMove(event)
      }, 50)

      idlePointers.set(event.pointerId, timeoutID)
    }

    const clearIdlePointer = (pointerId: number) => {
      const timeoutID = idlePointers.get(pointerId)

      if (typeof timeoutID === 'undefined') {
        return
      }

      clearTimeout(timeoutID)
      idlePointers.delete(pointerId)
    }

    const handlePointerOut = (event: PointerEvent) => {
      clearIdlePointer(event.pointerId)

      listeners.forEach((listener) => {
        if (listener.slicesMap.has(event.pointerId)) {
          handleOut(listener, event)
          updateSlices(listener)
        }
      })
    }

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointercancel", handlePointerOut)
    window.addEventListener("pointerup", handlePointerOut)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointercancel", handlePointerOut)
      window.removeEventListener("pointerup", handlePointerOut)
    }
  }, [listeners])

  return {
    subscribe,
    unsubscribe
  }
}
