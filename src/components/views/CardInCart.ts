import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";

export type TCardInCart = { index: number };
export class CardInCart extends Card<TCardInCart> {
  protected indexElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: { onRemove?: () => void }) {
    super(container);
    this.indexElement = ensureElement(".basket__item-index", this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container
    );
    if (actions?.onRemove)
      this.buttonElement.addEventListener("click", actions.onRemove);
  }
  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}