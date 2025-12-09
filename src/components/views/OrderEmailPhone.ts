import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { EVENTS } from "../base/eventNames";

interface IOrderEmailPhoneView {
    email: string;
    phone: string;
    errors: Partial<Record<'email' | 'phone', string>>;
    valid: boolean;
}

export class OrderEmailPhone extends Component<IOrderEmailPhoneView> {
    protected emailInput?: HTMLInputElement;
    protected phoneInput?: HTMLInputElement;
    protected nextButton?: HTMLButtonElement;
    protected emailErrorElement?: HTMLElement;
    protected phoneErrorElement?: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.emailInput = container.querySelector<HTMLInputElement>('input[name="email"]') || undefined;
        this.phoneInput = container.querySelector<HTMLInputElement>('input[name="phone"]') || undefined;
        this.nextButton = container.querySelector<HTMLButtonElement>('.button') || undefined;
        
        // Отключаем кнопку по умолчанию
        if (this.nextButton) this.nextButton.disabled = true;
        
        // Конкретные селекторы ошибок + fallback
        this.emailErrorElement = container.querySelector<HTMLElement>('.form__errors_email')
            || container.querySelector<HTMLElement>('.form__errors') || undefined;
        this.phoneErrorElement = container.querySelector<HTMLElement>('.form__errors_phone')
            || container.querySelector<HTMLElement>('.form__errors') || undefined;

        if (this.emailInput) {
            this.emailInput.addEventListener('input', (evt: Event) => {
                const target = evt.target as HTMLInputElement;
                this.events.emit(EVENTS.ORDER_INPUT_CHANGE, { field: 'email', value: target.value });  // ← ИСПРАВЛЕНО
            });
        }
        
        if (this.phoneInput) {
            this.phoneInput.addEventListener('input', (evt: Event) => {
                const target = evt.target as HTMLInputElement;
                this.events.emit(EVENTS.ORDER_INPUT_CHANGE, { field: 'phone', value: target.value });  // ← ИСПРАВЛЕНО
            });
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', (e) => {
            e.preventDefault();         
            this.events.emit(EVENTS.ORDER_EMAIL_PHONE_PAY);
        });
}

    }

    set email(value: string) {
        if (this.emailInput) this.emailInput.value = value;
    }

    set phone(value: string) {
        if (this.phoneInput) this.phoneInput.value = value;
    }

    set valid(value: boolean) {
        if (this.nextButton) this.nextButton.disabled = !value;
    }

    set errors(value: Partial<Record<'email' | 'phone', string>>) {
        if (this.emailErrorElement) this.setText(this.emailErrorElement, value.email ?? '');
        if (this.phoneErrorElement) this.setText(this.phoneErrorElement, value.phone ?? '');
    }
}