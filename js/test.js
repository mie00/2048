var fns = {
    Util: {
        methods: ['range', 'zeros', 'zip', 'is_equal', 'all', 'any', 'sum'],
        init: function(obj){return obj},
        extended: {
            randInt: function(fn){
                var a = Array.apply(null,{length:100}).map(function(){return fn(5,10)})
                var b = Array.apply(null,{length:100}).map(function(){return fn(6)})
                return Math.min.apply(Math,a) == 5 &&
                    Math.max.apply(Math,a) == 9 &&
                    Math.min.apply(Math,b) == 0 &&
                    Math.max.apply(Math,b) == 5

            },
            randChoice: function(fn){
                var a = Array.apply(null,{length:100}).map(function(){return fn([1,2,3])})
                return !!(~a.indexOf(1) &&
                    ~a.indexOf(2) &&
                    ~a.indexOf(3))
            },
            copy: function(fn){
                var a = [[1,2,3],4];
                var b = fn(a);
                b[0][0] = 3
                b[1] = 5

                return a[0][0] == 1 &&
                    a[1] == 4
            },
        }
    },
    Model: {
        methods: ['NewState', 'calc_score', 'solveable_row', 'compacted_row', 'compacted_row_once', 'translate', 'rotate90_point_center', 'calculate_zeros'],
        init: function(obj){return new obj(4)},
        extended: {
            compacted: function(fn,obj){
                obj.compacted_row = function(x){return [1,1,x[0]]}
                return JSON.stringify(fn([[2,3],[4,5]])) === JSON.stringify([[1,1,2],[1,1,4]])
            },
            compacted_once: function(fn,obj){
                obj.compacted_row_once = function(x){return [1,1,x[0]]}
                return JSON.stringify(fn([[2,3],[4,5]])) === JSON.stringify([[1,1,2],[1,1,4]])
            },
        }
    }
}

var ErrorDet = function(){
    this.state = {}
};
ErrorDet.prototype.add = function(object,method,things) {
    var self = this;
    self.state[object] = self.state[object] || {};
    self.state[object][method] = self.state[object][method] || [];
    things.forEach(function(thing){
        self.state[object][method].push(thing)
    })
};
ErrorDet.prototype.draw = function() {  
    var stt = 0;
    var ftt = 0;
    for(var os in this.state){
        var st = 0;
        var ft = 0;
        for(var ms in this.state[os]){
            var s = 0;
            var f = 0;
            document.getElementById(os+'.'+ms+'.reg').innerHTML = this.state[os][ms].map(function(x){
                if(x[0]){
                    s++;
                    st++;
                    stt++;
                    return '<p class="success">test succeeded'+((x.length==4)?': '+x[1]+' returned '+x[2]:'')+'</p>'
                }
                else{
                    f++;
                    ft++;
                    ftt++;
                    return '<p class="error">test failed'+((x.length==4)?': '+x[1]+' should return '+x[2]+' but returned '+JSON.stringify(x[3]):'')+'</p>'
                }
            }).join('')
            document.getElementById(os+'.'+ms+'.stat').innerHTML = s+'/'+(s+f)+' succeeded'
            document.getElementById(os+'.'+ms+'.stat').className = ["error","success"][~~(!f)]

        }
        document.getElementById(os+'.stat').innerHTML = ft?st+'/'+(st+ft)+'succeeded':'all succeeded'
        document.getElementById(os+'.stat').className = ["error","success"][~~(!ft)]
    }
    document.getElementById('all.stat').innerHTML = ftt?stt+'/'+(stt+ftt)+'succeeded':'all succeeded'
    document.getElementById('all.stat').className = ["error","success"][~~(!ftt)]
};

var tests = function(name, body){
    var a = body.split('\n')
        .filter(function(line){
            return line.match(/^\s+\/\/\s/)
        })
        .map(function(line){
            return line.replace(/^\s+\/\/\s/,'')
        })
    var sa = []
    for (var i=0,j=a.length-1;i<=j;i++){
        if (a[i][0] === '>'){
            sa.push([a[i].replace(/^>\s+/,''),a[i+1]])
            i++
        }
    }
    return sa
}


var check_func_doc = function(name, fn,i){
    var args = '['+i[0].match(/^[a-zA-Z0-9_]+\((.+)\)$/)[1]+']'
    var args2 = JSON.parse(args)
    i.push(fn.apply(null,args2))
    i.unshift(JSON.stringify(JSON.parse(i[i.length-2]))==JSON.stringify(i[i.length-1]))
}
var check_doc = function(name, fn,t){
    for (var i in t){
        check_func_doc(name,fn,t[i])
    }
    return t
}
var check_func = function(name, fn){
        var t = tests(name,fn.toString());
        return check_doc(name, fn.bind(this), t)

}
var check_obj = function(name, attrs, errors){
    var errors = errors || new ErrorDet()
    var _obj = window[name]
    for (var j in attrs.methods){
        var fn_name = attrs.methods[j]
        var obj = attrs.init(_obj)
        var fn = obj[fn_name];
        errors.add(name,fn_name,check_func.call(obj,fn_name, fn))
    }
    for (var fn_name in attrs.extended){
        var obj = attrs.init(_obj)
        var test_fn = attrs.extended[fn_name]
        var fn = obj[fn_name];
        errors.add(name,fn_name,[[test_fn(fn.bind(obj),obj)]])
    }
    return errors
}
var check_obj_fn = function(f_n, name, attrs, errors){
    var errors = errors || new ErrorDet()
    var _obj = window[name]
    for (var j in attrs.methods){
        var fn_name = attrs.methods[j]
        if(fn_name !== f_n)
            continue;
        var obj = attrs.init(_obj)
        var fn = obj[fn_name];
        errors.add(name,fn_name,check_func.call(obj,fn_name, fn))
    }
    for (var fn_name in attrs.extended){
        if(fn_name !== f_n)
            continue;
        var obj = attrs.init(_obj)
        var test_fn = attrs.extended[fn_name]
        var fn = obj[fn_name];
        errors.add(name,fn_name,[[test_fn(fn.bind(obj),obj)]])
    }
    return errors
}
var check_all = function(fns){
    var errors = new ErrorDet()
    for (var name in fns){
        var attrs = fns[name]
        check_obj(name,attrs,errors)
    }
    return errors
}
var c_all = function(){
    return check_all(fns).draw()
}
var c_model = function(m){
    return check_obj(m,fns[m]).draw()
}
var c_function = function(m,fn){
    return check_obj_fn(fn,m,fns[m]).draw()
}
var update = function(id){
    if(id == 'all.button'){
        return c_all()
    }
    var arr = id.split('.');
    if(arr.length == 2){
        return c_model(arr[0])
    }
    else if(arr.length == 3){
        return c_function(arr[0],arr[1])
    }
}
var c = function(){
    var id = this.id;
    if(window.location.search.slice(1) != id)
        return window.location.search = id
    else {
        return update(id)
    }
}
var init_dom = function(){
    var html = '<div class="all" id="all"> <p class="title"> 2048 <span class="right"><span id="all.button" class="button">&#10148;</span><span id="all.stat"></span></span>'+'</p>'
    for (var obj in fns){
        var attrs = fns[obj]
        var methods = Object.keys(attrs.extended).concat(attrs.methods)
        html += '<div class="obj" id="'+obj+'"> <p class="title"> '+obj+' <span class="right"><span id="'+obj+'.button" class="button">&#10148;</span><span id="'+obj+'.stat"></span></span>'+'</p>'+
        methods.map(function(method){
            var n = obj+'.'+method
            return '<div class="method" id="'+n+'"> <p class="title"> '+n+' <span class="right"><span id="'+n+'.button" class="button">&#10148;</span><span id="'+n+'.stat"></span></span>'+'</p>'+
                '<div class="cases" id="'+n+'.reg">'+
                '</div>'+
                '</div>'
        }).join('')+
        '</div>'
    }
    html += '</div>'
    document.getElementById('test').innerHTML = html;
}
var bind_dom = function(){
    document.getElementById('all.button').addEventListener('click',c)
    for (var obj in fns){
        document.getElementById(obj+'.button').addEventListener('click',c)
        var attrs = fns[obj]
        var methods = Object.keys(attrs.extended).concat(attrs.methods)
        methods.forEach(function(method){
            var n = obj+'.'+method
            document.getElementById(n+'.button').addEventListener('click',c)
        })
    }
}
var main = function(){
    init_dom();
    bind_dom();
    if(window.location.search){
        var button = document.getElementById(window.location.search.slice(1))
        button.click()
        button.scrollIntoView(true);
    }
    
}
main();