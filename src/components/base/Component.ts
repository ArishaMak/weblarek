// src/components/base/Component.ts

export abstract class Component<T> {
    protected readonly container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    // Метод для переключения состояния видимости
    protected toggleClass(element: HTMLElement, className: string, force?: boolean) {
        element.classList.toggle(className, force);
    }

    // Метод для установки текстового содержимого
    protected setText(element: HTMLElement, value: string | number | null): void {
        element.textContent = String(value ?? '');
    }

    // Метод для установки изображения
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        element.src = src;
        if (alt) {
            element.alt = alt;
        }
    }

    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}