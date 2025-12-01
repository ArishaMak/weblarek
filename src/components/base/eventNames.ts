export const EVENTS = {
  CATALOG_CHANGED: "catalog:changed",
  CART_CHANGED: "cart:changed",
  SELECT_CHANGED: "change:selectedId", // Согласованно с main.ts
  BUYER_CHANGED: "buyer:change",

  CARD_SELECT: "card:select",
  CARD_BUY: "card:buy",
  CARD_REMOVE: "card:remove",
  BASKET_OPEN: "basket:open",
  BASKET_CHECKOUT: "basket:checkout",
  ORDER_ADDRESS_PAYMENT_NEXT: "order:address:payment:next",
  ORDER_EMAIL_PHONE_PAY: "order:email:phone:pay",
  FORM_CHANGE: "form:change",
  MODAL_OPENED: "modal:open",
  MODAL_CLOSED: "modal:close",
} as const;

export const isFormChange = (event: string) => /^form:/.test(event);