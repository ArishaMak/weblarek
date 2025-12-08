import { Component } from "../base/Component";
import type { IEvents } from "../base/Events";
import { EVENTS } from "../base/eventNames";
import type { TPayment } from "../../types";

interface IOrderAddressPaymentView {
    address: string;
    payment: TPayment;
    errors: Partial<Record<'payment' | 'address', string>>;
    valid: boolean;
}

export class OrderAddressPayment extends Component<IOrderAddressPaymentView> {
    protected cardButton?: HTMLButtonElement;
    protected cashButton?: HTMLButtonElement;
    protected addressInput?: HTMLInputElement;
    protected nextButton?: HTMLButtonElement;
    protected paymentErrorElement?: HTMLElement;
    protected addressErrorElement?: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.cardButton = container.querySelector<HTMLButtonElement>('.button[name="card"]') || undefined;
        this.cashButton = container.querySelector<HTMLButtonElement>('.button[name="cash"]') || undefined;
        this.addressInput = container.querySelector<HTMLInputElement>('input[name="address"]') || undefined;
        this.nextButton = container.querySelector<HTMLButtonElement>('.order__button') || undefined;
        
        // Первоначально кнопка "Далее" должна быть отключена
        if (this.nextButton) this.nextButton.disabled = true;

        this.paymentErrorElement = container.querySelector<HTMLElement>('.form__errors_payment') || undefined;
        this.addressErrorElement = container.querySelector<HTMLElement>('.form__errors_address') || undefined;

        // Обработчики (ИСПРАВЛЕНЫ: используем EVENTS)
        
        if (this.cardButton) {
            this.cardButton.addEventListener('click', () => {
                this.events.emit(EVENTS.ORDER_INPUT_CHANGE, { field: 'payment', value: 'card' });
            });
        }
        
        if (this.cashButton) {
            this.cashButton.addEventListener('click', () => {
                this.events.emit(EVENTS.ORDER_INPUT_CHANGE, { field: 'payment', value: 'cash' });
            });
        }
        
        if (this.addressInput) {
            this.addressInput.addEventListener('input', (evt: Event) => {
                const target = evt.target as HTMLInputElement;
                this.events.emit(EVENTS.ORDER_INPUT_CHANGE, {
                    field: 'address',
                    value: target.value,
                });
            });
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => {
                this.events.emit(EVENTS.ORDER_ADDRESS_PAYMENT_NEXT);
            });
        }
    }

    set address(value: string) {
        if (this.addressInput) this.addressInput.value = value;
    }

    set payment(value: TPayment | null) {
        if (this.cardButton)
            this.toggleClass(this.cardButton, 'button_alt-active', value === 'card');

        if (this.cashButton)
            this.toggleClass(this.cashButton, 'button_alt-active', value === 'cash');
    }

    set valid(value: boolean) {
        if (this.nextButton) this.nextButton.disabled = !value;
    }

    set errors(value: Partial<Record<'payment' | 'address', string>>) {
        // Показываем отдельно ошибки для payment и address (если элементы есть)
        const paymentError = value.payment ?? '';
        const addressError = value.address ?? '';

        if (this.paymentErrorElement) this.setText(this.paymentErrorElement, paymentError);
        if (this.addressErrorElement) this.setText(this.addressErrorElement, addressError);
    }
}