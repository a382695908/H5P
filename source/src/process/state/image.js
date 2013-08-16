		image: function() {
			
			var pi = data.bgp.PI,
			    prev = pi.p.get(),
			    next = pi.n.get();

			update(next.width, next.height, 
				Math.floor(windowScreenWidth / 2 - next.width / 2), 0);

			draw(prev, next);
		},