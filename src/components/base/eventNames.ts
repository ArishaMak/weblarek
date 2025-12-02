// src/components/base/eventNames.ts

export const EVENTS = {
    
    // События Моделей (Model -> Presenter)
    PRODUCTS_CHANGE_ITEMS: "products:change:items", 
    PRODUCTS_CHANGE_SELECTED_ID: "products:change:selectedId", 
    
    CART_CHANGE: "cart:change",
    BUYER_CHANGE: "buyer:change",

    // События UI (View -> Presenter)
    CARD_SELECT: "card:select",
    CARD_BUY: "card:buy",
    CARD_REMOVE: "card:remove",
    BASKET_OPEN: "basket:open",
    
    // События форм заказа
    ORDER_ADDRESS_PAYMENT: "order:address:payment", 
    ORDER_INPUT_CHANGE: "order:input:change", 
    ORDER_ADDRESS_PAYMENT_NEXT: "order:address:payment:next",
    ORDER_EMAIL_PHONE_PAY: "order:email:phone:pay",
    
    MODAL_OPENED: "modal:open",
    MODAL_CLOSED: "modal:close",
} as const;

export const isFormChange = (event: string) => /^order:/.test(event);