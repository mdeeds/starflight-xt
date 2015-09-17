var SunFrame = new RotatingFrame(null, null, 0.0);

// 1.98855e30 kg
// 696300 km = 6.963e8 m
var Sun = new SolidObject(new Vector2D(), 1.98855e30, 6.963e6);
SunFrame.AddSolidObject(Sun);

var PI = 3.14159265458;

// Omega is measured in radians per second.
var OmegaFromPeriod = function(days) {
	return 2 * PI / (days * 24 * 60 * 60);
}

// https://en.wikipedia.org/wiki/Earth%27s_orbit
// Period: 365.256 days
// Radius: 149.59787e9 meters
var EarthOrbit = new RotatingFrame(SunFrame, 
    new Attitude(new Vector2D(), OmegaFromPeriod(365.256)));


// https://en.wikipedia.org/wiki/Orbit_of_the_Moon
var EarthMoonFrame = new RotatingFrame(EarthOrbit, 
    new Attitude(new Vector2D(149.59787e9, 0), OmegaFromPeriod(27.322)));
	
// Earth and moon orbit each other.  
// https://en.wikipedia.org/wiki/Barycenter
//  a = 384e6
//  r1 = 4.670e6
//  r2 = 379e6
var EarthFrame = new RotatingFrame(EarthMoonFrame, 
    new Attitude(new Vector2D(4.670e6, 0), OmegaFromPeriod(1)));
var Earth = new SolidObject(new Vector2D(), 5.972e24, 6.371e6);
EarthFrame.AddSolidObject(Earth);	
	
var MoonFrame = new RotatingFrame(EarthMoonFrame, 
    new Attitude(new Vector2D(-379e6, 0), -OmegaFromPeriod(27.322)));
var Moon = new SolidObject(new Vector2D(), 7.328e22, 1.7374e6);
MoonFrame.AddSolidObject(Moon);

var Cape = new RotatingFrame(EarthFrame,
    new Attitude(new Vector2D(0, 6.371e6), 0.0));
// Cape.addSvg('cape.svg', 1.0);

var Rocket = new SolidObject(new Vector2D(0, -110));