var LENGTH = 4
var NUM_OF_INSERTS = [0,0,1,1,1,1,1,1,2]
var INSERTED = [2,2,2,2,4,4]

var Util = {
	range : function(a,b){
		if (b === undefined) {
			b = a
			a = 0
		}
		return Array.apply(null,{length:b-a}).map(function(x,y){return y+a})
	},
	zeros : function(n){
		return Array.apply(null,{length:n}).map(function(){return 0})
	},
	randInt : function(a,b){
		if (b === undefined) {
			b = a
			a = 0
		}
		var d = b-a
		return Math.floor(Math.random() * d + a)
	},
	randChoice : function(arr){
		return arr[	this.randInt(arr.length)]
	},
	copy : function copy(arr){
		if(!Array.isArray(arr)) return arr
		return arr.map(copy)
	},
	sum : function(arr){
		return arr.reduce(function(x,y){return x+y},0)
	},
}

var Model = function(){
	var self = this
	var NWESTATE = function(){return Util.zeros(LENGTH).map(function(x){return Util.zeros(LENGTH)})}
	self.calc_score = function(){return Math.max.apply(Math,self.state.map(Math.max.apply.bind(Math.max,Math)))}
	self.is_finished = function(){
		var res = true
		for (var i = 0;i<LENGTH;i++){
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
			self.score = self.calc_score()
		}
	}
	self.solveable_row = function(row){
		var b = row.filter(function(x){return x})
		if(b.length<LENGTH) return true;
		for (var i in b){
			if(b[+i+1] && b[i] === b[+i+1]){
				return true
			}
		}
		return false
	}
	self.compact = function(){
		self.state = self.state.map(function(row){
			return self.compact_row(row)
		})
	}
	self.compact_once = function(){
		self.state = self.state.map(function(row){
			return self.compact_row_once(row)
		})
	}
	self.compact_row = function(row){
		var b = row.filter(function(x){return x})
		for (var i in b){
			if(b[+i+1] && b[i] === b[+i+1]){
				b[i] = 2 * b[i]
				b.splice(i+1,1)
			}
		}
		return b.concat(Util.zeros(LENGTH - b.length))
	}
	self.compact_row_once = function(row){
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
		return b.concat(Util.zeros(LENGTH - b.length))
	}
	self.rotate = function(dir){
		while(dir<0) dir+=LENGTH
		for (var i = 0;i<dir;i++){
			self.rotate90()
		}
	}
	self.rotate90 = function(){
		var state = NWESTATE()
		for (var i in self.state){
			for (var j in self.state){
				var t = self.rotate90_point(i,j)
				state[i][j] = self.state[t[0]][t[1]]
			}
		}
		self.state = state
	}
	self.rotate90_point = function(x,y){
		var t = self.rotate90_point_center(x-1.5,y-1.5)
		return [~~(t[0]+1.5),~~(t[1]+1.5)]
	}
	self.rotate90_point_center = function(x,y){
		return [y,-x]
	}
	self.state = NWESTATE()
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
		var zeros = []
		for (var i in self.state){
			for (var j in self.state){
				if(self.state[i][j] === 0){
					zeros.push([i,j])
				}
			}
		}
		return zeros
	}
}

var Engine = function(){
	var self = this
	self.move = function(dir){
		var steps = []
		if(! self.model.score){
			for(var i = 0;i<LENGTH;i++){
				self.model.rotate(dir)
				self.model.compact_once()
				self.model.rotate(-dir)
				steps.push(Util.copy(self.model.state))
			}
			self.model.random()
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
		self.model = new Model()
		return self.model.state
	}
}

var Controller = function(engine){
	var self = this
	self.engine = engine
	self.reset_model = self.engine.reset_model.bind(self.engine)
	self.up = self.engine.up.bind(self.engine)
	self.down = self.engine.down.bind(self.engine)
	self.left = self.engine.left.bind(self.engine)
	self.right = self.engine.right.bind(self.engine)
}

var View = function(ctrl){
	var self = this
	self.finished = false
	self.reset_model = function(){
		self.draw_state(ctrl.reset_model())
	}
	self.draw_state = function(state){
		[].slice.call(document.querySelectorAll('.place')).map(function(x,y){
			var val = state[Math.floor(y/LENGTH)][y%LENGTH]
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

var App = function(){
	self.engine = new Engine()
	self.controller = new Controller(engine)
	self.view = new View(controller)
}

var app = new App()