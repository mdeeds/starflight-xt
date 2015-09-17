

var StatePoint = function() {
	this.throttle = arguments[0];
	this.start_time = arguments[1];
	this.end_time = arguments.length >= 3 ? arguments[3] : Number.POSITIVE_INFINITY;
}

var Throttle = function() {
	this.state_points = [];
    this.last_start = 0;
}

Throttle.prototype.Add = function(state_point) {
  this.state_points.push(state_point);
}

Throttle.prototype.GetThrottle = function(start_time, end_time) {
	if (this.state_points.length == 0) {
		return 0.0;
	}
	while (this.last_start > 0 && this.state_points[this.end_time] < time) {
	  this.last_start--;
	}
	while (this.last_start < this.state_points.length 
	    && this.state_points[this.last_start] <= end_time) {
	  this.last_start++;
	}
	var i = this.last_start;
	var result = 0.0;
	while (i < this.state_points.length && this.state_points[i].start_time <= end_time) {
		var start = Math.max(start_time, this.state_points[i].start_time);
		var end = Math.min(end_time, this.state_points[i].end_time);
		var p = (end - start) / (end_time - start_time);
		if (p > 0) {
		  result = result + p * this.state_points[i].throttle;
		}
		i++;
	}
	return result;
}

