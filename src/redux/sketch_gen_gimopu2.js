tokenData = {
    hash: "0x11ac16678959949c12d5410212301960fc496813cbc3495bf77aeed738579738",
    tokenId: "123000456"
}
let u, maxSize = 5;
let N = 120;
let margin = 5;
let palette = ["#769D1E", "#29847B", "#49EFB7", "#0E69D7", "#0EA7F0", "#0B7984", "#E10A3E", "#F64012", "#0FBCB9", "#9C27B0", "#90425C", "#48618A", "#316A32", "#FE7CA8", "#AE08F9", "#E91E63", "#FBA60B", "#6C856D", "#131313", "#908841", "#F9BD07", "#016705", "#0DAE13", "#9F0C69", "#23CB9E", "#0BA47B", "#19BECB", "#B7BDB7"];
let randInt = (a, b) => (floor(random(a, b))); 
function setup() {
  createCanvas(1500, 1500);
	u = width / N;
	gap = u / 20;
}
function draw() {
	let squares1 = createComposition();
	let corner1 = random([0, maxSize*u]);
	let squares2 = createComposition();
	let corner2 = random([0, maxSize*u]);
	let randomCorner = random() < 1/3;
	background("#E91E63, #0A97D7, #12C6ACBC, #E8F906");
	noStroke();
  for (let squ of squares1) {
		fill(random(palette));
		square(squ.i*u+gap/2, squ.j*u+gap/2, squ.s*u-gap, randomCorner ? random([0, maxSize*u]) : corner1);
	}
	let sw = 2;
	noFill();
	stroke("#03A9F4, #E91E63, #2196F3");
	strokeWeight(sw);
	for (let squ of squares2) {
		square(squ.i*u+gap/2+sw/2, squ.j*u+gap/2+sw/2, squ.s*u-gap-sw, randomCorner ? random([0, maxSize*u]) : corner2);
	}
	
	noLoop();
}
function createComposition() {
	let squares = [];
	for (let i = 0; i < 1000; i++) {
    let newSqu = generateSquare();
    let canAdd = true;
    for (let squ of squares) {
      if (squaresIntersect(newSqu, squ)) {
        canAdd = false;
        break;
      }
    }
    if (canAdd) {
      squares.push(newSqu);
    }
  }
	for (let i = margin; i < N-margin; i++) {
		for (let j = margin; j < N-margin; j++) {
			let newSqu = {
				i: i,
				j: j,
				s: 1
			}
			let canAdd = true;
			for (let squ of squares) {
				if (squaresIntersect(newSqu, squ)) {
					canAdd = false;
					break;
				}
			}
			if (canAdd) {
				squares.push(newSqu);
			}
		}
	}
	return squares;
}
function squaresIntersect(squ1, squ2) {
	return ((squ1.i <= squ2.i && squ1.i+squ1.s > squ2.i) || (squ2.i <= squ1.i && squ2.i+squ2.s > squ1.i)) && ((squ1.j <= squ2.j && squ1.j+squ1.s > squ2.j) || (squ2.j <= squ1.j && squ2.j+squ2.s > squ1.j))
}
function generateSquare() {
  let s = randInt(2, maxSize);
  let i = randInt(margin, N-margin-s+1);
  let j = randInt(margin, N-margin-s+1);
  let p = randInt(margin, N-margin-s+1);
  let q = randInt(margin, N-margin-s+1);
  let l = randInt(margin, N-margin-s+1);
  let squ = {
    i: i,
    j: j,
    p: p,
    q: q,
    l: l,
    s: s
  };
  return squ;
}
class Random {
  constructor() {
    this.useA = false;
    let sfc32 = function (uint128Hex) {
      let a = parseInt(uint128Hex.substr(0, 8), 16);
      let b = parseInt(uint128Hex.substr(8, 8), 16);
      let c = parseInt(uint128Hex.substr(16, 8), 16);
      let d = parseInt(uint128Hex.substr(24, 8), 16);
      return function () {
        a |= 0; b |= 0; c |= 0; d |= 0;
        let t = (((a + b) | 0) + d) | 0;
        d = (d + 1) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = (c << 21) | (c >>> 11);
        c = (c + t) | 0;
        return (t >>> 0) / 4294967296;
      };
    };
    this.prngA = new sfc32(tokenData.hash.substr(2, 32));
    this.prngB = new sfc32(tokenData.hash.substr(34, 32));
    for (let i = 0; i < 1e6; i += 2) {
      this.prngA();
      this.prngB();
    }
  }
  random_dec() {
    this.useA = !this.useA;
    return this.useA ? this.prngA() : this.prngB();
  }
  random_num(a, b) {
    return a + (b - a) * this.random_dec();
  }
  random_int(a, b) {
    return Math.floor(this.random_num(a, b + 1));
  }
  random_bool(p) {
    return this.random_dec() < p;
  }
  random_choice(list) {
    return list[this.random_int(0, list.length - 1)];
  }
}