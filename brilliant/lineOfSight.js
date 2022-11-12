// Draw a line from the observer to an image and to the original through mirrors
class LineOfSight {
  constructor(interactive, x1=0, y1=0, x2=0, y2=0, delay=0) {
    // Keep track of state space through parent (interactive) object
    this.interactive = interactive;

    // Endpoints
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;

    // Keep track of incidence/reflection angles
    this.angles = [];

    // Scale the draw speed of the line and store delay for sequential lines
    this.time = 5 * Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    this.delay = delay;

    // Draw line
    this.line = interactive.canvas.append('line')
      .attr('x1', x1)
      .attr('y1', y1)
      .attr('x2', x1)
      .attr('y2', y1)
      .attr('stroke', 'green')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '90, 3, 4, 3')
      .attr('stroke-dashoffset', delay/5);
    // Animate with transition
    this.line
      .transition()
      .delay(delay)
      .duration(this.time)
      .ease(d3.easeLinear)
      .attr('x2', x2)
      .attr('y2', y2);

    // Get intersections with mirrors and cast reflected lines
    for (let mirror of interactive.mirrors) this.reflect(mirror);
  }

  // If the line intersects a mirror, cast a new reflected line
  reflect(mirror) {
    // Endpoints of the line
    let x1 = this.x1;
    let y1 = this.y1;
    let x2 = this.x2;
    let y2 = this.y2;

    // Endpoints of the mirror
    let x3 = mirror.x1;
    let y3 = mirror.y1;
    let x4 = mirror.x2;
    let y4 = mirror.y2;

    // Differences
    let a = x2 - x1;
    let b = y2 - y1;
    let c = x4 - x3;
    let d = y4 - y3;
    let e = x3 - x1;
    let f = y3 - y1;

    // Parameter t where line intersects mirror, x = x1 + t (x2 - x1) etc.
    let tm = 0;
    if (b * c - a * d == 0) {
      tm = -1;
    } else {
      tm = (a * f - b * e) / (b * c - a * d);
    }
    // Parameter t where mirror intersects line
    let tl = 0;
    if (a * d - b * c == 0) {
      tl = -1;
    } else {
      tl = (d * e - c * f) / (a * d - b * c);
    }
    
    // If the intersection point is on the line and mirror, reflect it
    if ((tm > Number.EPSILON && tm < 1) && (tl > Number.EPSILON && tl < 1)) {
      // New first point is the intersection
      let cx = x1 + tl * (x2 - x1);
      let cy = y1 + tl * (y2 - y1);
      // Second point is reflected across the mirror
      [x2, y2] = mirror.reflectPoint([x2, y2]);
      let delay = tl * this.time + this.delay;
      this.interactive.linesOS.push(new LineOfSight(this.interactive, cx, cy, x2, y2, delay));
      // Add an arc showing the angles
      for (let [x, y] of [[x1, y1], [x2, y2]]) {
        // Vectors pointing along line of sight, mirror
        let vectorL = [(x - cx), (y - cy)];
        let vectorM = [(x4 - x3), (y4 - y3)];
        // Orient mirror vector to match line of sight
        vectorM = VectorMath.project(vectorM, vectorL)
        // Draw smallest angle between vectors
        let orientation = VectorMath.cross(vectorL, vectorM);
        let fromAngle = 0, toAngle = 0;
        if (orientation >= 0) {
          fromAngle = VectorMath.worldAngle(vectorL);
          toAngle = VectorMath.worldAngle(vectorM);
        } else {
          fromAngle = VectorMath.worldAngle(vectorM);
          toAngle = VectorMath.worldAngle(vectorL);
        }
        // Correction so the arc doesn't draw in the wrong direction
        if (toAngle < fromAngle) toAngle += 2 * Math.PI;

        // Draw arcs for incidence/reflection angles
        let group = this.interactive.canvas.append('g')
          .attr('transform', 'translate(' + cx + ',' + cy + ')')
          .append('path')
          .attr('fill', 'green')
          .data([[fromAngle, toAngle]])
        // Don't draw until line hits mirror
        group
          .transition()
          .delay(this.time * tl + this.delay)
          .attr('d', (d) => MirrorInteractive.arc(d));
        this.angles.push(group);
    }
    }
  }

  // Clear svg elements
  remove() {
    this.line.remove();
    for (let angle of this.angles) {
      angle.remove();
    }
  }
} // End of LineOfSight class