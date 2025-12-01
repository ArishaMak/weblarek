// src/components/base/Events.ts

// Алиасы для читаемости
type EventName = string;
type Subscriber<T = unknown> = (data: T) => void; // Фикс: Generic для типобезопасности (убран ...args: any[])

export interface IEvents {
    on<T = unknown>(eventName: EventName, callback: Subscriber<T>): void; // Фикс: Subscriber<T> вместо (data: T) => void (consistent)
    emit<T = unknown>(eventName: string, data?: T): void;
    off(eventName: EventName, callback: Subscriber<unknown>): void; // Фикс: Subscriber<unknown> для off
    offAll(): void;
    trigger<T extends object>(eventName: string, context?: Partial<T>): (event?: Partial<T>) => void;
    onAll(callback: (event: EmitterEvent) => void): void;
}

type EmitterEvent = {
    eventName: string;
    data: unknown;
};

export class EventEmitter implements IEvents {
    private _events = new Map<EventName, Set<Subscriber<unknown>>>(); // Фикс: Set<Subscriber<unknown>> для consistency

    /**
     * Подписка на событие
     */
    on<T = unknown>(eventName: EventName, callback: Subscriber<T>) {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<Subscriber<unknown>>());
        }
        this._events.get(eventName)!.add(callback as Subscriber<unknown>); // Cast OK, но теперь generic
    }

    /**
     * Отписка от события
     */
    off(eventName: EventName, callback: Subscriber<unknown>) {
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
        const safeData = data ?? null; // Фикс: Всегда передаём data (null если undefined)

        try {
            // 1. Точное совпадение
            this._events.get(eventName)?.forEach(cb => cb(safeData as unknown)); // Фикс: as unknown для generic

            // 2. Wildcard для конкретного пространства имён (улучшено: поддержка multi-level, e.g., "user:profile:*" для "user:profile:updated")
            const parts = eventName.split(':');
            for (let i = 1; i <= parts.length; i++) {
                const wildcard = parts.slice(0, i).join(':') + ':*';
                this._events.get(wildcard)?.forEach(cb => cb(safeData as unknown)); // Фикс: multi-level wildcard
            }

            // 3. Подписка на все события (*)
            this._events.get('*')?.forEach(cb => cb({ eventName, data: safeData } as unknown as Parameters<Subscriber>[0])); // Фикс: type-safe для object
        } catch (error) {
            console.error(`Error emitting event ${eventName}:`, error); // Фикс: Error handling
        }
    }

    onAll(callback: (event: EmitterEvent) => void) {
        this.on('*', callback as Subscriber<unknown>); // Фикс: Cast с учётом object
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
    trigger<T extends object>(eventName: string, context?: Partial<T>): (event?: Partial<T>) => void {
        return (event?: Partial<T>) => {
            const mergedData = { ...(context || {}), ...(event || {}) } as T; // Фикс: Explicit merge
            this.emit(eventName, mergedData);
        };
    }
}