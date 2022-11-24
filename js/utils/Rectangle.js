import { Vector } from "./Vector";

export class Rectangle {
  constructor(x = 0, y = 0, w = 0, h = 0) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }

  set(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;

    return this;
  }

  copyFrom(rect) {
    this.x = rect.x;
    this.y = rect.y;
    this.width = rect.width;
    this.height = rect.height;

    return this;
  }

  copyTo(rect) {
    rect.x = this.x;
    rect.y = this.y;
    rect.width = this.width;
    rect.height = this.height;

    return rect;
  }

  get left() {
    return this.x;
  }

  set left(left) {
    this.x = left;
  }

  get right() {
    return this.x + this.width;
  }


  set right(right) {
    this.x = right - this.width;
  }

  get top() {
    return this.y;
  }

  set top(top) {
    this.y = top;
  }

  get bottom() {
    return this.y + this.height;
  }

  set bottom(bottom) {
    this.y = bottom - this.height;
  }

  get topLeft() {
    return new Vector(this.x, this.y);
  }

  set topLeft(vector) {
    this.left = vector.x;
    this.top = vector.y;
  }

  get topRight() {
    return new Vector(this.right, this.y);
  }

  set topRight(vector) {
    this.right = vector.x;
    this.top = vector.y;
  }

  get bottomRight() {
    return new Vector(this.right, this.bottom);
  }

  set bottomRight(vector) {
    this.right = vector.x;
    this.bottom = vector.y;
  }

  get bottomLeft() {
    return new Vector(this.x, this.bottom);
  }

  set bottomLeft(vector) {
    this.x = vector.x;
    this.bottom = vector.y;
  }

  size(outVector = undefined) {
    outVector = outVector || new Vector();
    return outVector.set(this.width, this.height);
  }

  containsXY(x, y) {
    return x >= this.x && x <= this.right && y >= this.y && y <= this.bottom;
  }

  contains(rect) {
    return rect.x >= this.x && rect.y >= this.y && rect.right <= this.right && rect.bottom <= this.bottom;
  }

  intersects(rect) {
    return rect.right > this.x && rect.bottom > this.y &&
      rect.x < this.right && rect.y < this.bottom;
  }

  intersection(toIntersect, outRect) {
    outRect = outRect || new Rectangle();

    let x0 = this.x < toIntersect.x ? toIntersect.x : this.x;
    let x1 = this.right > toIntersect.right ? toIntersect.right : this.right;

    if (x1 <= x0)
      return new Rectangle();

    let y0 = this.y < toIntersect.y ? toIntersect.y : this.y;
    let y1 = this.bottom > toIntersect.bottom ? toIntersect.bottom : this.bottom;

    if (y1 <= y0)
      return new Rectangle();

    outRect.set(x0, y0, x1 - x0, y1 - y0);
    return outRect;
  }

  clone() {
    return new Rectangle(this.x, this.y, this.width, this.height);
  }

  center(outVector = undefined) {
    outVector = outVector || new Vector();
    return outVector.set(this.x + this.width * 0.5, this.y + this.height * 0.5);
  }

  get centerX() {
    return this.x + this.width * 0.5;
  }

  set centerX(val) {
    this.x = val - this.width * 0.5;
  }

  get centerY() {
    return this.y + this.height * 0.5;
  }

  set centerY(val) {
    this.y = val - this.height * 0.5;
  }
}

Rectangle.__cache = new Rectangle();