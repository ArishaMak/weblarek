// src/components/models/BuyerModel.ts

import type { IBuyer, TPayment } from "../../types";

type AddressPaymentErrors = { payment?: string; address?: string };
type EmailPhoneErrors = { email?: string; phone?: string };

export class BuyerModel {
    private payment: TPayment | null = null;
    private address: string = '';
    private email: string = '';
    private phone: string = '';

    constructor() {}

    // \Сеттеры
    public setPayment(payment: TPayment) {
        this.payment = payment;
    }

    public setAddress(address: string) {
        this.address = address.trim();
    }

    public setEmail(email: string) {
        this.email = email.trim();
    }

    public setPhone(phone: string) {
        this.phone = phone.trim();
    }

    /**
     * Возвращает все данные покупателя одним объектом типа IBuyer
     */
    public getData(): IBuyer {
        return {
            payment: this.payment!,
            address: this.address,
            email: this.email,
            phone: this.phone,
        };
    }

    public getPayment(): TPayment | null {
        return this.payment;
    }

    public getAddress(): string {
        return this.address;
    }

    public getEmail(): string {
        return this.email;
    }

    public getPhone(): string {
        return this.phone;
    }

    // ========== Очистка формы ==========
    public reset() {
        this.payment = null;
        this.address = '';
        this.email = '';
        this.phone = '';
    }

    // ========== Валидация ==========
    public validateAddressPayment(): AddressPaymentErrors {
        const errors: AddressPaymentErrors = {};

        if (!this.payment) {
            errors.payment = "Выберите способ оплаты";
        }
        if (!this.address) {
            errors.address = "Необходимо указать адрес";
        }

        return errors;
    }

    public validateEmailPhone(): EmailPhoneErrors {
        const errors: EmailPhoneErrors = {};

        if (!this.email) {
            errors.email = "Укажите email";
        }
        if (!this.phone) {
            errors.phone = "Укажите телефон";
        }

        return errors;
    }
}