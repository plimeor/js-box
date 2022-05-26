export type Listener<T> = (data: T) => void

export type Unsubscribe = () => void

export type ListenerOptions = {
  once?: boolean
}

/**
 * 前后端通用的事件对象
 */
export class EventEmitter<T extends { [key: string]: any }> {
  protected listeners: {
    [key in keyof T]?: Array<Listener<T[key]>>
  } = {}

  addEventListener = <K extends keyof T>(eventName: K, handler: Listener<T[K]>, options?: ListenerOptions): Unsubscribe => {
    if (options?.once) {
      const _handler = handler
      handler = (data) => {
        this.removeEventListener(eventName, handler)
        _handler(data)
      }
    }

    if (!this.listeners[eventName]) {
      this.listeners[eventName] = []
    }

    this.getListeners(eventName).push(handler)

    return () => {
      this.off(eventName, handler)
    }
  }

  on = this.addEventListener

  once = <K extends keyof T>(eventName: K, handler: Listener<T[K]>): Unsubscribe => {
    return this.addEventListener(eventName, handler, {
      once: true
    })
  }

  emit = <K extends keyof T>(eventName: K, data: T[K]): void => {
    this.getListeners(eventName).forEach(handler => handler(data))
  }

  removeEventListener = <K extends keyof T>(eventName: K, handler: Listener<T[K]>): void => {
    const list = this.listeners[eventName]
    if (!list) return

    const index = list.indexOf(handler)
    if (index >= 0) list.splice(index, 1)
  }

  off = this.removeEventListener

  removeAllListeners = <K extends keyof T>(eventName?: K): void => {
    if (eventName) {
      delete this.listeners[eventName]
    } else {
      this.listeners = {}
    }
  }

  private getListeners = <K extends keyof T>(eventName: K): Listener<T[K]>[] => {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = []
    }

    return this.listeners[eventName]!
  }
}
