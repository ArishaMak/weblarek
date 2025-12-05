// src/components/models/BuyerModel.ts

import type { IBuyer, TPayment } from "../../types";
import type { IEvents } from "../base/Events";
import { EVENTS } from "../base/eventNames"; 

type AddressPaymentErrors = { payment?: string; address?: string };
type EmailPhoneErrors = { email?: string; phone?: string };

export class BuyerModel {
    private payment: TPayment | null = null;
    private address: string = '';
    private email: string = '';
    private phone: string = '';
    private events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    // Сеттеры
    public setPayment(payment: TPayment) {
        this.payment = payment;
        this.events.emit(EVENTS.BUYER_CHANGE);
    }

    public setAddress(address: string) {
        this.address = address.trim();
        this.events.emit(EVENTS.BUYER_CHANGE);
    }

    public setEmail(email: string) {
        this.email = email.trim();
        this.events.emit(EVENTS.BUYER_CHANGE);
    }

    public setPhone(phone: string) {
        this.phone = phone.trim();
        this.events.emit(EVENTS.BUYER_CHANGE);
    }

    /**
     * Возвращает все данные покупателя
     */
    public getData(): IBuyer {
        return {
            payment: this.payment!,
            address: this.address,
            email: this.email,
            phone: this.phone,
        } as IBuyer; 
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

    public reset() {
        this.payment = null;
        this.address = '';
        this.email = '';
        this.phone = '';
        this.events.emit(EVENTS.BUYER_CHANGE);
    }

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
