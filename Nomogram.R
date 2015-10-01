# install.packages('rworldmap')
# install.packages('spam')
setwd( "C:/Users/mdeed_000/Documents/Starflight-XT");

pdf("nomogram.pdf", width=17, height=11);

library(rworldmap);
newmap <- getMap(resolution = "low");

plot(0, 0, xlim=c(-200, 260), ylim=c(-1, 1), axes="")

for (i in (1:nrow(newmap))) {
  maprow = newmap[i,]@polygons[[1]]@Polygons;
  for (j in (1:length(maprow))) {
    mapline = maprow[[j]];
    ys = mapline@coords[,2];
    ys = ifelse(ys<0,-1,1) - sign(ys) * cos(pi * ys / 180);
    xs = mapline@coords[,1];
    deltay = max(ys) - min(ys);
    deltax = max(xs) - min(xs);
    if (deltay > 0.01 || deltax > 1.0) {
      lines (xs, ys);
    }
  }
}

earth_radius = 6371
spin_bonus = data.frame(
  x = rep(-180, 9),
  y = 1 - cos(pi * c(0, 20, 30, 40, 50, 60, 70, 80, 90) / 180));
points(spin_bonus$x, spin_bonus$y, pch=3);
text(spin_bonus$x, spin_bonus$y, c(0, 20, 30, 40, 50, 60, 70, 80, 90), pos=2);

max_bonus = 2 * pi * earth_radius / 24 / 60 /60;

right_tick = 200
offset = (180 + right_tick) * (0.2 * max_bonus) / (1 - (0.2 * max_bonus)) 

delta_vees = data.frame(
  x = rep(right_tick+offset, 8),
  dv = c(10, 12.5, 13.8, 14.1, 
        14.8, 16.4, 16.1, 20.2) + 0.2,
  l = c('LEO', 'GTO', 'GEO/L1', 'L4/L5', 
        'Lunar Orbit', 'Lunar TD', 'LMO', 'Martian TD')
);

yoffset = -2.1;
scale = (180 + right_tick + offset) / (180 + right_tick);
delta_vees$y = 1 + (yoffset - 1 + 0.15 * delta_vees$dv) * scale;


delta_vees = delta_vees[order(delta_vees$y),]
points(delta_vees$x,delta_vees$y, pch=3);
text(delta_vees$x, delta_vees$y, delta_vees$l, pos=4, cex=0.8);

points(rep(right_tick, 11), yoffset  + 0.15 *(10:20), pch=3)
points(rep(right_tick, 111), yoffset  + 0.15 *(95:205)/10, pch=1, cex=0.25)
text(rep(right_tick, 11), yoffset  + 0.15 *(10:20), (10:20), pos=2);

dev.off();

# plot(c(0:10), c(0:10), pch=(0:10))






