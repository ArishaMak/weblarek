import "./scss/styles.scss";

import { API_URL } from "./utils/constants"; 

// Импорт 4 ключевых классов, требуемых для работы с данными
import { WebLarekApi } from "./components/WebLarekApi"; 
//import { EventEmitter, IEvents } from "./components/base/Events";
import { ProductsModel } from "./components/models/ProductsModel";
import { CartModel } from "./components/models/CartModel";
import { BuyerModel } from "./components/models/BuyerModel";

// Типы данных
import type { IProduct } from "./types/index";

const testProductsData = {
    items: [
        { id: '1', title: 'Кнопка "Купить"', description: '...', image: '...', category: 'кнопка', price: 100 },
        { id: '2', title: 'Стек JavaScript', description: '...', image: '...', category: 'хард-скил', price: 500 },
        { id: '3', title: 'Нет цены', description: 'Товар без цены', image: '/3.jpg', category: 'другое', price: null }, 
    ] as IProduct[],
};


// 1. Инициализация классов

// const events: IEvents = new EventEmitter();
const api = new WebLarekApi(API_URL); 
const products = new ProductsModel();
const cart = new CartModel();
const buyer = new BuyerModel();


// 2. Тестирование моделей данных

console.log('--- Шаг 3: Тестирование Моделей Данных ---');
const testItems: IProduct[] = testProductsData.items; 

// ProductsModel
products.setItems(testItems); // setItems
console.log('ProductsModel: Массив товаров после setItems(): ', products.getItems()); // getItems
products.setSelectedProduct(testItems[0].id); // setSelectedProduct
console.log('ProductsModel: Выбранный товар: ', products.getSelectedProduct()); // getSelectedProduct
console.log('ProductsModel: Товар по ID 2: ', products.getItemById('2')); // getItemById


console.log('\nCartModel: Тестирование корзины');
if (testItems[0].price !== null) cart.add(testItems[0]); // add
if (testItems[1].price !== null) cart.add(testItems[1]); // add
cart.add(testItems[2]); 
console.log('CartModel: Товары в корзине после добавления: ', cart.getItems()); // getItems
console.log('CartModel: Общая стоимость: ', cart.getTotal()); // getTotal
console.log('CartModel: Количество товаров: ', cart.getCount()); // getCount
cart.remove(testItems[0].id); // remove
console.log('CartModel: Товары в корзине после удаления: ', cart.getItems());
cart.clear(); // clear
console.log('CartModel: Корзина после очистки: ', cart.getItems());


console.log('\nBuyerModel: Тестирование данных покупателя');
buyer.setPayment('card'); // Сохранение данных
buyer.setAddress('ул. Примерная, 1');
buyer.setEmail('test@example.com');
buyer.setPhone('88005553535');
console.log('BuyerModel: Ошибки валидации (ожидается пусто): ', buyer.validateAddressPayment()); // Валидация
buyer.reset(); // Очистка


// 3. Подключение работы с сервером (Требование Шага 4)

(async () => {
    try {
        console.log('\nШаг 4: Запрос к серверу');
        
        const items = await api.getProducts(); 
        
        products.setItems(items);
        
        console.log('Каталог товаров, полученный с сервера и сохраненный в модели: ', products.getItems());
        
    } catch (e) {
        console.error("Не удалось загрузить каталог с сервера:", e);
    }
})();