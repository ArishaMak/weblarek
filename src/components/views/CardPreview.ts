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
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  constructor(
  container: HTMLElement,
  actions?: ICardPreviewActions
) {
  super(container);

  this.titleElement = ensureElement<HTMLElement>(".card__title", container);
  this.imageElement = ensureElement<HTMLImageElement>(".card__image", container);
  this.descriptionElement = ensureElement<HTMLElement>(".card__text", container);
  this.buttonElement = ensureElement<HTMLButtonElement>(".card__button", container);
  this.priceElement = ensureElement<HTMLElement>(".card__price", container);

  this.buttonElement.addEventListener("click", () => {
    const id = this.id;
    if (this.buttonElement.dataset.action === "remove") {
      actions?.onRemove?.(id);
    } else {
      actions?.onBuy?.(id);
    }
  });
}

  get id(): string {
    return this.container.dataset.id || "";
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
    // Добавляем/убираем класс вместо dataset
    this.buttonElement.classList.toggle("in-cart", value);

    this.buttonElement.textContent = value
      ? "Удалить из корзины"
      : "Купить";
  }

  set price(value: number | null) {
    if (value === null) {
      this.priceElement.textContent = "Бесценно";
      this.buttonElement.disabled = true;
      this.buttonElement.textContent = "Недоступно";
    } else {
      this.priceElement.textContent = `${value} синапсов`;
      this.buttonElement.disabled = false;
    }
  }
}
