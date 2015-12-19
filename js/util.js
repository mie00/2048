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
