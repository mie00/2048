var App = function(length){
	self.engine = new Engine(length)
	self.controller = new Controller(engine)
	self.view = new View(controller)
}
