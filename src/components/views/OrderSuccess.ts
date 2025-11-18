import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface IOrderSuccess {
  total: number;
}

export class OrderSuccess extends Component<IOrderSuccess> {
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, onClose: () => void) {
    super(container);
    this.descriptionElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container
    );
    this.buttonElement.type = "button";
    this.buttonElement.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    });
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}