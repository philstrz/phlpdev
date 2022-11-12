// Simple methods to do vector math with arrays [x,y]
class VectorMath {
  
  // Dot product
  static dot(a, b) {
    return a[0] * b[0] + a[1] * b[1];
  }

  // Angle between vectors
  static angle(a, b) {
    let cos = this.dot(a, b) / (this.length(a) * this.length(b));
    return Math.acos(cos);
  }

  // Angle of a vector
  static worldAngle(a) {
    return Math.atan2(a[1], a[0]);
  }

  // Cross product in 2D
  static cross(a, b) {
    return a[0] * b[1] - a[1] * b[0];
  }

  // Length of a vector
  static length(a) {
    return Math.sqrt(this.dot(a,a));
  }

  // Projects b onto a
  static project(a, b) {
    let norm = VectorMath.dot(a, a);
    let dot = VectorMath.dot(a, b);
    return [a[0] * dot / norm, a[1] * dot / norm];
  }

  // Reflects b across a
  static reflect(a, b) {
    let proj = VectorMath.project(a, b);
    return [2 * proj[0] - b[0], 2 * proj[1] - b[1]];
  }
} // End of VectorMath class