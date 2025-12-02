// src/components/views/OrderEmailPhone.ts

import { Component } from "../base/Component";
import type { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { EVENTS } from "../base/eventNames"; 

interface IOrderEmailPhoneView {
    email: string;
    phone: string;
    errors: Partial<Record<'email' | 'phone', string>>;
    valid: boolean;
}

export class OrderEmailPhone extends Component<IOrderEmailPhoneView> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
    protected payButton: HTMLButtonElement;
    protected emailErrorElement: HTMLElement;
    protected phoneErrorElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
        this.payButton = ensureElement<HTMLButtonElement>('.order__button', container);
        
        this.emailErrorElement = ensureElement<HTMLElement>('.email-error', container);
        this.phoneErrorElement = ensureElement<HTMLElement>('.phone-error', container);

        this.emailInput.addEventListener('input', (evt: Event) => {
            const target = evt.target as HTMLInputElement;
            this.events.emit(EVENTS.ORDER_INPUT_CHANGE, {
                field: 'email',
                value: target.value,
            });
        });

        this.phoneInput.addEventListener('input', (evt: Event) => {
            const target = evt.target as HTMLInputElement;
            this.events.emit(EVENTS.ORDER_INPUT_CHANGE, {
                field: 'phone',
                value: target.value,
            });
        });

        this.payButton.addEventListener('click', () => {
            this.events.emit(EVENTS.ORDER_EMAIL_PHONE_PAY);
        });
    }
    
    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }

    set valid(value: boolean) {
        this.payButton.disabled = !value;
    }
    
    set errors(value: Partial<Record<'email' | 'phone', string>>) {
        this.setText(this.emailErrorElement, value.email);
        this.setText(this.phoneErrorElement, value.phone);
    }
}