WBind = function() {
	this.prop = {} ;
	this._elem = {} ;
	this._check = {} ;
	this._func = {} ;
	this._getobj = function(elem) {
		var e ;
		if(typeof elem == "string") {
			if(elem.substr(0,1)=="#") e = document.getElementById(elem.substr(1)) ;
			else e = document.querySelectorAll(elem) ;
		} else {
			e = elem ;
		}
		return e ;		
	}
}

WBind.prototype.bindHtml= function(name,elem,func) {
	var e = this._getobj(elem);
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
WBind.prototype.bindStyle= function(name,elem,css,func) {
	var e = this._getobj(elem);
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
WBind.prototype.bindAttr= function(name,elem,attr,func) {
	var e = this._getobj(elem);
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
WBind.prototype.bindInput= function(name,elem,func) {
	var e = this._getobj(elem);
	if(!e) return false ;
	if(!func) func={} ;
	this._func[name] = func ;

	this._elem[name] = e ;
	Object.defineProperty(this,name,{
		get: function() {
//			this.prop[name] = e.value ;
			var v = _getprop(name) ;
			if(this._func[name].get) this._func[name].get(v) ;
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
		for(var i in e) {
			if( typeof e[i] != "object") continue ;
			e[i].addEventListener("change", function(ev) {
				if(this.type=="checkbox" ) {
					self._check[name][this.value] = this.checked ;
					self.prop[name] = _getprop(name);
				}
				else self.prop[name] = this.value ;
				console.log("get "+name+"="+self.prop[name])
				if(self._func[name].change) self._func[name].change(_getprop(name)) ;
			})
			
			if(e[i].type=="radio" && e[i].checked) v = e[i].value ;
			else if(e[i].type=="checkbox" )  {
				if(e[i].checked) v.push(e[i].value) ;
				self._check[name][e[i].value] = e[i].checked;
			}
		}
	} else {
		v = _getval(e) ;
		e.addEventListener("change", function(ev) {
			var val = _getval(this) ;
			self.prop[name] = val ;
			console.log("get "+name+"="+self.prop[name])
			if(self._func[name].change) self._func[name].change(self.prop[name]) ;
		})
		e.addEventListener("input", function(ev) {
			var val = _getval(this) ;
			self.prop[name] = val ;
	//		console.log("get "+name+"="+this.value)
			if(self._func[name].input) self._func[name].input(val) ;
		})
	}

	this.prop[name] = v ;
	if(self._func[name].input) self._func[name].input(v) ;
	if(self._func[name].change) self._func[name].change(v) ;


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
	function _getval(e) {
		var v = e.value ;
		if(e.type=="checkbox") {
			v = e.checked ;
		}
		if(e.type=="select-multiple") {
			var o = e.querySelectorAll("option") ;
			v = [] ;
			for(var i in o) {
				if(o[i].selected) v.push(o[i].value) ;
			}
		}
		return v ;		
	}
	function _setval(name,v) {
		var e = self._elem[name] ;
		if(e instanceof NodeList) {
			if(e[0].type=="radio") {
				for(var i in e) {
					if(e[i].value == v) e[i].checked = true ;
				}
			}
			else if(e[0].type=="checkbox") {
				var chk = {} ;
				for(var i=0; i<v.length;i++) {
					chk[v[i]] = true ;
				}
				for(var i in e) {
					e[i].checked = chk[e[i].value] ;
				}
				self._check[name] = chk ;
			}
		} 
		else if(e.type=="checkbox") e.checked = v ;
		else if(e.type=="select-multiple") {
			var o = e.querySelectorAll("option") ;
			for(var i in o) {
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

WBind.prototype.getCheck = function(name) {
	return this._check[name] ;
}
WBind.prototype.setFunc = function(name,func) {
	return this._func[name] = func  ;
}

WBind.prototype.bindAllInput = function(base) {
	if(!base) base = document ;
	var o = base.querySelectorAll("input,select") ;
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




function $log(msg) {
	console.log(msg) ;
}
WBind.addev = function(id,event,fn,root) {
	if(!root) root = document ;
	if(typeof id == "string") {
		console.log(id) ;
		if(id.substr(0,1)=="#") e = root.getElementById(id.substr(1)) ;
	} else {
		e = id ;
	}
	if(e) {
		e.addEventListener(event,fn) ;
	}
}
WBind.set = function(data,root) {
	if(!root) root = document ;
	if(!(data instanceof Array)) data = [data] ;
	for(var i =0;i<data.length;i++) {
		var d = data[i] ;
		var e ;
		if(d.id) e = [root.getElementById(d.id)] ;
		if(d.sel) e = root.querySelectorAll(d.sel) ;
		if(e) {
			for(ee in e) {
				if(d.html) e[ee].innerHTML = d.html ;
				if(d.value) e[ee].value = d.value ;
				if(d.attr) e[ee].setAttribute(d.attr,d.value) ;
				if(d.style) {
					for(s in d.style) e[ee].style[s] = d.style[s] ;
				}
			}
		}
	}
}