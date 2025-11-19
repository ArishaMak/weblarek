// src/components/base/Events.ts

// Алиасы для читаемости
type EventName = string;
type Subscriber = (...args: any[]) => void;
type EmitterEvent = {
    eventName: string;
    data: unknown;
};

export interface IEvents {
    on<T = unknown>(eventName: EventName, callback: (data: T) => void): void;
    emit<T = unknown>(eventName: string, data?: T): void;
    off(eventName: EventName, callback: Subscriber): void;
    offAll(): void;
    trigger<T extends object>(eventName: string, context?: Partial<T>): (event?: Partial<T>) => void;
    onAll(callback: (event: EmitterEvent) => void): void;
}

export class EventEmitter implements IEvents {
    private _events = new Map<EventName, Set<Subscriber>>();

    /**
     * Подписка на событие
     */
    on<T = unknown>(eventName: EventName, callback: (data: T) => void) {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<Subscriber>());
        }
        this._events.get(eventName)!.add(callback as Subscriber);
    }

    /**
     * Отписка от события
     */
    off(eventName: EventName, callback: Subscriber) {
        const subscribers = this._events.get(eventName);
        if (subscribers) {
            subscribers.delete(callback);
            if (subscribers.size === 0) {
                this._events.delete(eventName);
            }
        }
    }

    /**
     * Генерация события
     */
    emit<T = unknown>(eventName: string, data?: T) {
        // 1. Точное совпадение
        this._events.get(eventName)?.forEach(cb => cb(data));

        // 2. Wildcard для конкретного пространства имён (например, cart:*)
        const namespaceWildcard = eventName.replace(/:[^:]+$/, ':*');
        this._events.get(namespaceWildcard)?.forEach(cb => cb(data));

        // 3. Подписка на все события (*)
        this._events.get('*')?.forEach(cb => cb({ eventName, data }));
    }

    onAll(callback: (event: EmitterEvent) => void) {
        this.on('*', callback as Subscriber);
    }

    /**
     * Удалить все подписки
     */
    offAll() {
        this._events.clear();
    }

    /**
     * Создать триггер — функцию, которая при вызове генерирует событие
     */
    trigger<T extends object>(eventName: string, context?: Partial<T>) {
        return (event?: Partial<T>) => {
            this.emit(eventName, { ...(event || {}), ...(context || {}) } as T);
        };
    }
}