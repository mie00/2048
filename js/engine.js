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
