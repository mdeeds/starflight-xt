var Path = function() {
  this.points = [];
  this.width = 1;
  this.color = 'magenta';
}

Path.prototype.Add = function(v) {
  this.points = this.points.concat(v);
}

Path.prototype.SetWidth = function(w) {
  this.width = w;
}

Path.prototype.SetColor = function(c) {
  this.color = c;
}

// Returns an SVG 'path' object after transforming all points by matrix m.
Path.prototype.SvgPath = function(m) {
  console.log('Point count: ' + this.points.length);
  var newPoints = Vector2D.MatrixMultiplyArray(m, this.points);
  console.log('New point count: ' + newPoints.length);

  var pathString = 'M ' + newPoints[0].x + ' ' + newPoints[0].y + ' Q';

  for (var i = 1; i < newPoints.length; ++i) {
    pathString = pathString + ' ' + newPoints[i].x + ' ' + newPoints[i].y
  }

  var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathString);
  path.setAttribute('stroke', this.color);
  path.setAttribute('stroke-width', this.width);
  path.setAttribute('fill', 'none');
  return path;
}
