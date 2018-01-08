import $ from 'jquery';
import './simselect.scss';
const SimSelect = ((el, conf) => {
	const ISTOUCH = navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i) ? true : false;

	class SimSelect{
		constructor(el, conf){
			this.init(el, conf);
			this.conf = conf;
		}

		init (el, conf) {
			var $el = $(el),
				self = this;
			
			this.isOpen = false;
			this.key = '';
			this.dataList = [];
			this.textList = [];
			this.isOpen = false;
			this.$el = $el;
			this.isDisabled = $el.prop('disabled');
			this.render();

			var $simSelect = $el.nextAll('.sim-select'),
				$simHead = $simSelect.find('.sim-head'),
				$simList = $simSelect.find('.sim-list');
			
			this.$simSelect = $simSelect;
			
			if(this.isDisabled) $simSelect.addClass('disabled');
			
			$simSelect.on('focus', function(){
				$simSelect.addClass('focus');

			}).on('blur', function(){
				$simSelect.removeClass('focus');
				self.$el.val($simHead.find('.current').attr('str'));
				self.close();

			}).on('keyup', function(e){
				var keylist = [13, 32],
					arrowList = [38, 40];

				if ($.inArray(e.keyCode, keylist) != -1) {
					e.preventDefault();
					self.open();
					return;
				}else if($.inArray(e.keyCode, arrowList) != -1){
					e.preventDefault();
					return;
				}
				var selectEL = $(this).prev();
				self.search( e, $simHead);
				// selectEL.data('simSelect').search(e, $simHead);
				
			}).on('keydown', function(e){
				var keylist = [13, 32],
					arrowList = [38, 40];

				if ($.inArray(e.keyCode, keylist) != -1) {
					e.preventDefault();
					return;
				}else if($.inArray(e.keyCode, arrowList) != -1){
					e.preventDefault();
					var selectEL = $(this).prev();
					self.search( e, $simHead);
					//selectEL.data('simSelect').search(e, $simHead);
				}
			})

			$simSelect.attr('tabindex', 0);
			$el.attr('tabindex', 1);
			
			$simSelect.on('click', '.sim-head', function(e) {
				$('select').not($el).each(function(){
					$(this).next().removeClass('open').removeClass('focus');
					$(this).next().find('.sim-list').hide();
					$(this).parent().css('z-index', '100');
				});
				if(self.isDisabled) return;
				self.open();

			}).on('click', '.sim-list li', function(e) {
				var $this = $(this),
					val = $this.attr('str');

				$el.data('currentoptdisabled', true);
				if($this.hasClass('disabled')) {
					$el.data('currentoptdisabled', false);
					return;
				}

				$this.siblings().removeClass('hover').end().addClass('hover');
				if($this.find('.so-title').length){
					$simHead.find('.current').attr('str', val).text($this.find('.so-title').text());
				}else{
					$simHead.find('.current').attr('str', val).text($this.text());
				}

				$simSelect.parent().css('z-index', '100');
				
				$simList.slideUp(100);

				if($simHead.find('.current').attr('str') != $el.val()){
					$el.val($simHead.find('.current').attr('str')).trigger('change');
				}
				
				if(self.conf && self.conf.afterClose && typeof self.conf.afterClose === 'function') self.conf.afterClose();
				$simSelect.removeClass('open');

				if(self.conf && self.conf.afterSelected && typeof self.conf.afterSelected === 'function') self.conf.afterSelected($el);	
				return false;

			}).on('mouseenter', '.sim-list li', function() {
				$(this).siblings().removeClass('hover')
					.end().addClass('hover');

			}).on('mouseleave', '.sim-list li', function() {
				$(this).removeClass('hover');

			}).on('mouseleave', '.sim-list ul', function() {
				var val = $simHead.find('.current').attr('str');
				$(this).find('li[str="'+ val +'"]').addClass('hover');

			});

			$el.on('change', function(e) {
				if(ISTOUCH) {
					var $this = $(this),
						$head = $this.nextAll('.sim-select').find('.sim-head .current');
		
					$head.text($this.find('option').filter(':selected').text());
				}
			});
		}

		checkAttr ($el, i, selectList){
			var selected = $el.find("option").eq(i).is(':selected') ? 'hover' : '',
				disabled = $el.find('option').eq(i).is(':disabled') ? 'disabled' : '',
				unavailable = $el.find('option').eq(i).prop('unavailable') ? 'unavailable' : '',
				hide = $el.find('option').eq(i).data('hideoption') ? 'hide' : '',
				soContent = '';

			var attrsArr = [selected, disabled, unavailable, hide],
				attrs = attrsArr.join(' ');
			
			if (i == $el.find("option").length-1) selected += ' last';
			if ($el.data('intercontent')) {
				if($el.find("option").eq(i).data('content')){
					soContent = "<div class='so-body'>"+ $el.find("option").eq(i).data('content') +"</div>";
				}
				selectList += "<li class='"+ attrs +"' str='"+ $el.find("option").eq(i).attr('value') +"'><span class='so-title'>"+ $el.find("option").eq(i).html() +"</span>"+ soContent +"</li>";
			} else {
				selectList += "<li class='"+ attrs +"' str='"+ $el.find("option").eq(i).attr('value') +"'>"+ $el.find("option").eq(i).html() +"</li>";
			}
			return selectList;
		}

		render () {
			var $el = this.$el,
				selectList = '',
				selected = $el.val() ? $el.find("option[value = '"+ $el.val() +"']").text() : $el.find("option").eq(0).text(),
				selectStr = $el.val() ? $el.val() : $el.find("option").eq(0).val();
			
			
			for(var i = 0, len = $el.find('option').length; i<len; i++){
				var optionEL = $el.find('option').eq(i);
				selectList = this.checkAttr($el, i, selectList)
				this.dataList.push(optionEL.attr('value'));
				this.textList.push(optionEL.html());
			}

			$el.wrap("<span class='select-el'></span>");
			var	str =	"<div class='sim-select'>";
				str += 		"<div class='sim-head'>";
				str +=			"<span class='current' str='"+ selectStr +"'>"+ selected +"</span>";
				str += 			"<span class='sim-arrow'></span>";
				str +=		"</div>";
				str += 		"<div class='sim-list'>";
				str +=			"<ul>"+ selectList +"</ul>";
				str +=		"</div>";
				str +=	"</div>";
			$el.after(str);
			
			
			if(!$el.next().find('li.hover').length) {
				$el.next().find('li:first').addClass('hover');
			}
			
			if(!ISTOUCH) {
				$el.css('z-index', 8);
				$el.css('visibility', 'hidden');
			}else {
				if($el.data('intercontent')) {
					$el.css('z-index', 8);
					$el.css('visibility', 'hidden');
				}
			}
		}

		open() {
			var self = this,
				$el = self.$el,
				$select = self.$simSelect,
				$simSelect = $el.nextAll('.sim-select'),
				$simHead = $simSelect.find('.sim-head'),
				$simList = $simSelect.find('.sim-list'),
				$curLi = $select.find('ul li.hover');

			if(ISTOUCH && !$el.data('intercontent')) {
				if($simSelect.hasClass('open')){
					$simSelect.removeClass('open');
				}else {
					$simSelect.addClass('open');
				}
			}else {
				if($simSelect.hasClass('open')){
					$simSelect.parent().css('z-index', '100');
					$simList.slideUp(100, function(){
						$simSelect.removeClass('open');
						this.isOpen = false;
						if($simHead.find('.current').attr('str') !== self.$el.val()) {
							$el.val($simHead.find('.current').attr('str')).trigger('change');
						}
					});
				}else {
					$simSelect.parent().css('z-index', '101');
					$simList.slideDown(100, function(){
						$simSelect.addClass('open');
						if (!self.liHeight) {
							self.liHeight = $curLi.outerHeight()
						}
						self.isOpen = true;$select.find('ul').css({ 'overflow-y' : 'auto' }).scrollTop(self.liHeight * $curLi.index());
					});
				}
			}
		}

		returnIndex (evt, keyCode, key){
			var keyIndex = -1,
				len = key.length;
			var $select = this.$simSelect;

			switch(keyCode) {
				case 38 :
					evt.preventDefault();
					keyIndex = this.keyIndex - 1;
					if(keyIndex < 0) {
						keyIndex = this.textList.length-1;
					}
					for (var i = 0; i < this.textList.length-1; i++) {
						if ($select.find('li').eq(keyIndex).hasClass('disabled')) {
							keyIndex = keyIndex - 1;
							if(keyIndex < 0) {
								keyIndex = this.textList.length-1;
							}
						} else {
							break;
						}
					}
					break;

				case 40 :
					evt.preventDefault();
					keyIndex = this.keyIndex + 1;
					if(keyIndex == this.textList.length) {
						keyIndex = 0;
					}
					for (var i = 0; i < this.textList.length+1; i++) {
						if ($select.find('li').eq(keyIndex).hasClass('disabled')) {
							keyIndex = keyIndex + 1;
							if(keyIndex == this.textList.length) {
								keyIndex = 0;
							}
						} else {
							break;
						}
					}
					break;

				default :
					var indexs = 0,
						firstIndex = 0,
						matchIndex = 0;

					for(var i = 0; i < this.textList.length; i++) {
						if(this.textList[i].substring(0, len).toLowerCase() === key.toLowerCase()) {
							if(firstIndex == 0) firstIndex = i;
							indexs++;
						}else {
							this.$el.find('option').eq(i).data('selected', false);
						}
					}

					for(var i = 0; i < this.textList.length; i++) {
						if(this.textList[i].substring(0, len).toLowerCase() === key.toLowerCase()) {
							matchIndex ++
							if(!this.$el.find('option').eq(i).data('selected')) {
								keyIndex = i;
								this.$el.find('option').eq(i).data('selected', true);
								if(matchIndex == indexs) {
									this.$el.find('option').data('selected', false);
								}
								break;
							}
						}
					}
					break;
			}

			this.keyIndex = keyIndex;
		}
		
		search (evt, $simHead) {
			this.keyIndex = this.$simSelect.find('li.hover').index();
			var self = this,
				keyCode = evt.which,
				$select = this.$simSelect,
				currentKey = String.fromCharCode(keyCode);

			this.key += currentKey;

			clearTimeout(spellKey);
			var spellKey = setTimeout(function(){
				self.key = '';
			}, 500);

			this.returnIndex(evt, keyCode, this.key);
			
			if(this.keyIndex != -1) {
				var currentVal = this.dataList[this.keyIndex],
					currentText = this.textList[this.keyIndex],
					$curLi = $select.find('ul li.hover');

				$select.find('li').eq(this.keyIndex).addClass('hover').siblings().removeClass('hover');
				$select.find('.sim-head .current').attr('str', currentVal).html(currentText);

				if($simHead.find('.current').attr('str') != this.$el.val()) {
					this.$el.val($simHead.find('.current').attr('str')).trigger('change');
				}
				$select.find('ul').css({ 'overflow-y' : 'auto' }).scrollTop($curLi.outerHeight() * this.keyIndex);
			}
		}
		
		close (){
			$('.sim-select.open').parent().css('z-index', '100');
			$('.sim-select.open').find('.sim-list').slideUp(100);
			$('.sim-select.open').removeClass('open');
			if(this.conf && this.conf.afterClose && typeof this.conf.afterClose === 'function') this.conf.afterClose();
		}

		update (opts) {
			if(opts && opts.afterSelected) this.conf = opts;
			var $el = this.$el,
				selectList = '',
				$simSelect = $el.nextAll('.sim-select'),
				$simHead = $simSelect.find('.sim-head'),
				$simList = $simSelect.find('.sim-list'),
				selected = $el.val() ? $el.find("option[value = '"+ $el.val() +"']").text() : $el.find("option").eq(0).text(),
				selectStr = $el.val() ? $el.val() : $el.find("option").eq(0).attr('value');

			for(var i = 0, len = $el.find('option').length; i<len; i++){
				selectList = this.checkAttr($el, i, selectList)
			}

			$simHead.find('.current').attr('str', selectStr).text(selected);
			$simList.html('<ul>'+ selectList + '</ul>');
		}
		
		updateOpts(opts) {
			$.extend(this.conf, typeof opts === 'object' && opts);
		}
	}	

	$.fn.simSelect = function(opts) {
		this.each(function() {
			var $this = $(this),
				data = $this.data('simSelect'),
				conf = $.extend({}, SimSelect.DEFAULTS, typeof opts === 'object' && opts);
			
			if (!data) {
				$this.data('simSelect', (data = new SimSelect(this, conf)));
			}
			if (typeof opts == 'string') data[opts]();
		});
		return this;
	}
	
	$(document).click(function(e){
		var $target = $(e.target);
		if ($target.closest('.sim-select').length < 1) {
			$('select').simSelect('close');
		}
	});
	return SimSelect;
})();

export default SimSelect;