import { ElementParameters } from '../types/default';
import { Tags, Events, InsertPositions } from '../types/dom-types/enums';
import { AnimationParams } from '../types/dom-types/types';

export default class BaseComponent<T extends HTMLElement> {
  protected element: T;

  public static FromHTML<T extends HTMLElement>(html: string): BaseComponent<T> {
    const template = document.createElement(Tags.Template);
    template.insertAdjacentHTML(InsertPositions.Prepend, html);
    const element = template.firstChild as T;
    const component = new BaseComponent<T>({ tag: element.tagName });
    component.element = element;
    return component;
  }

  public static FromElement<T extends HTMLElement>(element: T): BaseComponent<T> {
    const component = new BaseComponent<T>({});
    component.element = element;
    return component;
  }

  public constructor({ tag = Tags.Div, textContent, classList, attributes, parent }: Partial<ElementParameters>) {
    this.element = document.createElement(tag) as T;

    if (textContent) this.element.innerText = textContent;

    if (classList) this.addClass(...classList);

    if (attributes) {
      for (const attribute in attributes) this.setAttribute(attribute, attributes[attribute]);
    }

    if (parent instanceof Node) parent.appendChild(this.element);
    if (parent instanceof BaseComponent) parent.append(this.element);
  }

  public get HTML(): string {
    return this.element.outerHTML;
  }

  public get textContent(): string {
    return this.element.innerText;
  }

  public set textContent(value: string) {
    this.element.innerText = value;
  }

  public insertBeforeNode(node: Node) {
    node.parentNode?.insertBefore(this.element, node);
  }

  public append(...elements: (HTMLElement | BaseComponent<HTMLElement>)[]): void {
    elements.forEach((element) => {
      if (element instanceof BaseComponent) this.element.append(element.element);
      else this.element.append(element);
    });
  }

  public clear(): void {
    this.element.innerHTML = '';
  }

  public addClass(...classNames: string[]): void {
    classNames.forEach((className) => this.element.classList.add(className));
  }

  public removeClass(...classNames: string[]): void {
    classNames.forEach((className) => this.element.classList.remove(className));
  }

  public checkSelectorMatch(selector: string): boolean {
    try {
      return this.element.matches(selector);
    } catch {
      return false;
    }
  }

  public setAttribute(attributeName: string, attributeValue: string): void {
    this.element.setAttribute(attributeName, attributeValue);
  }

  public removeAttribute(attributeName: string): void {
    this.element.removeAttribute(attributeName);
  }

  public addEventListener(event: Events, listener: (e: Event) => void): void {
    this.element.addEventListener(event, listener);
  }

  public removeEventListener(event: Events, listener: (e: Event) => void): void {
    this.element.removeEventListener(event, listener);
  }

  public addText(text: string) {
    this.element.append(document.createTextNode(text));
  }

  public destroy(): void {
    this.element.remove();
  }

  public showAnimation({ name, duration, timingFunction = 'ease-in-out', repeatCount = 1 }: AnimationParams): void {
    this.element.setAttribute(
      'style',
      `${this.element.style.cssText} animation: ${name} ${duration}ms ${timingFunction} ${repeatCount} !important;  transform-origin: center;`
    );
    setTimeout(() => {
      this.element.style.animation = '';
      this.element.style.transformOrigin = '';
    }, duration);
  }
}
