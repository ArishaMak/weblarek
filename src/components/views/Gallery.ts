import { Component } from "../base/Component";

export interface IGallery {
  catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
  protected catalogElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.catalogElement = this.container;
  }

  set catalog(items: HTMLElement[]) {
    const nodes = items.map((el) => {
      if (!el.classList.contains("gallery__item")) {
        el.classList.add("gallery__item");
      }
      return el;
    });

    this.catalogElement.replaceChildren(...nodes);
  }
}