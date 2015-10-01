var SvgObject = function() {
	this.attitude = new Attitude();
	this.mass = 0.0;
	this.inertia = 0.0;
	this.fixed = false;
	this.scale = false;
	this.loaded = true;
}

SvgObject.prototype.UpdateInertia = function() {
	// Assume a solid cylinder of uniform density.
	// http://hyperphysics.phy-astr.gsu.edu/hbase/isph.html
	// Sphere:
	// this.inertia = 2.0 * this.mass * this.radius * this.radius / 5.0;
	// Cylinder
	// http://hyperphysics.phy-astr.gsu.edu/hbase/icyl.html#icyl
	this.inertia = this.mass * this.radius * this.radius / 4.0 +
		this.mass * this.length * this.length / 12.0;
}

SvgObject.prototype.WhenLoaded = function(f) {
	if (this.loaded) {
		f();
	} else {
		setTimeout(function(self) { 
			return function() {
				self.WhenLoaded(f);
		}}(this), 100);
	}
}

SvgObject.prototype.SetColor = function(color) {
	this.color = color;
}

SvgObject.prototype.SetVelocity = function(v) {
	this.attitude.v.CopyFrom(v);
}

SvgObject.prototype.SetPosition = function(x) {
    this.attitude.x.CopyFrom(x);
}

SvgObject.prototype.resetAcc = function() {
	this.attitude.a.x = 0.0;
	this.attitude.a.y = 0.0;
	this.attitude.tau = 0.0;
}

SvgObject.FromSvgFile = function(svg_file) {
	var self = new SvgObject();
	self.loaded = false;
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
	} else {
		console.error("Metadata is missing pixels_per_meter.");
	}
	if (this.metadata.radius) {
		this.radius = this.metadata.radius;
		if (!this.metadata.length) {
			this.length = 2 * this.radius;
		}
	}
	if (this.metadata.length) {
		this.length = this.metadata.length;
	}
	if (this.metadata.mass) {
		this.mass = this.metadata.mass;
	}
	this.UpdateInertia();
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
	this.loaded = true;
}

SvgObject.prototype.RenderInto = function(render_canvas) {
	var position = this.attitude.x;
	var draw_scale = this.scale;
	
	console.log("RenderSvg(" + position + "," + draw_scale + ")");
	if (this.svg) {
  	  console.log("id: " + this.id);
	  // divide by pixels_per_meter of the original SVG to convert to meters.
	  // then multiply by provided pixels_per_meter to get pixels on the screen.
	
	  var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	  console.log('this.scale: ' + this.scale);
	  var transform = 'translate(' + (render_canvas.width / 2) + ', ' + (render_canvas.height / 2) + ') '
	      + 'scale(' + render_canvas.look_scale + ') '
          + 'translate(' + (position.x-render_canvas.look_at.x) + ', ' + (render_canvas.look_at.y-position.y)+ ')'
	      + 'scale('+ (1.0 / this.scale) +') '
		  + 'rotate(' + (-render_canvas.look_theta_degrees)+')'
		  + 'translate(' + (-this.position.x) + ', ' + (-this.position.y) + ')';
	  console.log('transform: ' + transform);
	  g.setAttribute('transform', transform);
	  g.appendChild(this.svg);
	  render_canvas.svg_display.appendChild(g);
	} else {
		setTimeout(function(self) {
		  return function(render_canvas) {
			  self.RenderInto(render_canvas)
		  }
		} (this), 100, render_canvas);
	}
}

SvgObject.prototype.toString = function() {
	return JSON.stringify(this);
}
