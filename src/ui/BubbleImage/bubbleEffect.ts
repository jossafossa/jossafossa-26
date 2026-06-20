// Imperative effect; refactor to an idiomatic React hook later.
// Clones the root's child image nodes into stacked `.inner` layers, reveals the
// current one through a pointer-following clip-path circle, and on pointer-down grows
// it to fill (.is-active) while the next begins revealing. destroy() tears down
// listeners / rAF / clones for effect cleanup.

class SmoothBuffer {
  private buffer: number[] = [];
  constructor(private size: number) {}
  smooth(value: number): number {
    this.buffer.push(value);
    if (this.buffer.length > this.size) this.buffer.shift();
    const sum = this.buffer.reduce((a, c) => a + c);
    return sum / this.buffer.length;
  }
}

class SmoothVectorBuffer {
  private x: SmoothBuffer;
  private y: SmoothBuffer;
  constructor(size: number) {
    this.x = new SmoothBuffer(size);
    this.y = new SmoothBuffer(size);
  }
  smooth({ x, y }: { x: number; y: number }) {
    return { x: this.x.smooth(x), y: this.y.smooth(y) };
  }
}

export type BubbleImageClasses = {
  bubbleImage: string;
  inner: string;
  isActive: string;
};

export class BubbleImageFx {
  private images: Element[];
  private next = 1;
  private positions = new SmoothVectorBuffer(10);
  private pos = { x: 0, y: 0 };
  private image!: HTMLElement;
  private lastImage?: HTMLElement;
  private frame = 0;
  private clones = new Set<HTMLElement>();
  private timers = new Set<number>();
  private onMove = (e: PointerEvent) => this.setPos(e);
  private onDown = () => this.spawnNext();

  constructor(
    private root: HTMLElement,
    private classes: BubbleImageClasses,
  ) {
    this.images = [...root.children];
    this.init();
    this.loop();
    document.addEventListener('pointermove', this.onMove);
    document.addEventListener('pointerdown', this.onDown);
  }

  private init() {
    this.root.classList.add(this.classes.bubbleImage);
    this.pos = this.getRandomPos();
    this.image = this.spawn(this.pos);
    this.spawnNext();
  }

  private loop() {
    this.update();
    this.frame = requestAnimationFrame(() => this.loop());
  }

  private update() {
    const pos = this.positions.smooth(this.pos);
    this.move(this.image, pos);
  }

  private setPos(e: PointerEvent) {
    const box = this.root.getBoundingClientRect();
    this.pos = { x: e.clientX - box.left, y: e.clientY - box.top };
  }

  private spawnNext() {
    this.grow(this.image);
    this.image = this.spawn(this.pos);
  }

  private getNext(): HTMLElement {
    this.next = (this.next + 1) % this.images.length;
    const element = this.images[this.next].cloneNode(true) as HTMLElement;
    element.classList.add(this.classes.inner);
    return element;
  }

  private getRandomPos() {
    const box = this.root.getBoundingClientRect();
    return { x: Math.random() * box.width, y: Math.random() * box.height };
  }

  private spawn(pos: { x: number; y: number }): HTMLElement {
    const image = this.getNext();
    this.root.append(image);
    this.clones.add(image);
    this.move(image, pos);
    return image;
  }

  private move(image: HTMLElement, pos: { x: number; y: number }) {
    image.style.setProperty('--x', `${pos.x}px`);
    image.style.setProperty('--y', `${pos.y}px`);
  }

  private grow(image: HTMLElement) {
    image.classList.add(this.classes.isActive);
    image.style.removeProperty('--x');
    image.style.removeProperty('--y');
    this.lastImage = image;
    const id = window.setTimeout(() => {
      this.timers.delete(id);
      if (this.lastImage !== image) {
        image.remove();
        this.clones.delete(image);
      }
    }, 5000);
    this.timers.add(id);
  }

  destroy() {
    document.removeEventListener('pointermove', this.onMove);
    document.removeEventListener('pointerdown', this.onDown);
    cancelAnimationFrame(this.frame);
    for (const id of this.timers) clearTimeout(id);
    for (const clone of this.clones) clone.remove();
    this.clones.clear();
    this.root.classList.remove(this.classes.bubbleImage);
  }
}
