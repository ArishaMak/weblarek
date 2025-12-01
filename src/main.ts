import "./scss/styles.scss";

import { cloneTemplate, ensureElement } from "./utils/utils";
import { API_URL } from "./utils/constants"; 
// Импортируем моковые данные apiProducts из data.ts
import { apiProducts } from "./utils/data";

import { WebLarekApi } from "./components/WebLarekApi"; 
import { EventEmitter, IEvents } from "./components/base/Events";
import { EVENTS } from "./components/base/eventNames";
import { ProductsModel } from "./components/models/ProductsModel";
import { CartModel } from "./components/models/CartModel";
import { BuyerModel } from "./components/models/BuyerModel";

import { Header } from "./components/views/Header";
import { Gallery } from "./components/views/Gallery";
import { CardPreview } from "./components/views/CardPreview";
import { CardInCart } from "./components/views/CardInCart";
import { BasketView } from "./components/views/BasketView";
import { Modal } from "./components/views/Modal";
import { OrderSuccess } from "./components/views/OrderSuccess";


import type { IProduct, IOrderPayload, TPayment } from "./types/index";

// 1. Инициализация классов

const events: IEvents = new EventEmitter();
const api = new WebLarekApi(API_URL); 
const products = new ProductsModel();
const cart = new CartModel();
const buyer = new BuyerModel();

const header = new Header(events, ensureElement<HTMLElement>(".header"));
const gallery = new Gallery(ensureElement<HTMLElement>("main.gallery"));
const modal = new Modal(ensureElement<HTMLElement>(".modal"));

const tplCardPreview = ensureElement<HTMLTemplateElement>("#card-preview");
const tplBasket = ensureElement<HTMLTemplateElement>("#basket");
const tplBasketItem = ensureElement<HTMLTemplateElement>("#card-basket");
const tplSuccess = ensureElement<HTMLTemplateElement>("#success");

// Заглушки для отсутствующих шаблонов 
let orderAddressPaymentContainer: HTMLElement = ensureElement<HTMLElement>("#order") || document.createElement('div');
orderAddressPaymentContainer.innerHTML = '<input placeholder="Address"><select><option>card</option></select>';
let orderEmailPhoneContainer: HTMLElement = ensureElement<HTMLElement>("#contacts") || document.createElement('div');
orderEmailPhoneContainer.innerHTML = '<input placeholder="Email"><input placeholder="Phone">';

const basketView = new BasketView(cloneTemplate(tplBasket), () =>
  events.emit(EVENTS.BASKET_CHECKOUT)
);

/* Заглушки для форм
let orderAddressPaymentContainer: HTMLElement = orderAddressPaymentContainer;
let orderEmailPhoneContainer: HTMLElement = orderEmailPhoneContainer;*/

const orderSuccess = new OrderSuccess(cloneTemplate(tplSuccess), () =>
  modal.close()
);

let basketRowsCache: HTMLElement[] = [];
let basketTotalCache = 0;

const rerenderHeader = () => header.render({ counter: cart.getCount() });

const rerenderCatalog = () => {
  const itemsList = document.createElement('ul'); // Простой ul вместо карточек
  products.getItems().forEach((item: IProduct) => {
    const li = document.createElement('li');
    li.textContent = `${item.title} - ${item.price || 'No price'}`;
    li.addEventListener('click', () => events.emit(EVENTS.CARD_SELECT, { id: item.id }));
    itemsList.appendChild(li);
  });
  gallery.element.innerHTML = '';
  gallery.element.appendChild(itemsList);
};

function openPreview() {
  const item = products.getSelectedProduct();
  if (!item) return;

  const view = new CardPreview(cloneTemplate(tplCardPreview), {
    onBuy: () => events.emit(EVENTS.CARD_BUY, { id: item.id }),
    onRemove: () =>
      events.emit(EVENTS.CARD_REMOVE, {
        id: item.id,
        from: "preview" as const,
      }),
  });

  const previewElement = view.render({
    title: item.title,
    price: item.price,
    image: item.image,
    description: item.description,
    inCart: cart.has(item.id),
  });

  modal.open(previewElement);
}

function openBasket() {
  modal.open(
    basketView.render({
      items: basketRowsCache,
      total: basketTotalCache,
      empty: basketRowsCache.length === 0,
    })
  );
}

function openOrderAddressPayment() {
  // Простая модалка с заглушкой
  modal.open(orderAddressPaymentContainer);
  console.log('Форма адреса/оплаты открыта (заглушка)');
  buyer.setAddress('Default address'); // Заглушка данных
  buyer.setPayment('card' as TPayment);
}

function openOrderEmailPhone() {
  modal.open(orderEmailPhoneContainer);
  console.log('Форма email/phone открыта (заглушка)');
  buyer.setEmail('default@example.com');
  buyer.setPhone('88005553535');
}

function handlePay() {
  if (!isEmailPhoneValid()) return;

  const payload: IOrderPayload = {
    items: cart.getItems().map((i) => i.id),
    payment: buyer.getPayment() || "card",
    address: buyer.getAddress() || "",
    email: buyer.getEmail() || "",
    phone: buyer.getPhone() || "",
    total: cart.getTotal(),
  };

  api
    .postOrder(payload)
    .then((res) => {
      cart.clear();
      buyer.reset();

      const successElement = orderSuccess.render({ total: res.total });
      modal.open(successElement);
    })
    .catch((e) => {
      console.error("Ошибка оформления заказа:", e);
    });
}

function isAddressPaymentValid() {
  return Object.keys(buyer.validateAddressPayment()).length === 0;
}

function isEmailPhoneValid() {
  return Object.keys(buyer.validateEmailPhone()).length === 0;
}

function updateAddressPaymentValidity() {
  console.log('Валидация адреса/оплаты обновлена (заглушка)'); // Заглушка рендера
}

function updateEmailPhoneValidity() {
  console.log('Валидация email/phone обновлена (заглушка)');
}

// Подписки на события (используем global events)
events.on('products:change:items', rerenderCatalog);
events.on('products:change:selectedId', openPreview);

events.on('cart:change', () => {
  rerenderHeader();
  basketRowsCache = cart.getItems().map((p, idx) => {
    const row = new CardInCart(cloneTemplate(tplBasketItem), {
      onRemove: () =>
        events.emit(EVENTS.CARD_REMOVE, { id: p.id, from: "basket" as const }), // Убрано fallback
    });
    return row.render({ // Убрано .element (используем container)
      index: idx + 1,
      title: p.title,
      price: p.price,
    });
  });
  basketTotalCache = cart.getTotal();
  basketView.render({
    items: basketRowsCache,
    total: basketTotalCache,
    empty: basketRowsCache.length === 0,
  });
});

events.on('buyer:change', () => {
  updateAddressPaymentValidity();
  updateEmailPhoneValidity();
});

// Обработчики для модальных окон и форм
events.on(EVENTS.BASKET_OPEN, openBasket);
events.on(EVENTS.BASKET_CHECKOUT, openOrderAddressPayment);

events.on<{ id: string }>(EVENTS.CARD_SELECT, ({ id }) => {
  products.setSelectedProduct(id);
});

events.on<{ id: string }>(EVENTS.CARD_BUY, ({ id }) => {
  const item = products.getItemById(id);
  if (item) {
    cart.add(item);
    modal.close();
  }
});

events.on<{ id: string; from?: "preview" | "basket" }>(
  EVENTS.CARD_REMOVE,
  ({ id, from }) => {
    cart.remove(id);
    if (from === "preview") {
      modal.close();
    }
  }
);

events.on(EVENTS.ORDER_ADDRESS_PAYMENT_NEXT, () => {
  if (isAddressPaymentValid()) openOrderEmailPhone();
});

events.on(EVENTS.ORDER_EMAIL_PHONE_PAY, handlePay);

// Инициализация рендера после загрузки данных
gallery.render({ catalog: [] });
header.render({ counter: 0 });

// 3. Подключение работы с сервером

(async () => {
    try {
        console.log('\nШаг 4: Запрос к серверу');
        
        const items = await api.getProducts(); 
        
        products.setItems(items);
        rerenderHeader();
        rerenderCatalog(); // Вызываем заглушку каталога
        
        console.log('Каталог товаров, полученный с сервера и сохраненный в модели: ', products.getItems());
        
    } catch (e) {
        console.error("Не удалось загрузить каталог с сервера:", e);
        // Fallback на моковые данные
        products.setItems(apiProducts.items);
        rerenderHeader();
        rerenderCatalog();
    }
})();