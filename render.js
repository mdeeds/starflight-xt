var RenderCanvas = function(div_id, width, height, bg_color) {
	this.playfield = document.getElementById(div_id);
	this.svg_display = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	this.svg_display.setAttribute('width', width ? width : 800);
	this.svg_display.setAttribute('height', height ? height : 450);
	this.width = width;
	this.height = height;
	this.svg_display.style.background = bg_color ? bg_color : '#DDDDFF';
	this.playfield.appendChild(this.svg_display);
    this.look_at = new Vector2D();
    this.look_scale = 1.0;
    this.look_theta = 0.0;
    this.look_theta_degrees = 0.0;
}

RenderCanvas.prototype.LookAt = function(position, pixels_per_meter) {
	if (position) {
		this.look_at = position;
	}
	if (pixels_per_meter) {
		this.look_scale = pixels_per_meter;
	}
}

RenderCanvas.prototype.AngleAt = function(theta) {
	this.look_theta = theta;
	this.look_theta_degrees = theta * 180 / PI;
}

var SvgObject = function(render_canvas) {
	this.render_canvas = render_canvas;
}

SvgObject.FromSvgFile = function(render_canvas, svg_file) {
	var self = new SvgObject(render_canvas);
	console.log('SvgObject(' + svg_file + ')');
	self.scale = 1.0; // May be overridden by pixels_per_meter:X in SVG
	self.id = 'id_' + svg_file;
	self.svg = null;
	self.position = new Vector2D(); // May be overridden by center_of_gravity in SVG.
	
	xhr = new XMLHttpRequest();
	xhr.open('GET', svg_file, true);
	xhr.overrideMimeType("image/svg+xml");
	xhr.onreadystatechange = function(me, xhr2) {
		return function() {
			if (xhr2.readyState==4 && xhr2.status==200)
			{
				me.OnSvgLoad(xhr2);
			}
		}
	} (self, xhr);
	xhr.send();
	return self;
}

SvgObject.FromSolidObject = function(render_canvas, solid_object) {
	
	
}


SvgObject.GetJsonMetadata = function(element) {
	var text = '';
	var tspans = element.getElementsByTagName('tspan');
	for (var i = 0; i < tspans.length; ++i) {
		var tspan = tspans[i];
		text = text + tspan.innerHTML;
	}
	return JSON.parse(text);
}

SvgObject.prototype.ApplyMetadata = function() {
	if (this.metadata.pixels_per_meter) {
		this.scale = this.metadata.pixels_per_meter;
	}
}

SvgObject.prototype.OnSvgLoad = function(xhr) {
	console.log('SvgObjet::OnSvgLoad')
	
	this.svg = xhr.responseXML.documentElement;
	titles = this.svg.getElementsByTagName('title');
	console.log('Num titles: ' + titles.length);
	for (var i = 0; i < titles.length; ++i) {
		var title = titles[i];
		console.log('title: ' + title.innerHTML);
		if (title.innerHTML == 'center_of_gravity') {
			title.parentElement.setAttribute('visibility','hidden');
			var o = title.parentElement;
			this.position = new Vector2D(o.getAttribute('sodipodi:cx'), 
			    o.getAttribute('sodipodi:cy'));
		} else if (title.innerHTML.startsWith('pixels_per_meter:')) {
			this.scale = parseInt(title.innerHTML.split(':')[1]);
		} else if (title.innerHTML == 'time_slider') {
			InitializeSlider(title.parentElement);
		} else if (title.innerHTML == 'metadata') {
			title.parentElement.setAttribute('visibility','hidden');
			this.metadata = SvgObject.GetJsonMetadata(title.parentElement);
			this.ApplyMetadata();
		}
	}
}

SvgObject.prototype.RenderSvg = function(position, draw_scale) {
	console.log("RenderSvg(" + position + "," + draw_scale + ")");
	if (this.svg) {
  	  console.log("id: " + this.id);
	  // divide by pixels_per_meter of the original SVG to convert to meters.
	  // then multiply by provided pixels_per_meter to get pixels on the screen.
	
	  var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	  console.log('this.scale: ' + this.scale);
	  var transform = 'translate(' + (this.render_canvas.width / 2) + ', ' + (this.render_canvas.height / 2) + ') '
	      + 'scale(' + this.render_canvas.look_scale + ') '
          + 'translate(' + (position.x-this.render_canvas.look_at.x) + ', ' + (this.render_canvas.look_at.y-position.y)+ ')'
	      + 'scale('+ (1.0 / this.scale) +') '
		  + 'rotate(' + (-this.render_canvas.look_theta_degrees)+')'
		  + 'translate(' + (-this.position.x) + ', ' + (-this.position.y) + ')';
	  console.log('transform: ' + transform);
	  g.setAttribute('transform', transform);
	  g.appendChild(this.svg);
	  this.render_canvas.svg_display.appendChild(g);
	} else {
		setTimeout(function(self) {
		  return function(position, draw_scale) {
			  self.RenderSvg(position, draw_scale)
		  }
		} (this), 100, position, draw_scale);
	}
}
