(function(){var e=Widget.extend({attrs:{template:'<div class="dialog"><div class="bd"></div></div>',body:"",selectors:{confirmBtn:".dialog-confirm",cancelBtn:".dialog-cancel"},className:""},setup:function(){var e=this,t=this.get(),n=t.template;this.$element=$(n),this.element=this.$element[0],t.body.trim&&(t.body=t.body.trim()),this.$element.find(".bd").append($(t.body)),this.$mask=$('<div class="dialog-mask"></div>'),$(document.body).append(this.$element),this.$mask&&$(document.body).append(this.$mask),this._bindEvents(),this.$element.addClass(this.get("className"))},_bindEvents:function(){var e=this,t=this.get("selectors");this.$element.delegate(t.confirmBtn,"click",function(t){t.preventDefault(),e.hide(),e._deferred.resolve(!0)}),this.$element.delegate(t.cancelBtn+" , .close","click",function(t){t.preventDefault(),e.hide(),e._deferred.resolve()})},show:function(){return this._deferred=$.Deferred(),this.$element.show(),this._center(),this.$mask.show(),this._deferred},hide:function(){this.$element.hide(),this.$mask.hide()},refresh:function(){this._center()},_center:function(){var e=this.$element.width(),t=this.$element.height();this.$element.css({"margin-left":"-"+e/2+"px","margin-top":"-"+t/2+"px"})}}),t=new e({template:'<div class="dialog"><div class="bd"></div><div class="ft"><a href="###" class="dialog-cancel dialog-btn">\u53d6\u6d88</a><a href="###" class="dialog-confirm dialog-btn">\u786e\u5b9a</a></div></div>',body:"",className:"public-dialog"}),n,r;$.extend(e,{alert:function(t){return e._show("alert",t)},confirm:function(t){return e._show("confirm",t)},toast:function(e){n||(n=$('<div class="dialog dialog-type-toast anim-fadeout"></div>').appendTo(document.body).show()),n.html(e).remove().appendTo(document.body).show();var t=n.width(),r=n.height();n.css({"margin-left":"-"+t/2+"px","margin-top":"-"+r/2+"px"})},_show:function(e,n){return typeof n=="string"?t.$element.find(".bd").html(n):t.$element.find(".bd").html("").append($(n)),r&&t.$element.removeClass("dialog-type-"+r),t.$element.addClass("dialog-type-"+e),r=e,t.show()}}),this.Dialog=e})();