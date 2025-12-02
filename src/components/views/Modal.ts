// src/components/common/Modal.ts

import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface IModal { 
    content: HTMLElement | null;
    open: boolean;
}

export class Modal extends Component<IModal> {
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;

    // Обработчик остается, но теперь он будет добавляться/удаляться в open/close
    private onEsc = (e: KeyboardEvent) => {
    if (
    e.key === "Escape" &&
    this.container.classList.contains("modal_active")) {
    this.close();
    }
};

    constructor(container: HTMLElement) {
    super(container);
    this.closeButton = ensureElement<HTMLButtonElement>(
    ".modal__close",
    this.container
    );
    this.contentElement = ensureElement<HTMLElement>(
    ".modal__content",
    this.container
);

    this.closeButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.close();
});

    this.container.addEventListener("click", (e) => {
    // Закрытие при клике на оверлей
    if (e.target === this.container) this.close();
});

}
    set content(value: HTMLElement | null) {
    this.contentElement.replaceChildren(...(value ? [value] : []));
}

    open(content?: HTMLElement) {
    if (content) this.content = content;
    this.container.classList.add("modal_active");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", this.onEsc);
}

    close() {
    this.container.classList.remove("modal_active");
    document.body.style.overflow = "";

    document.removeEventListener("keydown", this.onEsc);
}
}