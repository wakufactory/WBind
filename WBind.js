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

WBind.bindHtml= function(obj,name,elem,func) {
	var e = WBind._getobj(elem);
	if(!e) return false ;
	obj._elem[name] = e ;
	if(!func) func={} ;
	obj._func[name] = func ;

	Object.defineProperty(obj,name,{
		get: function() {
//			console.log("get "+name)
			if((e instanceof NodeList || Array.isArray(e))) obj.prop[name] = e[0].innerHTML ;
			else obj.prop[name] = e.innerHTML ;
			return obj.prop[name]  ;
		},
		set:function(val) {
//			console.log("set "+name) 
			if(obj._func[name].set) val = obj._func[name].set(val) ;
			obj.prop[name] = val ;
			if((e instanceof NodeList || Array.isArray(e))) {
				for(var i=0;i<e.length;i++) {
					obj._elem[name][i].innerHTML = val 
				}
			} else  obj._elem[name].innerHTML = val ;
		}
	})
	if((e instanceof NodeList || Array.isArray(e))) obj.prop[name] = e[0].innerHTML ;
	else obj.prop[name] = e.innerHTML ;
	return true ;
}
WBind.bindStyle= function(obj,name,elem,css,func) {
	var e = WBind._getobj(elem);
	if(!e) return false ;
	obj._elem[name] = e ;
	if(!func) func={} ;
	obj._func[name] = func ;	

	Object.defineProperty(obj,name,{
		get: function() {
//			console.log("get "+name)
			if((e instanceof NodeList || Array.isArray(e))) obj.prop[name] = e[0].style[css] ;
			else obj.prop[name] = e.style[css] ;
			return obj.prop[name]  ;
		},
		set:function(val) {
//			console.log("set "+name) 
			if(obj._func[name].set) val = obj._func[name].set(val) ;
			obj.prop[name] = val ;
			if((e instanceof NodeList || Array.isArray(e))) {
				for(var i=0;i<e.length;i++) {
					obj._elem[name][i].style[css] = val 
				}
			} else obj._elem[name].style[css] = val ;
		}
	})
	if((e instanceof NodeList || Array.isArray(e))) obj.prop[name] = e[0].style[css] ;
	else obj.prop[name] = e.style[css] ;
	return true ;	
}
WBind.bindAttr= function(obj,name,elem,attr,func) {
	var e = WBind._getobj(elem);
	if(!e) return false ;
	obj._elem[name] = e ;
	if(!func) func={} ;
	obj._func[name] = func ;	

	Object.defineProperty(obj,name,{
		get: function() {
//			console.log("get "+name)
			if((e instanceof NodeList || Array.isArray(e))) obj.prop[name] = e[0].getAttribute(attr) ;
			else obj.prop[name] = e.getAttribute(attr) ;
			return obj.prop[name]  ;
		},
		set:function(val) {
//			console.log("set "+name) 
			if(obj._func[name].set) val = obj._func[name].set(val) ;
			obj.prop[name] = val ;
			if((e instanceof NodeList || Array.isArray(e))) {
				for(var i=0;i<e.length;i++) {
					obj._elem[name][i].setAttribute(attr,val) 
				}
			} else obj._elem[name].setAttribute(attr,val) ;
		}
	})
	if((e instanceof NodeList || Array.isArray(e))) obj.prop[name] = e[0].getAttribute(attr) ;
	else obj.prop[name] = e.getAttribute(attr) ;
	return true ;	
}
WBind.bindInput= function(obj,name,elem,func) {
	var e = WBind._getobj(elem);
	if(!e) return false ;
	if(!func) func={} ;
	obj._func[name] = func ;

	obj._elem[name] = e ;
	Object.defineProperty(obj,name,{
		get: function() {
//			obj.prop[name] = e.value ;
			var v = _getprop(name) ;
			if(obj._func[name].get) v = obj._func[name].get(v) ;
			return v  ;
		},
		set:function(val) {
//			console.log("set "+name) 
			if(obj._func[name].set) val = obj._func[name].set(val) ;
			obj.prop[name] = val ;
			_setval(name,val) ;
			if(obj._func[name].change) obj._func[name].change(_getprop(name)) ;
			if(obj._func[name].input) obj._func[name].input(_getprop(name)) ;
		}
	})
	var self = obj ;
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
	if(obj._func[name].get) v = obj._func[name].get(v) ;
	obj.prop[name] = v ;
	if(self._func[name].input) obj._func[name].input(v) ;
	if(self._func[name].change) obj._func[name].change(v) ;


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

WBind.getCheck = function(obj,name) {
	return obj._check[name] ;
}
WBind.setFunc = function(obj,name,func) {
	for(var f in func) {
		obj._func[name][f] = func[f] ;
	}
	var val = WBind._getval( obj._elem[name]) ;
	if(obj._func[name].get) val = obj._func[name].get(val) ;
	obj.prop[name] = val ;
	return obj._func[name]  ;
}

WBind.bindAllInput = function(obj,base) {
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
		WBind.bindInput(obj,i,na[i])
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