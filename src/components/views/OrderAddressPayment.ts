// src/components/views/OrderAddressPayment.ts

import { Component } from "../base/Component";
import type { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { EVENTS } from "../base/eventNames"; 
import type { TPayment } from "../../types";

interface IOrderAddressPaymentView {
  address: string;
  payment: TPayment;
  // Тип ошибок указывает, что поля могут отсутствовать или быть строкой
  errors: Partial<Record<'payment' | 'address', string>>; 
  valid: boolean;
}

export class OrderAddressPayment extends Component<IOrderAddressPaymentView> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;
  protected nextButton: HTMLButtonElement;
  protected paymentErrorElement: HTMLElement;
  protected addressErrorElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    
    this.cardButton = ensureElement<HTMLButtonElement>('.button_card', container);
    this.cashButton = ensureElement<HTMLButtonElement>('.button_cash', container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
    this.nextButton = ensureElement<HTMLButtonElement>('.order__button', container);
    
    // Убедитесь, что эти элементы существуют в вашем HTML
    this.paymentErrorElement = ensureElement<HTMLElement>('.form__errors_payment', container); 
    this.addressErrorElement = ensureElement<HTMLElement>('.form__errors_address', container); 
    
    // --- Обработчики нажатия кнопок оплаты ---
    this.cardButton.addEventListener('click', () => {
      this.events.emit(EVENTS.ORDER_INPUT_CHANGE, { field: 'payment', value: 'card' });
    });
    this.cashButton.addEventListener('click', () => {
      this.events.emit(EVENTS.ORDER_INPUT_CHANGE, { field: 'payment', value: 'cash' });
    });
    
    // --- Обработчик ввода адреса ---
    this.addressInput.addEventListener('input', (evt: Event) => {
      const target = evt.target as HTMLInputElement;
      this.events.emit(EVENTS.ORDER_INPUT_CHANGE, {
        field: 'address',
        value: target.value,
      });
    });
    
    this.nextButton.addEventListener('click', () => {
      this.events.emit(EVENTS.ORDER_ADDRESS_PAYMENT_NEXT);
    });
  }
  
  // Установка значения поля адреса
  set address(value: string) {
    this.addressInput.value = value;
  }

  // Переключение активной кнопки оплаты
  set payment(value: TPayment) {
    this.toggleClass(this.cardButton, 'button_alt-active', value === 'card');
    this.toggleClass(this.cashButton, 'button_alt-active', value === 'cash');
  }

  // Активация/деактивация кнопки "Далее"
  set valid(value: boolean) {
    this.nextButton.disabled = !value;
  }
  
  // Установка текста ошибок
  set errors(value: Partial<Record<'payment' | 'address', string>>) {
    this.setText(this.paymentErrorElement, value.payment ?? null);
    this.setText(this.addressErrorElement, value.address ?? null);
  }
}