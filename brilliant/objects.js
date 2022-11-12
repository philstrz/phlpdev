// Object is the basis for both interactive object and its images
class Object {
  constructor(interactive, x, y, path) {
    // Keep track of state space through parent (interactive) object
    this.interactive = interactive;
    // Group is used to move objects
    this.group = interactive.canvas.append('g')
      .datum({x: x, y: y})
      .attr('transform', 'translate(' + x + ',' + y + ')');
    // Path is the shape of the object
    this.path = this.group.append('path')
      .data([path])
      .attr('d', (d) => MirrorInteractive.line(d))
      .attr('stroke', 'red')
      .attr('stroke-width', 2);
  }

  // Clear the SVG elements from the DOM
  remove() {
    this.group.remove();
  }
} // End of Object class


// Original is the moveable object
class Original extends Object {
  constructor(interactive, x, y, path) {
    super(interactive, x, y, path);
    // Original can be dragged
    this.group
      .on('mousedown', function() {
        d3.select(this)
          .attr('class', 'select');
      });
    this.path.attr('fill', 'red');
  }
} // End of Original class


// Image of the original
class Image extends Object {
  constructor(interactive, x, y, path) {
    super(interactive, x, y, path);
    this.path.attr('fill', '#00000000');
    // Image draws LineOfSight when clicked
    this.group
      .on('mousedown', function() {
        let to = d3.select(this).datum();
        let from = interactive.observer.group.datum();
        for (let lineOS of interactive.linesOS) {
          lineOS.remove();
        }
        interactive.linesOS.push(new LineOfSight(interactive, from.x, from.y, to.x, to.y, 0));
      })
  }
} // End of Image class


// As the name would imply
class Observer {
  constructor(x, y, canvas) {
    // Group is used to move observer
    this.group = canvas.append('g')
      .attr('id', 'observer')
      .datum({x: x, y: y})
      .attr('transform', 'translate(' + x + ',' + y + ')')
      .on('mousedown', function() {
        d3.select(this)
          .attr('class', 'select');
      })
    // Draw observer as a black circle
    this.circle = this.group
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 20)
      .style('fill', 'black');
  }
} // End of Observer class
