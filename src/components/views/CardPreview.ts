import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import { CDN_URL } from "../../utils/constants";

export type TCardPreview = {
  image: string;
  description: string;
  inCart: boolean;
  price: number | null;
};

interface ICardPreviewActions {
  onBuy?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export class CardPreview extends Card<TCardPreview> {
  protected imageElement: HTMLImageElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  protected titleElement: HTMLElement;   // ← ДОБАВЛЕНО

  get id(): string {
    return this.container.dataset.id || '';
  }

  constructor(container: HTMLElement, actions?: ICardPreviewActions) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>(".card__title", container);   // ← ДОБАВЛЕНО
    this.imageElement = ensureElement<HTMLImageElement>(".card__image", container);
    this.descriptionElement = ensureElement<HTMLElement>(".card__text", container);
    this.buttonElement = ensureElement<HTMLButtonElement>(".card__button", container);

    this.buttonElement.addEventListener("click", () => {
      const id = this.id;
      if (this.buttonElement.dataset.action === "remove") {
        actions?.onRemove?.(id);
      } else {
        actions?.onBuy?.(id);
      }
    });
  }

  set image(value: string) {
    this.setImage(
      this.imageElement,
      `${CDN_URL}/${value}`,
      this.titleElement.textContent || ""
    );
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set inCart(value: boolean) {
    this.buttonElement.dataset.action = value ? "remove" : "buy";
    this.buttonElement.textContent = value ? "Удалить из корзины" : "Купить";
  }

  set price(value: number | null) {
  if (value === null) {
    this.buttonElement.disabled = true;
    this.buttonElement.textContent = "Недоступно";
  } else {
    const priceEl = this.container.querySelector(".card__price");
    if (priceEl) priceEl.textContent = `${value} синапсов`;
    this.buttonElement.disabled = false;
  }
}
}
