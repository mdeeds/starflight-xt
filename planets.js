var SunFrame = new RotatingFrame(null, null, 0.0);

// 1.98855e30 kg
// 696300 km = 6.963e8 m
var Sun = SvgObject.FromSvgFile("sun.svg");
SunFrame.AddSolidObject(Sun);

var PI = 3.14159265458;

// Omega is measured in radians per second.
var OmegaFromPeriod = function(days) {
	return 2 * PI / (days * 24 * 60 * 60);
}

// https://en.wikipedia.org/wiki/Earth%27s_orbit
// Period: 365.256 days
// Orbit Radius: 149.59787e9 meters
// Body Radius: 6.371e6
var EarthOrbit = new RotatingFrame(SunFrame, 
    new Attitude(new Vector2D(), OmegaFromPeriod(365.256)));


// https://en.wikipedia.org/wiki/Orbit_of_the_Moon
var EarthMoonFrame = new RotatingFrame(EarthOrbit, 
    new Attitude(new Vector2D(149.59787e9, 0), OmegaFromPeriod(27.322)));
	
// Earth and moon orbit each other.  
// Earth orbit radius: 1.49598261000e11 m  https://en.wikipedia.org/wiki/Earth
// Earth body radius: 6.371000e6 m         https://en.wikipedia.org/wiki/Earth
// Earth mass: 5.97237e24 kg
//
// https://en.wikipedia.org/wiki/Barycenter
//  a = 384e6
//  r1 = 4.676e6
//  r2 = 3.801e8
// ** MOON **
// Moon orbit radius: 3.84748000e8 m  https://en.wikipedia.org/wiki/Orbit_of_the_Moon
// Moon body radius: 1.737100e6 m  https://en.wikipedia.org/wiki/Moon
// Mass 7.3477e22 kg
// Geosynchronous radius: 4.2164e7 https://en.wikipedia.org/wiki/Geosynchronous_orbit
// Earth Moon L1 radius: 
var EarthFrame = new RotatingFrame(EarthMoonFrame, 
    new Attitude(new Vector2D(4.670e6, 0), OmegaFromPeriod(1)));
var Earth = SvgObject.FromSvgFile("earth.svg");
EarthFrame.AddSolidObject(Earth);	
	
var MoonFrame = new RotatingFrame(EarthMoonFrame, 
    new Attitude(new Vector2D(-379e6, 0), -OmegaFromPeriod(27.322)));
var Moon = SvgObject.FromSvgFile("moon.svg");
MoonFrame.AddSolidObject(Moon);

var Cape = new RotatingFrame(EarthFrame,
    new Attitude(new Vector2D(0, 6.371e6), 0.0));
// Cape.addSvg('cape.svg', 1.0);

// var Rocket = new SolidObject(new Vector2D(0, -110));