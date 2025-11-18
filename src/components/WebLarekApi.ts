import { Api } from './base/Api';
import type { IProduct, IOrderPayload, IOrderResult, ApiListResponse } from '../types';

export class WebLarekApi extends Api {
    
    // В конструкторе вызываем конструктор базового класса
    constructor(baseURL: string, options?: RequestInit) {
        super(baseURL, options);
    }

    /**
     * Получает список товаров с сервера (GET /product/).
     */
    getProducts(): Promise<IProduct[]> {
        // Выполняем GET-запрос
        return this.get<ApiListResponse<IProduct>>('/product/')
            .then((data) => {
                return data.items;
            });
    }

    postOrder(order: IOrderPayload): Promise<IOrderResult> { 
        return this.post<IOrderResult>('/order/', order);
    }
}