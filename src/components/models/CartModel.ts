// src/components/models/CartModel.ts

import type { IProduct } from "../../types";

// Определяем тип для функции-колбэка, которая будет вызываться при обновлении
type UpdateCallback = () => void;

export class CartModel {
    // Используем Map для хранения товаров по ID, чтобы легко их удалять и проверять наличие
    // Типизация Map<string, IProduct>
    private items: Map<string, IProduct> = new Map();
    // Добавляем массив для хранения подписчиков
    private callbacks: UpdateCallback[] = [];

    constructor() {}

    /**
     * Метод для подписки на события обновления (для View)
     */
    on(callback: UpdateCallback): void {
        this.callbacks.push(callback);
    }

    /**
     * Вспомогательный метод для уведомления всех подписчиков об изменении модели
     */
    private emitUpdate(): void {
        this.callbacks.forEach(callback => callback());
    }

    // Добавляет товар в корзину (только если есть цена)
    add(item: IProduct): void {
        if (item.price !== null) {
            this.items.set(item.id, item);
            // Вызываем событие обновления
            this.emitUpdate();
        }
    }

    // Удаляет товар из корзины по ID
    remove(id: string): void {
        // Проверяем, что элемент был удален, чтобы избежать лишнего вызова обновления
        const wasDeleted = this.items.delete(id);
        if (wasDeleted) {
            // Вызываем событие обновления
            this.emitUpdate();
        }
    }

    // Проверяет наличие товара в корзине
    has(id: string): boolean {
        return this.items.has(id);
    }

    // Очищает корзину
    clear(): void {
        // Проверяем, что корзина не пуста, чтобы избежать лишнего вызова обновления
        if (this.items.size > 0) {
            this.items.clear();
            // Вызываем событие обновления
            this.emitUpdate();
        }
    }

    // Получает список всех товаров в корзине
    getItems(): IProduct[] {
        return Array.from(this.items.values());
    }

    // Получает общее количество товаров (штук)
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