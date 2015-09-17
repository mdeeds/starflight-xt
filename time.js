
var slider_selected = false;

var InitializeSlider = function(element) {
	element.onmousedown = SliderOnMouseDown;
	element.onmouseup = SliderOnMouseUp;
	element.onmousemove = SliderOnMouseMove;
}

SliderOnMouseDown = function(event) {
	Log(JSON.stringify(event));
    var widget = event.srcElement;
    widget.setAttribute('x', event.offsetX);
	slider_selected = true;
}

SliderOnMouseUp = function(event) {
	Log(JSON.stringify(event));
	slider_selected = false;
}

SliderOnMouseMove = function(event) {
	if (slider_selected) {
	  Log(JSON.stringify(event));
      var widget = event.srcElement;
      widget.setAttribute('x', event.offsetX);
	}
}
