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
