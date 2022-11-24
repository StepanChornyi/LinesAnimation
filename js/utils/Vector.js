export class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x = 0, y = 0) {
    this.x = x;
    this.y = y;

    return this;
  }

  add(vector) {
    this.x += vector.x;
    this.y += vector.y;

    return this;
  }

  subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;

    return this;
  }

  distance(vector) {
    let x = this.x - vector.x;
    let y = this.y - vector.y;

    return Math.sqrt((x * x) + (y * y));
  }

  distanceSqr(vector) {
    let x = this.x - vector.x;
    let y = this.y - vector.y;

    return (x * x) + (y * y);
  }

  multiply(vector) {
    this.x *= vector.x;
    this.y *= vector.y;

    return this;
  }

  multiplyScalar(scalar) {
    Debug.isNumber(scalar);

    this.x *= scalar;
    this.y *= scalar;

    return this;
  }

  dot(vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  lengthSqr() {
    return this.x * this.x + this.y * this.y;
  }

  normalize() {
    let sum = this.lengthSqr();

    if (sum > 0) {
      sum = Math.sqrt(sum);
      this.x /= sum;
      this.y /= sum;
    } else {
      this.x = 0;
      this.y = 0;
    }

    return this;
  }

  lerp(vector, t) {
    this.x = lerp(this.x, vector.x, t);
    this.y = lerp(this.y, vector.y, t);

    return this;
  }

  copyTo(vector) {
    vector.x = this.x;
    vector.y = this.y;

    return vector;
  }

  copyFrom(vector) {
    this.x = vector.x;
    this.y = vector.y;

    return this;
  }

  clone() {
    return new Vector(this.x, this.y);
  }

  angleBetween(vector) {
    return Math.atan2(vector.y - this.y, vector.x - this.x);
  }

  angle() {
    return Math.atan2(this.y, this.x);
  }

  perp() {
    return this.set(this.y, -this.x);
  }
}

Vector.__cache = new Vector();

function lerp(a, b, t) {
  return a + (b - a) * t;
}
