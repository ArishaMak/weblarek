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

    this.buttonElement = this.container.querySelector('.card__button') as HTMLButtonElement | undefined;
    
    if (actions?.onClick) {
      this.container.addEventListener("click", (e) => {
        const targetBtn = (e.target as HTMLElement).closest("button");
        // Игнорируем клик, если он был по вложенной кнопке (если кнопка найдена)
        if (targetBtn && targetBtn !== this.container) return; 
        actions.onClick?.();
      });
    }

    // Добавляем обработчик для найденной кнопки, если она существует
    if (this.buttonElement && actions?.onBuy) {
        this.buttonElement.addEventListener("click", actions.onBuy);
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