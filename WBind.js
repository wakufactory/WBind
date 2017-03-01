//WBind 
// license MIT
// 2017 wakufactory 
WBind = {} 

WBind.create = function() {
	return new WBind.obj ;
}
WBind.obj = function() {
	this.prop = {} ;
	this._elem = {} ;
	this._check = {} ;
	this._func = {} ;
	this._tobjs = [] ;
}

WBind._getobj = function(elem,root) {
	if(!root) root = document ;
	var e ;
	if(typeof elem == "string") {
		if(elem.substr(0,1)=="#") e = root.getElementById(elem.substr(1)) ;
		else e = root.querySelectorAll(elem) ;
	} else {
		e = elem ;
	}
	return e ;		
}
WBind._getval = function(e) {
	var v = e.value ;
	if(e.type=="checkbox") {
		v = e.checked ;
	}
	if(e.type=="select-multiple") {
		var o = e.querySelectorAll("option") ;
		v = [] ;
		for(var i=0;i<o.length;i++ ) {
			if(o[i].selected) v.push(o[i].value) ;
		}
	}
	if(e.type=="range") v = parseFloat(v) ;
	return v ;		
}

WBind.obj.prototype.bindHtml= function(name,elem,func) {
	var e = WBind._getobj(elem);
	if(!e) return false ;
	this._elem[name] = e ;
	if(!func) func={} ;
	this._func[name] = func ;

	Object.defineProperty(this,name,{
		get: function() {
//			console.log("get "+name)
			if((e instanceof NodeList || Array.isArray(e))) this.prop[name] = e[0].innerHTML ;
			else this.prop[name] = e.innerHTML ;
			return this.prop[name]  ;
		},
		set:function(val) {
//			console.log("set "+name) 
			if(this._func[name].set) val = this._func[name].set(val) ;
			this.prop[name] = val ;
			if((e instanceof NodeList || Array.isArray(e))) {
				for(var i=0;i<e.length;i++) {
					this._elem[name][i].innerHTML = val 
				}
			} else  this._elem[name].innerHTML = val ;
		}
	})
	if((e instanceof NodeList || Array.isArray(e))) this.prop[name] = e[0].innerHTML ;
	else this.prop[name] = e.innerHTML ;
	return true ;
}
WBind.obj.prototype.bindStyle= function(name,elem,css,func) {
	var e = WBind._getobj(elem);
	if(!e) return false ;
	this._elem[name] = e ;
	if(!func) func={} ;
	this._func[name] = func ;	

	Object.defineProperty(this,name,{
		get: function() {
//			console.log("get "+name)
			if((e instanceof NodeList || Array.isArray(e))) this.prop[name] = e[0].style[css] ;
			else this.prop[name] = e.style[css] ;
			return this.prop[name]  ;
		},
		set:function(val) {
//			console.log("set "+name) 
			if(this._func[name].set) val = this._func[name].set(val) ;
			this.prop[name] = val ;
			if((e instanceof NodeList || Array.isArray(e))) {
				for(var i=0;i<e.length;i++) {
					this._elem[name][i].style[css] = val 
				}
			} else this._elem[name].style[css] = val ;
		}
	})
	if((e instanceof NodeList || Array.isArray(e))) this.prop[name] = e[0].style[css] ;
	else this.prop[name] = e.style[css] ;
	return true ;	
}
WBind.obj.prototype.bindAttr= function(name,elem,attr,func) {
	var e = WBind._getobj(elem);
	if(!e) return false ;
	this._elem[name] = e ;
	if(!func) func={} ;
	this._func[name] = func ;	

	Object.defineProperty(this,name,{
		get: function() {
//			console.log("get "+name)
			if((e instanceof NodeList || Array.isArray(e))) this.prop[name] = e[0].getAttribute(attr) ;
			else this.prop[name] = e.getAttribute(attr) ;
			return this.prop[name]  ;
		},
		set:function(val) {
//			console.log("set "+name) 
			if(this._func[name].set) val = this._func[name].set(val) ;
			this.prop[name] = val ;
			if((e instanceof NodeList || Array.isArray(e))) {
				for(var i=0;i<e.length;i++) {
					this._elem[name][i].setAttribute(attr,val) 
				}
			} else this._elem[name].setAttribute(attr,val) ;
		}
	})
	if((e instanceof NodeList || Array.isArray(e))) this.prop[name] = e[0].getAttribute(attr) ;
	else this.prop[name] = e.getAttribute(attr) ;
	return true ;	
}
WBind.obj.prototype.bindInput= function(name,elem,func) {
	var e = WBind._getobj(elem);
	if(!e) return false ;
	if(!func) func={} ;
	this._func[name] = func ;

	this._elem[name] = e ;
	Object.defineProperty(this,name,{
		get: function() {
//			this.prop[name] = e.value ;
			var v = _getprop(name) ;
			if(this._func[name].get) v = this._func[name].get(v) ;
			return v  ;
		},
		set:function(val) {
//			console.log("set "+name) 
			if(this._func[name].set) val = this._func[name].set(val) ;
			this.prop[name] = val ;
			_setval(name,val) ;
			if(this._func[name].change) this._func[name].change(_getprop(name)) ;
			if(this._func[name].input) this._func[name].input(_getprop(name)) ;
		}
	})
	var self = this ;
	var v = null ;
	if((e instanceof NodeList || Array.isArray(e))) {
		if(e[0].type=="checkbox") self._check[name] = {} ;
		for(var i=0;i<e.length;i++) {
			if( typeof e[i] != "object") continue ;
			e[i].addEventListener("change", function(ev) {
				var val ;
				if(this.type=="checkbox" ) {
					self._check[name][this.value] = this.checked ;
					val = _getprop(name);
				}
				else val = this.value ;
				self.prop[name] = val ;
				if(self._func[name].get) val = self._func[name].get(val) ;
				console.log("get "+name+"="+val)
				if(self._func[name].change) self._func[name].change(val) ;
			})
			
			if(e[i].type=="radio" && e[i].checked) v = e[i].value ;
			else if(e[i].type=="checkbox" )  {
				if(e[i].checked) v.push(e[i].value) ;
				self._check[name][e[i].value] = e[i].checked;
			}
		}
	} else {
		v = WBind._getval(e) ;
		e.addEventListener("change", function(ev) {
			var val = WBind._getval(this) ;
			self.prop[name] = val ;
			if(self._func[name].get) val = self._func[name].get(val) ;
			console.log("get "+name+"="+val)
			if(self._func[name].change) self._func[name].change(val) ;
		})
		e.addEventListener("input", function(ev) {
			var val = WBind._getval(this) ;
			self.prop[name] = val ;
			if(self._func[name].get) val = self._func[name].get(val) ;
	//		console.log("get "+name+"="+this.value)
			if(self._func[name].input) self._func[name].input(val) ;
		})
	}
	if(this._func[name].get) v = this._func[name].get(v) ;
	this.prop[name] = v ;
	if(self._func[name].input) this._func[name].input(v) ;
	if(self._func[name].change) this._func[name].change(v) ;


	function _getprop(name) {
		var v ;
		if(self._check[name]) {
			v = [] ;
			for(var i in self._check[name]) {
				if(self._check[name][i]) v.push(i);
			}
			self.prop[name] = v ;
		} else  v = self.prop[name] ;
		return v ;
	}

	function _setval(name,v) {
		var e = self._elem[name] ;
		if(e instanceof NodeList || Array.isArray(e)) {
			if(e[0].type=="radio") {
				for(var i=0;i<e.length;i++ ) {
					if(e[i].value == v) e[i].checked = true ;
				}
			}
			else if(e[0].type=="checkbox") {
				var chk = {} ;
				for(var i=0; i<v.length;i++) {
					chk[v[i]] = true ;
				}
				for(var i=0;i<e.length;i++ ) {
					e[i].checked = chk[e[i].value] ;
				}
				self._check[name] = chk ;
			}
		} 
		else if(e.type=="checkbox") e.checked = v ;
		else if(e.type=="select-multiple") {
			var o = e.querySelectorAll("option") ;
			for(var i=0;i<o.length;i++ ) {
				o[i].selected = false ;
				for(var vi=0;vi<v.length;vi++) {
					if(o[i].value==v[vi]) o[i].selected = true ;
				}
			}			
		}
		else e.value = v ;	
	}
	return true ;
}

WBind.obj.prototype.getCheck = function(name) {
	return this._check[name] ;
}
WBind.obj.prototype.setFunc = function(name,func) {
	for(var f in func) {
		this._func[name][f] = func[f] ;
	}
	var val = WBind._getval( this._elem[name]) ;
	if(this._func[name].get) val = this._func[name].get(val) ;
	this.prop[name] = val ;
	return this._func[name]  ;
}

WBind.obj.prototype.bindAllInput = function(base) {
	if(!base) base = document ;
	var o = base.querySelectorAll("input,select,textarea") ;
	var na = {} ;
	for(var i=0;i<o.length;i++) {
		var n = o[i].name ;
		if(na[n]) {
			if(Array.isArray(na[n])) na[n].push(o[i]) ;
			else na[n] = [na[n],o[i]] ;
		} else na[n] = o[i] ;
	}
	for(var i in na) {
		this.bindInput(i,na[i])
	}
	return na ;
}


WBind.log = function(msg) {
	console.log(msg) ;
}
WBind.addev = function(id,event,fn,root) {
	var e = WBind._getobj(id,root) ;
	if(e) {
		e.addEventListener(event,function(ev) {
			if(!fn(ev)) ev.preventDefault() ;
		}) ;
	}
}
WBind.set = function(data,root) {
	if(!root) root = document ;
	if(!(data instanceof Array)) data = [data] ;
	for(var i =0;i<data.length;i++) {
		var d = data[i] ;
		var e ;
		if(d.obj) e = WBind._getobj(d.obj,root) ;
		if(d.id) e = root.getElementById(d.id) ;
		if(d.sel) e = root.querySelectorAll(d.sel) ;
		if(!e) continue ;
		if(!(e instanceof NodeList || Array.isArray(e))) e = [e] ;
		for(var ee=0;ee<e.length;ee++ ) {
			if(d.html) e[ee].innerHTML = d.html ;
			if(d.value) e[ee].value = d.value ;
			if(d.attr) e[ee].setAttribute(d.attr,d.value) ;
			if(d.style) {
				for(s in d.style) e[ee].style[s] = d.style[s] ;
			}
		}
	}
}

//bind timer
WBind.obj.prototype.updateTimer = function() {
	var now = new Date().getTime() ;
	var del = 0 ;
	for(var i=0;i<this._tobjs.length;i++) {
		var o = this._tobjs[i] ;
		if(o==null) continue ;
		
		if(o.st>now) continue ;
		if(o.et<=now) {
			this[o.key] = o.to ;
//			console.log("timeup "+o.key) ;
			if(o.opt.efunc) o.opt.efunc(o.to) ;
			this._tobjs[i] = null ;
			del++ ;
		} else {
			var t = (now-o.st)/(o.et-o.st) ;
			if(o.opt.tfunc) {
				if(typeof o.opt.tfunc =="string") {
					switch(o.opt.tfunc) {
						case "ease-in":
							t = t*t ;
							break ;
						case "ease-out":
							t = t*(2-t) ;
							break ;
						case "ease-inout":
							t = t*t*(3-2*t) ;
							break;
					}
				} else t = o.opt.tfunc(t) ;
			}
			var v = o.from + (o.to-o.from)* t;
//			console.log(o.key+"="+v) ;
			this[o.key] = v ;
		}
	}
	if(del>0) {
		var o = []
		for(var i=0;i<this._tobjs.length;i++) if(this._tobjs[i]!=null) o.push(this._tobjs[i]) ;
		this._tobjs = o ;
	}
}
WBind.obj.prototype.setTimer = function(key,to,ttime,opt) {
	if(!opt) opt = {} ;
	var cd ;
	if(opt.from) cd = opt.from  ;
	else cd = this[key] ;
	if(isNaN(cd)) cd = 0 ;
	if(cd == to) return ;
	var delay = 0 ;
	if(opt.delay) delay = opt.delay ;
	var now = new Date().getTime() ;
	var o =  {key:key,from:cd,to:to,st:now+delay,et:now+delay+ttime,opt:opt} ;
	this._tobjs.push(o)
//	console.log(o) ;
}
WBind.obj.prototype.clearTimer = function(key) {
	for(var i=0;i<this._tobjs.length;i++) {
		o = this._tobjs[i] ;
		if(o==null) continue ;
		if(o.key == key) {
			this._tobjs.splice(i,1) ;
			break;
		}
	}
}