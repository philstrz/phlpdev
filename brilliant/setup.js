window.addEventListener('load', setup);

function setup() {
  // First: single fixed mirror
  let canvas = d3.select('#canvas1');
  let object = {x: 600, y: 200};
  let observer = {x: 600, y: 400};
  let mirrors = [
    {x1: 400, y1: 0, x2: 400, y2: 600, interact: false},
  ]
  new MirrorInteractive(canvas, object, observer, mirrors);

  // Second: perpendicular mirrors
  canvas = d3.select('#canvas2');
  object = {x: 600, y: 400};
  observer = {x: 600, y: 500};
  mirrors = [
    {x1: 400, y1: 0, x2: 400, y2: 600, interact: false},
    {x1: 0, y1: 300, x2: 800, y2: 300, interact: false},
  ]
  new MirrorInteractive(canvas, object, observer, mirrors);

  // Third: fixed parallel mirrors
  canvas = d3.select('#canvas3');
  object = {x: 400, y: 200};
  observer = {x: 400, y: 400};
  mirrors = [
    {x1: 300, y1: 0, x2: 300, y2: 600, interact: false},
    {x1: 500, y1: 0, x2: 500, y2: 600, interact: false},
  ]
  new MirrorInteractive(canvas, object, observer, mirrors);

  // Fourth: fixed parallel and perpendicular mirrors
  canvas = d3.select('#canvas4');
  object = {x: 400, y: 400};
  observer = {x: 400, y: 500};
  mirrors = [
    {x1: 300, y1: 300, x2: 300, y2: 600, interact: false},
    {x1: 500, y1: 300, x2: 500, y2: 600, interact: false},
    {x1: 300, y1: 300, x2: 500, y2: 300, interact: false},
  ]
  new MirrorInteractive(canvas, object, observer, mirrors);

  // Fifth: moveable parallel mirrors
  canvas = d3.select('#canvas5');
  object = {x: 400, y: 200};
  observer = {x: 400, y: 400};
  mirrors = [
    {x1: 300, y1: 50, x2: 300, y2: 550, interact: true},
    {x1: 500, y1: 50, x2: 500, y2: 550, interact: true},
  ]
  new MirrorInteractive(canvas, object, observer, mirrors);

}
