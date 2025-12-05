// src/components/models/CartModel.ts

import type { IProduct } from "../../types";
import type { IEvents } from "../base/Events";
import { EVENTS } from "../base/eventNames";

export class CartModel {
    private items: Map<string, IProduct> = new Map();
    private events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    // Добавляет товар в корзину (только если есть цена)
    add(item: IProduct): void {
        if (item.price !== null) {
            this.items.set(item.id, item);
            this.events.emit(EVENTS.CART_CHANGE);
        }
    }

    // Удаляет товар из корзины по ID
    remove(id: string): void {
        const wasDeleted = this.items.delete(id);
        if (wasDeleted) {
            this.events.emit(EVENTS.CART_CHANGE);
        }
    }

    // Проверяет наличие товара в корзине
    has(id: string): boolean {
        return this.items.has(id);
    }

    // Очищает корзину
    clear(): void {
        if (this.items.size > 0) {
            this.items.clear();
            this.events.emit(EVENTS.CART_CHANGE);
        }
    }

    // Получает список всех товаров в корзине
    getItems(): IProduct[] {
        return Array.from(this.items.values());
    }

    // Получает общее количество товаров
    getCount(): number {
        return this.items.size;
    }

    // Получает общую стоимость товаров
    getTotal(): number {
        return Array.from(this.items.values()).reduce((total, item) => {
            return total + (item.price ?? 0);
        }, 0);
    }
}
