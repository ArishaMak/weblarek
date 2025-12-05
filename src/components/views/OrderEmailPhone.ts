import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
// ИСПРАВЛЕНИЕ TS6133: Удален неиспользуемый импорт IOrderForm
// import { IOrderForm } from "../../types"; 

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

        // Используем безопасный поиск
        this.emailInput = container.querySelector<HTMLInputElement>('input[name="email"]') || undefined;
        this.phoneInput = container.querySelector<HTMLInputElement>('input[name="phone"]') || undefined;
        this.nextButton = container.querySelector<HTMLButtonElement>('.button') || undefined;
        
        // Предполагаем, что ошибки находятся в .form__errors или используем более конкретный селектор
        this.emailErrorElement = container.querySelector<HTMLElement>('.form__errors_email') || undefined;
        this.phoneErrorElement = container.querySelector<HTMLElement>('.form__errors_phone') || undefined;


        if (this.emailInput) {
            this.emailInput.addEventListener('input', (evt: Event) => {
                const target = evt.target as HTMLInputElement;
                this.events.emit('ORDER_INPUT_CHANGE', { field: 'email', value: target.value });
            });
        }
        
        if (this.phoneInput) {
            this.phoneInput.addEventListener('input', (evt: Event) => {
                const target = evt.target as HTMLInputElement;
                this.events.emit('ORDER_INPUT_CHANGE', { field: 'phone', value: target.value });
            });
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => {
                this.events.emit('ORDER_EMAIL_PHONE_PAY');
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