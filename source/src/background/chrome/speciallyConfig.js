// 特效需要用到图片目录
var path = 'assets/specially/';
// 特效步骤
var speciallyConfig = {

	zshx : [[
		    ['curve','rgb',[{x:0,y:0},{y:164,x:146},{x:255,y:255}]],
		    ['curve','r',[{x:0,y:0},{y:168,x:144},{x:255,y:255}]],
		    ['curve','g',[{x:0,y:0},{y:71,x:84},{y:159,x:137},{x:255,y:255}]],
		    ['curve','b',[{x:0,y:0},{y:98,x:50},{y:158,x:118},{x:255,y:255}]]
		   ]],

	xhfw : [[
	        ['copy','overlay',50],
	        ['filter','softLight','9cd0f0',100],
	        ['image','screen',null,100]
	       ],[
	       	[2],[path+'xueye.jpg']
	       ]],
	xc : [[
	        ['image','hardLight',null,60,'format'],
	        ['curve','rgb',[{x:0,y:0},{y:137,x:124},{x:255,y:255}]],
	        ['curve','r',[{x:0,y:0},{y:67,x:49},{x:255,y:255}]],
	        ['curve','g',[{x:0,y:0},{y:73,x:95},{y:191,x:164},{x:255,y:255}]],
	        ['curve','b',[{x:0,y:0},{y:154,x:195},{x:255,y:255}]]
	     ],[
	       [0],[path+'xcwl.jpg']
	     ]],

	xxgy : [[
	        ['image','hardLight',null,30],
	        ['image','softLight',null,40],
	        ['image','lighten',null,70,'format'],
	        ['curve','r',[{x:0,y:0},{x:86,y:91},{x:140,y:156},{x:255,y:255}]]
	       ],[
	        [0,1,2],[path+'guangxian1(step1).jpg',path+'guangxian1(step2).jpg',path+'guangxian1(step3).jpg']
	      ]],

	xyjb : [[
	        ['copy','softLight',100],
	        ['image','screen',null,60]
	     ],[
	       [1],[path+'xyjb.jpg']
	     ]],

	slly : [[
		    ['filter','overlay','bfad91',100],
	        ['filter','exclusion','01050c',100],
	        ['filter','softLight','cbe4fb',100],
	        ['filter','overlay','0b2269',100]
		   ]],

	rg : [[
	        ['filter','overlay','ffcc00',20],
	        ['filter','linearBurn','f2a334',15],
	        ['image','screen',null,100]
	     ],[
	       [2],[path+'rgha.jpg']
	     ]],

	qpjb : [[
	        ['image','hardLight',null,70]
	     ],[
	       [0],[path+'qpdw.png']
	     ]],

	pay : [[
	        ['copy','overlay',100],
	        ['filter','softLight','9cd0f0',100],
	        ['image','screen',null,100]
	     ],[
	       [2],[path+'fff.png']
	     ]],

	lh : [[
	        ['image','screen',null,100,'format'],
	        ['curve','rgb',[{x:0,y:0},{x:148,y:178},{x:255,y:255}]],
	        ['curve','r',[{x:0,y:0},{x:76,y:84},{x:128,y:151},{x:255,y:255}]]
	     ],[
	       [0],[path+'mtxx_lianghong_001.jpg']
	     ]],

	lzp : [[
	        ['balance',14,26,41,1],
	        ['balance',-11,-20,10,1],// 0 
	        ['balance',15,26,45,1],
	        ['curve','rgb',[{x:0,y:0},{x:83,y:72},{x:163,y:184},{x:255,y:255}]],
	        ['curve','r',[{x:0,y:0},{x:80,y:89},{x:162,y:182},{x:255,y:255}]],
	        ['filter','exclusion','071c53',100],
	        ['image','screen',null,100]
	     ],[
	       [6],[path+'laozaop.jpg']
	     ]],

	ld : [[
		    ['filter','overlay','c0b097',100,'format'],
	        ['balance',80,60,100,1]
		 ]],

	hy : [[
	        ['image','multiply',null,100]
	     ],[
	       [0],[path+'hydw.png']
	     ]],

	bluebell : [[
		    ['filter','exclusion','01102f',100],
	        ['filter','exclusion','120007',54,'format'],
	        ['level','rgb',[0,1,255],[28,255]],
	        ['level','b',[0,1,255],[29,219]],
	        ['balance',10,-15,-10,1],
	        ['curve','rgb',[{x:0,y:0},{x:112,y:122},{x:255,y:255}]],
	        ['curve','r',[{x:0,y:0},{x:110,y:118},{x:255,y:255}]],
	        ['curve','b',[{x:0,y:0},{x:255,y:225},{x:255,y:255}]]
		 ]],

	lomo : [[
	        ['copy','overlay',100],
	        ['image','overlay',null,50],
	        ['image','multiply',null,40,'format'],
	        ['curve','rgb',[{x:0,y:0},{x:112,y:144},{x:255,y:255}]]
	     ],[
	       [1,2],[path+'lomo1.jpg',path+'lomo2.jpg']
	     ]],

	lordkelvin : [[
		    ['curve','r',[{x:0,y:43},{x:52,y:136},{x:107,y:201},{x:255,y:255}]],
	        ['curve','g',[{x:0,y:27},{x:54,y:86},{x:214,y:219},{x:255,y:219}]],
	        ['curve','b',[{x:0,y:0},{x:49,y:86},{x:122,y:100},{x:201,y:167},{x:255,y:167}]],
	        ['level','rgb',[0,0.94,255],[0,250]],
	        ['filter','screen','511c99',35]
		 ]],

	nashville : [[
		    ['filter','multiply','f7d9ad',100,'format'],
	        ['balance',-15,-15,10,1],// 0
	        ['balance',30,25,30,1],
	        ['filter','screen','0054a6',30,'format'],
	        ['curve','rgb',[{x:0,y:0},{x:132,y:164},{x:255,y:255}]],
	        ['curve','r',[{x:0,y:0},{x:125,y:142},{x:255,y:255}]],
	        ['curve','g',[{x:0,y:0},{x:113,y:127},{x:255,y:255}]],
	        ['curve','b',[{x:0,y:0},{x:137,y:134},{x:255,y:255}]]
		 ]],

	xpro : [[
		    ['level','rgb',[0,0.77,255],[0,255]],
	        ['level','r',[28,1.09,255],[0,255]],
	        ['level','g',[0,1.06,255],[0,255]],
	        ['level','b',[0,1.14,255],[45,255]],
	        ['level','rgb',[15,1.03,243],[0,238]],
	        ['level','r',[49,2.35,255],[11,232]],
	        ['level','g',[0,1.14,255],[0,250]],
	        ['level','b',[0,0.57,255],[56,238]],
	        ['curve','rgb',[{x:0,y:0},{x:58,y:48},{x:211,y:227},{x:255,y:255}]],
	        ['curve','b',[{x:0,y:0},{x:0,y:15},{x:255,y:255}]],
	        ['filter','multiply','fcffeb',100]
		 ]],

	dbql : [[
		    ['curve','rgb',[{x:0,y:0},{x:82,y:72},{x:152,y:170},{x:255,y:255}]],
	        ['curve','r',[{x:0,y:0},{x:85,y:57},{x:153,y:176},{x:255,y:255}]],
	        ['curve','g',[{x:0,y:0},{x:71,y:50},{x:162,y:191},{x:255,y:255}]],
	        ['curve','b',[{x:0,y:0},{x:77,y:61},{x:161,y:187},{x:255,y:255}]]
		 ]],

	gtf : [[
		    ['copy','overlay',100,'format'],
	        ['level','r',[0,0.73,255],[0,255]],
	        ['level','g',[0,1.03,255],[0,255]],
	        ['level','b',[0,0.67,255],[0,255]]
		 ]],

	gsjb : [[
	        ['copy','softLight',100],
	        ['image','screen',null,60]
	     ],[
	       [1],[path+'gsjb.JPG']
	     ]],

	hqqcjh : [[
	        ['image','exclusion',null,40,'format'],
	        ['curve','rgb',[{x:0,y:0},{x:21,y:0},{x:131,y:186},{x:255,y:255}]],
	        ['curve','g',[{x:0,y:0},{x:22,y:5},{x:209,y:245},{x:255,y:255}]],
	        ['curve','b',[{x:0,y:0},{x:41,y:28},{x:204,y:244},{x:255,y:255}]],
	        ['image','vividLight',null,20],
	        //['image','color',xxImages.get('h5.jpg',prevCanvas.getSize()),40],
	        ['copy','softLight',100]
	     ],[
	       [0,4],[path+'h1.jpg',path+'h3.jpg']
	     ]],

	fnx : [[
	        ['copy','screen',40],
	        ['image','softLight',null,60],
	        ['filter','colorBurn','e1dae1',100,'format'],
	        ['curve','rgb',[{x:0,y:0},{x:20,y:12},{x:132,y:141},{x:255,y:255}]]
	     ],[
	       [1],[path+'z2.png']
	     ]],

	fghb : [[
	        ['keep','r'],
	        ['image','multiply',null,100]
	     ],[
	       [1],[path+'wenli.jpg']
	     ]],
};