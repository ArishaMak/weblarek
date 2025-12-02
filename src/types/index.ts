// src/types/index.ts

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash';

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

// КРИТИЧЕСКИ ВАЖНО: Добавляем IOrderForm
export interface IOrderForm {
    payment: TPayment;
    address: string;
    email: string;
    phone: string;
}

export interface IBuyer {
    payment: TPayment | null;
    email: string;
    phone: string;
    address: string;
}

export interface IOrderPayload extends IOrderForm {
    items: string[]; // Массив ID товаров в корзине
    total: number;
}

export interface IOrderResult {
    id: string; // ID заказа, возвращаемый сервером
    total: number; // Итоговая стоимость
}

export interface ApiListResponse<T> {
    total: number;
    items: T[];
}