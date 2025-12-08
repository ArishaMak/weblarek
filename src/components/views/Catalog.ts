import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import { CDN_URL, categoryMap } from "../../utils/constants";

export type TCardCatalog = { 
    image: string; 
    category: string;
    price: number | null;
    inCart: boolean;
};

type CategoryKey = keyof typeof categoryMap;

export class CardCatalog extends Card<TCardCatalog> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement, actions?: { onClick?: () => void }) {
        super(container, actions);
        this.categoryElement = ensureElement<HTMLElement>(
            ".card__category",
            this.container
        );
        this.imageElement = ensureElement<HTMLImageElement>(
            ".card__image",
            this.container
        );
        this.priceElement = ensureElement<HTMLElement>(".card__price", this.container);
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        for (const key in categoryMap) {
            this.categoryElement.classList.toggle(
                categoryMap[key as CategoryKey],
                key === value
            );
        }
    }

    set image(value: string) {
        this.setImage(
            this.imageElement,
            `${CDN_URL}/${value}`,
            this.titleElement.textContent || ""
        );
    }

    set price(value: number | null) {
    if (!this.priceElement) return;

    const button = this.container as HTMLButtonElement;

    if (value === null) {
        this.priceElement.textContent = "Недоступно";
        button.disabled = true; 
        this.toggleClass(this.container, "unavailable", true);
    } else {
        this.priceElement.textContent = `${value} синапсов`;
        button.disabled = false;
        this.toggleClass(this.container, "unavailable", false);
    }
  }

    set inCart(value: boolean) {
    if (!this.priceElement) return;

    if (value) {
        this.priceElement.textContent = "В корзине";
        this.toggleClass(this.container, "in-cart", true);
    } else {
        this.toggleClass(this.container, "in-cart", false);
        // Цена обновится при вызове set price в рендере
    }
  }
}