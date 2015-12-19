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
