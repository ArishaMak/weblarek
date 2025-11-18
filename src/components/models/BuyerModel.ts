// src/components/models/BuyerModel.ts

import type { TPayment } from "../../types";

type AddressPaymentErrors = { payment?: string; address?: string };
type EmailPhoneErrors = { email?: string; phone?: string };

export class BuyerModel {
    private payment: TPayment | undefined;
    private address: string = '';
    private email: string = '';
    private phone: string = '';

    constructor() {} 

    public setPayment(payment: TPayment) {
        this.payment = payment;
    }
    public getPayment(): TPayment | undefined {
        return this.payment;
    }

    public setAddress(address: string) {
        this.address = address;
    }
    public getAddress(): string {
        return this.address;
    }

    public setEmail(email: string) {
        this.email = email;
    }
    public getEmail(): string {
        return this.email;
    }

    public setPhone(phone: string) {
        this.phone = phone;
    }
    public getPhone(): string {
        return this.phone;
    }

    public reset() {
        this.payment = undefined; 
        this.address = '';
        this.email = '';
        this.phone = '';
    }

    public validateAddressPayment(): AddressPaymentErrors {
        const errors: AddressPaymentErrors = {};
        if (!this.payment) errors.payment = "Выберите способ оплаты"; 
        if (!this.address || !this.address.trim())
            errors.address = "Необходимо указать адрес";
        return errors;
    }

    public validateEmailPhone(): EmailPhoneErrors {
        const errors: EmailPhoneErrors = {};
        if (!this.email || !this.email.trim()) errors.email = "Укажите email";
        if (!this.phone || !this.phone.trim()) errors.phone = "Укажите телефон";
        return errors;
    }
}