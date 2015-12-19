var Util = {
	range: function(a,b){
		// this function is like python's range
		// it takes two integers and return an array of integers
		// starting from the first upto but not including the second
		// > range(1, 2)
		// [1]
		// > range(0, 4)
		// [0, 1, 2, 3]
		// at also can take one integer (the second will be undefined)
		// and it will generate an array of integers starting at 0
		// upto but not including the given integer
		// > range(3)
		// [0, 1, 2]
		if (b === undefined) {
			b = a
			a = 0
		}
		return Array.apply(null,{length:b-a}).map(function(x,y){return y+a})
	},
	zeros: function(n){
		// this function take an integer and returns an array of zeros with that length
		// > zeros(1)
		// [0]
		// zeros(3)
		// [0, 0, 0]
		return Array.apply(null,{length:n}).map(function(){return 0})
	},
	randInt: function(a,b){
		// this function takes two numbers a, b and returns a random number n
		// so that a <= n < b
		// it uses a function called Math.random that takes no arguments
		// and return a random number m so that
		// 0 <= m <1
		// at also can take one argument (the second will be undefined)
		// and it will consider the range starts from zero up to the given argument
		if (b === undefined) {
			b = a
			a = 0
		}
		var d = b-a
		return Math.floor(Math.random() * d + a)
	},
	randChoice: function(arr){
		// this function takes an array and give a random element
		// it should use the previous function randInt
		return arr[this.randInt(arr.length)]
	},
	copy: function copy(arr){
		// this function copies an array recursively so it will
		// be a different instance allowing modifications of them
		// separately.
		// it should handle nested arrays
		if(!Array.isArray(arr)) return arr
		return arr.map(copy)
	},
	zip: function (arr1,arr2){
		// this function takes two arrays and return their elements zipped
		// > zip([1, 2, 3], [4, 5, 6])
		// [[1, 4], [2, 5], [3, 6]]
		return arr1.map(function(x,y){
			return [x,arr2[y]]
		})
	},
	is_equal: function (arr1,arr2){
		// this function takes two arrays and return if their elements
		// are equals recursively
		// it should handle nested arrays
		// > is_equal([1, 2, 3], [1, 2, 3])
		// true
		// > is_equal([1, 2, [3, 4]], [1, 2, [3, 4]])
		// true
		// > is_equal([1, 1, [3, 4]], [1, 2, [3, 4]])
		// false
		// > is_equal([1, 1, [3, 4]], [1, [3, 4]])
		// false
		// > is_equal([1, 1, [3, 4]], [1, 1, [3, 5]])
		// false
		// > is_equal([1, 1, [3, 4]], [1, 1, [3]])
		// false
		var self = this
		if(!Array.isArray(arr1) || !Array.isArray(arr2)) return arr1 == arr2
		return this.all(this.zip(arr1,arr2).map(function(x){return self.is_equal(x[0],x[1])}))
	},
	all: function (arr){
		// this function takes an array and returns if all of its elements
		// are true if treated as boolean
		// you can check this using !!element
		// > all([1, 2, 3])
		// true
		// > all([0, 1, 2, 3])
		// false
		// > all([1, 2, "", 3])
		// false
		// > all([1, 2, "M", 3])
		// true
		for(var i in arr){
			if(!arr[i])
				return false
		}
		return true
	},
	any: function (arr){
		// this function takes an array and returns if any of its elements
		// is true if treated as boolean
		// you can check this using !!element
		// > any([1, 0, ""])
		// true
		// > any([0, "", false])
		// false
		// > any([1, 2, "", 3])
		// true
		for(var i in arr){
			if(arr[i])
				return true
		}
		return false
	},
	sum: function(arr){
		// this function takes an array of integers and returns the sum of its elements
		// > sum([1,2])
		// 3
		// > sum([])
		// 0
		return arr.reduce(function(x,y){return x+y},0)
	},
}

var Model = function(length){
	var NUM_OF_INSERTS = [1]
	var INSERTED = [2,2,2,2,2,2,2,2,2,4]
	var self = this
	self.length = length
	self.NewState = function(length){
		// this function returns a square 2d array of zeros with the given length
		// it should use Util.zeros
		// > NewState(1)
		// [[0]]
		// > NewState(4)
		// [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
		return Util.zeros(length).map(function(x){return Util.zeros(length)})
	}

	self.state = self.NewState(self.length)

	self.calc_score = function(state){
		// this function returns the maximum number in the given state
		// it should use Math.max
		// > calc_score([[2, 2, 4], [2, 16, 4], [2, 8, 8]])
		// 16
		return Math.max.apply(Math,state.map(Math.max.apply.bind(Math.max,Math)))
	}
	self.is_finished = function(){
		var res = true
		for (var i = 0;i<self.length;i++){
			self.rotate90()
			for(var j in self.state){
				if(res && self.solveable_row(self.state[j])){
					res = false
				}
			}
		}
		return res
	}
	self.finished = function(){
		if(self.is_finished()){
			self.score = self.calc_score(self.state)
		}
	}
	self.solveable_row = function(row){
		// this function takes a row (array) and checks if
		// it has an empty element (with a zero)
		// any equal elements next to each others
		// > solveable_row([2, 4, 8])
		// false
		// > solveable_row([2, 2, 8])
		// true
		// > solveable_row([2, 0, 8])
		// true
		var b = row.filter(function(x){return x})
		if(b.length<row.length) return true;
		for (var i in b){
			if(b[+i+1] && b[i] === b[+i+1]){
				return true
			}
		}
		return false
	}
	self.compact = function(){
		self.state = self.compacted(Util.copy(self.state))
	}
	self.compacted = function(state){
		// this function should apply self.compacted_row
		// to each row in state
		// and return the result as the same form
		return state.map(function(row){
			return self.compacted_row(row)
		})
	}
	self.compacted_row = function(row){
		// this function takes a row and return it compacted
		// it removes the empty cells and add them back to the end
		// and it compines any two adjacent elemnt to an element with the douple value
		// > compacted_row([2, 2, 4])
		// [4, 4, 0]
		// > compacted_row([0, 2, 4])
		// [2, 4, 0]
		// > compacted_row([0, 2, 2])
		// [4, 0, 0]
		var b = row.filter(function(x){return x})
		for (var i in b){
			if(b[+i+1] && b[i] === b[+i+1]){
				b[i] = 2 * b[i]
				b.splice(i+1,1)
			}
		}
		return b.concat(Util.zeros(row.length - b.length))
	}
	self.compact_once = function(){
		self.state = self.compacted_once(Util.copy(self.state))
	}
	self.compacted_once = function(state){
		// this function should apply self.compacted_row_once
		// to each row in state
		// and return the result as the same form
		return state.map(function(row){
			return self.compacted_row_once(row)
		})
	}
	self.compacted_row_once = function(row){
		// this function takes a row and return it compacted once
		// it starts from the first elemnt and checks for an empty or duplicated
		// cell and so it removes or compines them and returns
		// > compacted_row_once([2, 2, 4])
		// [4, 4, 0]
		// > compacted_row_once([0, 2, 4])
		// [2, 4, 0]
		// > compacted_row_once([0, 2, 2])
		// [2, 2, 0]
		// > compacted_row_once([2, 0, 2])
		// [2, 2, 0]
		// > compacted_row_once([2, 2, 0])
		// [4, 0, 0]
		var b = row.slice()
		for (var i in b){
			if(b[i] === 0){
				b.splice(i,1)
				break
			}
			else if(b[+i+1] && b[i] === b[+i+1]){
				b[i] = 2 * b[i]
				b.splice(+i+1,1)
				break
			}
		}
		return b.concat(Util.zeros(row.length - b.length))
	}
	self.rotate = function(dir){
		while(dir<0) dir+=4
		for (var i = 0;i<dir;i++){
			self.rotate90()
		}
	}
	self.rotate90 = function(){
		var state = self.NewState(self.length)
		for (var i in self.state){
			for (var j in self.state){
				var t = self.rotate90_point([i,j])
				state[i][j] = self.state[t[0]][t[1]]
			}
		}
		self.state = state
	}
	self.rotate90_point = function(p){
		var t = self.translate(
			self.rotate90_point_center(
				self.translate(
					p,[((self.length-1)/2),((self.length-1)/2)]
				)
			),
		[-((self.length-1)/2),-((self.length-1)/2)])
		return [~~(t[0]),~~(t[1])]
	}
	self.translate = function(point,center){
		// this function should take a point as an array of x,y dimentions
		// and then translates it to a new coordinate system which has a center
		// at center argument
		// > transform([1,2],[1,1])
		// [0, 1]
		x1 = point[0]
		y1 = point[1]
		x = center[0]
		y = center[1]
		return [x1-x,y1-y]
	}
	self.rotate90_point_center = function(point){
		// this function should take a point as an array of x,y dimentions
		// and then rotates it 90 degrees clockwise
		// > transform([1,2])
		// [2, -1]
		// > transform([1,0])
		// [0, -1]
		x = point[0]
		y = point[1]
		return [y,-x]
	}
	self.score = null
	self.random = function(){
		return self.random_numbers(Util.randChoice(NUM_OF_INSERTS))
	}
	self.random_numbers = function(n){
		for (var i = 0;i<n;i++){
			self.random_once()
		}
	}
	self.random_once = function(n){
		var zeros = self.zeros()
		if(zeros.length){
			var choise = Util.randChoice(zeros)
			self.state[choise[0]][choise[1]] = Util.randChoice(INSERTED)
		}
	}
	self.zeros = function(){
		return self.calculate_zeros(self.state)
	}
	self.calculate_zeros = function(state){
		// returns an array of empty cells in state as a point of row,column
		// > calculate_zeros([[1, 2], [3, 4]])
		// []
		// > calculate_zeros([[1, 2], [3, 0]])
		// [[1, 1]]
		// > calculate_zeros([[1, 2], [0, 1]])
		// [[1, 0]]
		// > calculate_zeros([[1, 0], [0, 1]])
		// [[0,1], [1, 0]]
		var zeros = []
		for (var i in state){
			for (var j in state){
				if(state[i][j] === 0){
					zeros.push([+i,+j])
				}
			}
		}
		return zeros
	}
}

var Engine = function(length){
	var self = this
	self.length = length
	self.move = function(dir){
		var steps = []
		var prev = Util.copy(self.model.state)
		if(! self.model.score){
			for(var i = 0;i<length;i++){
				self.model.rotate(dir)
				self.model.compact_once()
				self.model.rotate(-dir)
				steps.push(Util.copy(self.model.state))
			}
			if(!Util.is_equal(prev,steps[steps.length-1])){
				self.model.random()
			}

			steps.push(Util.copy(self.model.state))
			self.model.finished()
		}
		return [steps,self.model.score]
	}
	self.up = self.move.bind(self,1)
	self.down = self.move.bind(self,3)
	self.left = self.move.bind(self,0)
	self.right = self.move.bind(self,2)
	self.reset_model = function(){
		self.model = new Model(length)
		self.model.random()
		return self.model.state
	}
}

var Controller = function(engine){
	var self = this
	self.length = engine.length
	self.engine = engine
	self.reset_model = self.engine.reset_model.bind(self.engine)
	self.up = self.engine.up.bind(self.engine)
	self.down = self.engine.down.bind(self.engine)
	self.left = self.engine.left.bind(self.engine)
	self.right = self.engine.right.bind(self.engine)
}

var View = function(ctrl){
	var self = this
	self.length = ctrl.length
	self.finished = false
	self.reset_model = function(){
		self.finished = false
		document.getElementById('score').innerHTML = ''
		self.draw_state(ctrl.reset_model())
	}
	self.draw_state = function(state){
		;[].slice.call(document.querySelectorAll('.place')).map(function(x,y){
			var val = state[Math.floor(y/state.length)][y%state.length]
			x.innerHTML = val
			x.setAttribute('val',val)
		})
	}
	self.draw = function(states){
		for(var i in states){
			var state = states[i]
			setTimeout(self.draw_state.bind(self,state),50*i)
		}
	}
	self.score = function(sc){
		self.finished = true
		document.getElementById('score').innerHTML = sc
	}
	self.invoke = function(action){
		if(!self.finished){
			var c = action()
			self.draw(c[0])
			if(c[1])self.score(c[1])
		}
	}
	var actions = [ctrl.left,ctrl.up,ctrl.right,ctrl.down]	
	self.press_cb = function(event){
		var keyCode = +event.keyCode
		if(~[37,38,39,40].indexOf(keyCode)){
			self.invoke(actions[keyCode-37])
		}
	}

	self.bind = function(){
		document.addEventListener('keypress',self.press_cb)
		document.getElementById('new').addEventListener('click',self.reset_model)
	}
	self.bind()
	self.reset_model()

}

var App = function(length){
	self.engine = new Engine(length)
	self.controller = new Controller(engine)
	self.view = new View(controller)
}

var app = new App(4)