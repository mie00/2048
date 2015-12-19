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
