import { Component } from "../base/Component";
import type { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

const EVENTS = {
  BASKET_OPEN: "basket:open" as const,
};

export interface IHeader {
  counter: number;
}

export class Header extends Component<IHeader> {
  protected counterElement: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container
    );
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container
    );
    this.basketButton.addEventListener("click", () =>
      this.events.emit(EVENTS.BASKET_OPEN)
    );
  }

  set counter(value: number) {
    // Логика проверки и установки значения счетчика остается в сеттере
    const safeValue = isNaN(value) || value < 0 ? 0 : value;
    this.counterElement.textContent = String(safeValue);
 }
}