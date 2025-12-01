import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import { CDN_URL } from "../../utils/constants";

export type TCardPreview = {
  image: string;
  description: string;
  inCart: boolean;
};
export class CardPreview extends Card<TCardPreview> {
  protected imageElement: HTMLImageElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    actions?: { onBuy?: () => void; onRemove?: () => void }
  ) {
    super(container);
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );
    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container
    );

    this.buttonElement.addEventListener("click", () => {
      if (this.buttonElement.dataset.action === "remove") actions?.onRemove?.();
      else actions?.onBuy?.();
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
    super.price = value;
    this.buttonElement.disabled = value === null;
    if (value === null) this.buttonElement.textContent = "Недоступно";
  }
}