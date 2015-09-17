

var Log = function(message) {
	var div = document.createElement('div');
	div.innerHTML = message;
	var b = document.getElementsByTagName('body')[0].appendChild(div);
}