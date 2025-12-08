// src/components/views/CardGallery.ts

import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { CDN_URL } from "../../utils/constants";  

interface ICardGallery {
    title: string;
    price: number | null;
    image: string;
    category: string;
}

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class CardGallery extends Component<ICardGallery> {
    protected titleElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected priceElement: HTMLElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>('.card__title', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);

        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
        }
    }

    set title(value: string) {
        this.setText(this.titleElement, value);
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this.priceElement, 'Бесценно');
        } else {
            this.setText(this.priceElement, `${value} синапсов`);
        }
    }

    set image(value: string) {
        this.setImage(this.imageElement, `${CDN_URL}/${value}`);
    }

    set category(value: string) {
        this.setText(this.categoryElement, value);
        
        this.categoryElement.classList.remove(
            'card__category_soft',
            'card__category_other',
            'card__category_additional',
            'card__category_button',
            'card__category_hard'
        );

        const normalized = value.toLowerCase();

    switch (normalized) {
        case 'софт-скил':
        case 'soft skills':
            this.categoryElement.classList.add('card__category_soft');
            break;

        case 'другое':
        case 'other':
            this.categoryElement.classList.add('card__category_other');
            break;

        case 'дополнительное':
        case 'additional':
            this.categoryElement.classList.add('card__category_additional');
            break;

        case 'кнопка':
        case 'button':
            this.categoryElement.classList.add('card__category_button');
            break;

        default:
            this.categoryElement.classList.add('card__category_hard');
    }
    }
}