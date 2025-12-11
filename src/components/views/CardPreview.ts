import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import { CDN_URL } from "../../utils/constants";

export type TCardPreview = {
  image: string;
  description: string;
  inCart: boolean;
  price: number | null;
};

// ФИКС: Расширяем интерфейс — добавляем onToggle (убираем onBuy/onRemove, т.к. toggle заменяет их)
interface ICardPreviewActions {
  onToggle?: (id: string) => void;  // Единственный callback: модель решит add/remove
}

export class CardPreview extends Card<TCardPreview> {
  protected imageElement: HTMLImageElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardPreviewActions) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>(".card__title", container);
    this.imageElement = ensureElement<HTMLImageElement>(".card__image", container);
    this.descriptionElement = ensureElement<HTMLElement>(".card__text", container);
    this.buttonElement = ensureElement<HTMLButtonElement>(".card__button", container);
    this.priceElement = ensureElement<HTMLElement>(".card__price", container);

    // ФИКС: Упрощаем клик — всегда toggle (без проверки dataset)
    this.buttonElement.addEventListener("click", () => {
      const id = this.id;
      actions?.onToggle?.(id);  // Модель (cart) решит: add или remove
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

  // ФИКС: Убираем dataset.action — не нужно для toggle
  set inCart(value: boolean) {
    this.buttonElement.classList.toggle("in-cart", value);
    this.buttonElement.textContent = value ? "Удалить из корзины" : "Купить";
    // Если нужно, можно добавить aria-label или title для доступности, но dataset не требуется
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