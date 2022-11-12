// Mirrors and images of mirrors
class Mirror {
  constructor(interactive, x1=0, y1=0, x2=0, y2=0, interact=true) {
    // Keep track of state space through parent (interactive) object
    this.interactive = interactive;
    let canvas = interactive.canvas;

    // Endpoints
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.vector = [(x2-x1), (y2-y1)];
    this.ends = [];

    // Draw the mirror's "surface"
    this.line = canvas.append('line')
      .attr('x1', x1)
      .attr('y1', y1)
      .attr('x2', x2)
      .attr('y2', y2)
      .attr('stroke', 'blue')
      .attr('stroke-width', 2);
    
    // Make the line endpoints moveable if interactive
    if (interact) {
      for (let [x, y] of [[x1, y1], [x2, y2]]) {
        let group = canvas.append('g')
          .datum({x: x, y: y})
          .attr('transform', 'translate(' + x + ',' + y + ')')
          .on('mousedown', function() {
            d3.select(this)
              .attr('class', 'select')
          });
        group.append('circle')
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', 8)
          .attr('fill', 'blue')
        this.ends.push(group);
      }
    }
  } 

  // Clear the SVG elements from the DOM
  remove() {
    this.line.remove();
    for (let group of this.ends) {
      group.remove();
    }
  }

  // Update to match the endpoints
  update() {
    if (this.ends.length <= 0) return;
    this.x1 = this.ends[0].datum().x;
    this.y1 = this.ends[0].datum().y;
    this.x2 = this.ends[1].datum().x;
    this.y2 = this.ends[1].datum().y;

    this.vector = [(this.x2 - this.x1), (this.y2 - this.y1)];

    this.line
      .attr('x1', this.x1)
      .attr('y1', this.y1)
      .attr('x2', this.x2)
      .attr('y2', this.y2)
  }

  // Cast an image of a mirror
  castMirror(mirror) {
    let [x1, y1] = this.reflectPoint([mirror.x1, mirror.y1]);
    let [x2, y2] = this.reflectPoint([mirror.x2, mirror.y2]);
    return new Mirror(this.interactive, x1, y1, x2, y2, false);
  }

  // Reflect an object (original or image)
  castObject(object) {
    let group = object.group.datum();
    let path = [...object.path.datum()];

    // Reflect the center of the group
    let [x, y] = this.reflectPoint([group.x, group.y]);
    
    // Reflect the shape
    for (let i = 0; i < path.length; i++) {
      path[i] = this.reflectShape(path[i]);
    }
    return new Image(this.interactive, x, y, path);
  }

  // Reflect each point across this mirror
  reflectPoint(point, center={x: this.x1, y: this.y1}) {
    let x = point[0];
    let y = point[1];

    let vector = [x - center.x, y - center.y];
    let reflection = VectorMath.reflect(this.vector, vector);
    return [reflection[0] + center.x, reflection[1] + center.y];
  }

  // The shape needs to be reflected across the origin, its center
  reflectShape(point) {
    let center = {x: 0, y: 0};
    return this.reflectPoint(point, center);
  }
} // End of Mirror class