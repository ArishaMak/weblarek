import "./scss/styles.scss";

import { cloneTemplate, ensureElement } from "./utils/utils";
import { API_URL } from "./utils/constants";

import { WebLarekApi } from "./components/WebLarekApi";
import { EventEmitter, IEvents } from "./components/base/Events";
import { EVENTS } from "./components/base/eventNames";
import { ProductsModel } from "./components/models/ProductsModel";
import { CartModel } from "./components/models/CartModel";
import { BuyerModel } from "./components/models/BuyerModel";

import { Header } from "./components/views/Header";
import { Gallery } from "./components/views/Gallery";
import { CardCatalog } from "./components/views/Catalog";
import { CardPreview } from "./components/views/CardPreview";
import { CardInCart } from "./components/views/CardInCart";
import { BasketView } from "./components/views/BasketView";
import { Modal } from "./components/views/Modal";
import { OrderAddressPayment } from "./components/views/OrderAddressPayment";
import { OrderEmailPhone } from "./components/views/OrderEmailPhone";
import { OrderSuccess } from "./components/views/OrderSuccess";

import type { IProduct, IOrderPayload, TPayment, IOrderForm } from "./types/index";

const events: IEvents = new EventEmitter();
const api = new WebLarekApi(API_URL);

const products = new ProductsModel(events);

const cart = new CartModel(events);

const buyer = new BuyerModel(events);

const header = new Header(events, ensureElement<HTMLElement>(".header"));
const gallery = new Gallery(ensureElement<HTMLElement>("main.gallery"));
const modal = new Modal(ensureElement<HTMLElement>(".modal"));

// Шаблоны
const tplCardGallery = ensureElement<HTMLTemplateElement>("#card-catalog");
const tplCardPreview = ensureElement<HTMLTemplateElement>("#card-preview");
const tplBasket = ensureElement<HTMLTemplateElement>("#basket");
const tplBasketItem = ensureElement<HTMLTemplateElement>("#card-basket");
const tplOrder = ensureElement<HTMLTemplateElement>("#order");
const tplContacts = ensureElement<HTMLTemplateElement>("#contacts");
const tplSuccess = ensureElement<HTMLTemplateElement>("#success");

const orderAddressPaymentView = new OrderAddressPayment(cloneTemplate(tplOrder), events);
const orderEmailPhoneView = new OrderEmailPhone(cloneTemplate(tplContacts), events);

const basketView = new BasketView(cloneTemplate(tplBasket), () =>
    events.emit(EVENTS.ORDER_ADDRESS_PAYMENT)
);

const orderSuccess = new OrderSuccess(cloneTemplate(tplSuccess), () => modal.close());

const cardPreviewView = new CardPreview(cloneTemplate(tplCardPreview), {
    onBuy: (id) => events.emit(EVENTS.CARD_BUY, { id }),
    onRemove: (id) => events.emit(EVENTS.CARD_REMOVE, { id, from: "preview" as const }),
});

// --- Presenter: функции ---

function handlePay() {
    if (Object.keys(buyer.validateEmailPhone()).length !== 0) return;

    const payload: IOrderPayload = {
        items: cart.getItems().map((i) => i.id),
        payment: buyer.getPayment() as TPayment,
        address: buyer.getAddress(),
        email: buyer.getEmail(),
        phone: buyer.getPhone(),
        total: cart.getTotal(),
    };

    api.postOrder(payload)
        .then((res) => {
            cart.clear();
            buyer.reset();

            // Сохраняем элемент, чтобы не делать двойной render
            const successElement = orderSuccess.render({ total: res.total });
            modal.open(successElement);
        })
        .catch((e) => {
            console.error("Ошибка оформления заказа:", e);
            // Добавляем уведомление пользователю
            alert("Не удалось оформить заказ. Попробуйте позже.");
        });
}

function openPreview() {
    const item = products.getSelectedProduct();
    if (!item) return;

    const previewElement = cardPreviewView.render({
        title: item.title,
        price: item.price,
        image: item.image,
        description: item.description,
        inCart: cart.has(item.id),
    });
    previewElement.dataset.id = item.id;
    modal.open(previewElement);
}

function renderGallery() {
    const cardElements = products.getItems().map((item: IProduct) => {
        const card = new CardCatalog(cloneTemplate(tplCardGallery), {  
            onClick: () => events.emit(EVENTS.CARD_SELECT, { id: item.id }),
        });
        return card.render({
            title: item.title,
            price: item.price,
            image: item.image,
            category: item.category,
            inCart: cart.has(item.id),
        });
    });
    gallery.catalog = cardElements;
}

function renderBasket() {
    const basketRows = cart.getItems().map((p, idx) => {
        const row = new CardInCart(cloneTemplate(tplBasketItem), {
            onRemove: () => events.emit(EVENTS.CARD_REMOVE, { id: p.id, from: "basket" as const }),
        });
        return row.render({
            index: idx + 1,
            title: p.title,
            price: p.price,
        });
    });

    basketView.render({
        items: basketRows,
        total: cart.getTotal(),
        empty: basketRows.length === 0,
    });
}

function openBasket() {
    const element = basketView.render(); // сохраняем результат render
    modal.open(element);
}

function openOrderAddressPayment() {
    if (!buyer.getPayment()) {
        buyer.setPayment('card' as TPayment);
    }

    const errors = buyer.validateAddressPayment();
    const renderedElement = orderAddressPaymentView.render({ 
        address: buyer.getAddress(),
        payment: buyer.getPayment()!,
        errors,
        valid: Object.keys(errors).length === 0,
    });
    modal.open(renderedElement);
}

function openOrderEmailPhone() {
    const errors = buyer.validateEmailPhone();
    orderEmailPhoneView.render({
        email: buyer.getEmail(),
        phone: buyer.getPhone(),
        errors,
        valid: Object.keys(errors).length === 0,
    });
    modal.open(orderEmailPhoneView.render());
}

// --- Event listeners ---

events.on(EVENTS.PRODUCTS_CHANGE_ITEMS, renderGallery);

events.on(EVENTS.PRODUCTS_CHANGE_SELECTED_ID, openPreview);

events.on(EVENTS.CART_CHANGE, () => {
    header.counter = cart.getCount();
    renderBasket();
});

events.on(EVENTS.BUYER_CHANGE, () => {
    const addrErr = buyer.validateAddressPayment();
    orderAddressPaymentView.render({
        errors: addrErr,
        valid: Object.keys(addrErr).length === 0,
        address: buyer.getAddress(),
        payment: buyer.getPayment() ?? undefined,
    });

    const contactErr = buyer.validateEmailPhone();
    orderEmailPhoneView.render({
        errors: contactErr,
        valid: Object.keys(contactErr).length === 0,
        email: buyer.getEmail(),
        phone: buyer.getPhone(),
    });
});

events.on<{ field: keyof IOrderForm; value: string }>(EVENTS.ORDER_INPUT_CHANGE, ({ field, value }) => {
    console.log('main.ts: ORDER_INPUT_CHANGE received', { field, value });  // ЛОГ: событие дошло?
    switch (field) {
        case "address":
            buyer.setAddress(value);
            break;
        case "email":
            buyer.setEmail(value);
            break;
        case "phone":
            buyer.setPhone(value);
            break;
        case "payment":
            buyer.setPayment(value as TPayment);
            break;
    }
});

events.on(EVENTS.BASKET_OPEN, openBasket);
events.on(EVENTS.ORDER_ADDRESS_PAYMENT, openOrderAddressPayment);

events.on(EVENTS.ORDER_ADDRESS_PAYMENT_NEXT, () => {
    if (Object.keys(buyer.validateAddressPayment()).length === 0) {
        openOrderEmailPhone();
    }
});

events.on(EVENTS.ORDER_EMAIL_PHONE_PAY, handlePay);

// Фикс типизации событий
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

events.on<{ id: string; from?: "preview" | "basket" }>(EVENTS.CARD_REMOVE, ({ id, from }) => {
    cart.remove(id);
    if (from === "preview") modal.close();
});

// Init

header.render({ counter: 0 });

(async () => {
    try {
        const items = await api.getProducts();
        products.setItems(items);
    } catch (e) {
        console.error("Не удалось загрузить каталог:", e);
        products.setItems([]);
    }
})();
