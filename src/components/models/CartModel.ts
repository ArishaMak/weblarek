// src/components/models/CartModel.ts

import type { IProduct } from "../../types";

export class CartModel {
    // Используем Map для хранения товаров по ID, чтобы легко их удалять и проверять наличие
    private items: Map<string, IProduct> = new Map();

    constructor() {} 

    // Добавляет товар в корзину (только если есть цена)
    add(item: IProduct): void {
        if (item.price !== null) {
            this.items.set(item.id, item);
        }
    }

    // Удаляет товар из корзины по ID
    remove(id: string): void {
        this.items.delete(id);
    }

    // Проверяет наличие товара в корзине
    has(id: string): boolean {
        return this.items.has(id);
    }

    // Очищает корзину
    clear(): void {
        this.items.clear();
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
        let total = 0;
        this.items.forEach(item => {
            if (item.price !== null) {
                total += item.price;
            }
        });
        return total;
    }
}