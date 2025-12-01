import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface ICardActions {
  onClick?: () => void;
  onRemove?: () => void;
  onBuy?: () => void;
}
export type TCardBase = { title: string; price: number | null };

export class Card<T extends object = {}> extends Component<T & TCardBase> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected buttonElement?: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    this.titleElement = ensureElement(".card__title", this.container);
    this.priceElement = ensureElement(".card__price", this.container);

    if (actions?.onClick) {
      this.container.addEventListener("click", (e) => {
        const targetBtn = (e.target as HTMLElement).closest("button");
        if (targetBtn && targetBtn !== this.container) return;
        actions.onClick?.();
      });
    }
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }
  set price(value: number | null) {
    this.priceElement.textContent =
      value === null ? "Бесценно" : `${value} синапсов`;
  }
}