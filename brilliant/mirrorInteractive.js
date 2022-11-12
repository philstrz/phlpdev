// Put everything into a class to easily generate multiple interactives
class MirrorInteractive {

  // Keep arrays of all mirrors and images of mirrors
  mirrors = [];
  imirrors = [];

  // Keep track of object and its images
  images = [];
  // Keep track of observer and lines of sight
  linesOS = [];
  // How many reflections to draw
  limit = 20;
  // How far from original must an image be to be drawn
  overlap = 10;

  // Pre-defined arbitrary asymmetrical shape
  shape = [
    [-16, -16],
    [-8, -16],
    [0, 0],
    [16, 0],
    [16, 16],
    [-16, 16],
    [-16, -16]
  ];

  // Line generator for drawing paths
  static line = d3.line()
    .x((d) => d[0])
    .y((d) => d[1]);

  // Arc generator
  static arc = d3.arc()
    .innerRadius(18)
    .outerRadius(20)
    .startAngle((d) => d[0] + Math.PI / 2)
    .endAngle((d) => d[1] + Math.PI / 2);
    
  // Constructor constructs
  constructor(canvas, object, observer, mirrors) {
    // Save canvas selection
    this.canvas = canvas;

    // Draw object, observer
    this.object = new Original(this, object.x, object.y, this.shape);
    this.observer = new Observer(observer.x, observer.y, canvas);

    // Draw physical mirrors
    for (let input of mirrors) {
      this.mirrors.push(new Mirror(this, input.x1, input.y1, input.x2, input.y2, input.interact));
    }

    // Add interactive behavior
    this.canvasSetup(canvas);

    // Draw images
    this.update();
  }

  // Assign the canvas and mouse behavior to move object, observer, mirror endpoints
  canvasSetup(canvas) {
    // Move objects tagged with ".select" class
    let parent = this;
    canvas.on('mousemove', function(e) {
      let x = e.offsetX;
      let y = e.offsetY;
      let select = d3.selectAll('.select')
        .attr('transform', 'translate(' + x + ',' + y + ')')
        .datum({x: x, y: y});
      // Only update if something has been moved
      if(select._groups[0][0]) {
        parent.update(); 
      }
    } )
    // Release any tagged objects
    .on('mouseup', function() {
      d3.select('.select')
        .attr('class', '');
    })
  }

  // Update mirrors, clear the canvas and redraw reflections
  update() {
    for (let mirror of this.mirrors) {
      mirror.update();
    }
    this.clear();
    this.cast();
  }

  // Erase previously drawn reflections
  clear() {
    for (let imirror of this.imirrors) {
      imirror[0].remove();
    }
    this.imirrors = [];

    for (let image of this.images) {
      image[0].remove();
    }
    this.images = [];

    for (let lineOS of this.linesOS) {
      lineOS.remove();
    }
    this.linesOS = [];
  }

  cast() {
    // Reflect each mirror through every other mirror
    for (let i = 0; i < this.mirrors.length; i++) {
      for (let j = 0; j < this.mirrors.length; j++) {
        if (i == j) continue;
        // Cast reflection of one mirror (from) through every other (across)
        let from = this.mirrors[i];
        let across = this.mirrors[j];
        let reflection = across.castMirror(from);
        // Store reflection with which mirror created it
        this.imirrors.push([reflection, j]);
      }
    }
    // Reflect images of mirrors through other mirrors
    for (let [imirror, j] of this.imirrors) {
      if (this.imirrors.length > this.limit) break;
      for (let i = 0; i < this.mirrors.length; i++) {
        if (i == j) continue;
        let from = imirror;
        let across = this.mirrors[i];
        let reflection = across.castMirror(from);
        // Check if the reflection is outside the canvas, if so discard
        let right = this.canvas.attr('width');
        let bottom = this.canvas.attr('height');
        if (reflection.x1 > right && reflection.x2 > right) reflection.remove();
        else if (reflection.x1 < 0 && reflection.x2 < 0) reflection.remove();
        else if (reflection.y1 > bottom && reflection.y2 > bottom) reflection.remove();
        else if (reflection.y1 < 0 && reflection.y2 < 0) reflection.remove();
        else this.imirrors.push([reflection, i]);
      }
    }
    // Reflect the object through the real mirrors
    for (let i = 0; i < this.mirrors.length; i++) {
      if (this.images.length > this.limit) break;
      let across = this.mirrors[i];
      let image = across.castObject(this.object);
      this.images.push([image, i]);
    }
    // Reflect the images through the real mirrors
    for (let [image, j] of this.images) {
      if (this.images.length > this.limit) break;
      for (let i = 0; i < this.mirrors.length; i++) {
        if (i == j) continue;
        let across = this.mirrors[i];
        let reflection = across.castObject(image);
        // Make sure the reflected image doesn't overlap the original object
        let imagePosition = reflection.group.datum();
        let objectPosition = this.object.group.datum();
        let vector = [imagePosition.x - objectPosition.x, imagePosition.y - objectPosition.y];
        if (VectorMath.length(vector) < this.overlap) {
          reflection.remove();
        } else {
          this.images.push([reflection, i]);
        }
      }
    }
  }

} // End of MirrorInteractive class