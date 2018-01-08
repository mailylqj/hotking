import $ from 'jquery';
import './demo.scss';
import SimSelect from '../index';

const mainContent = $('.J_mainContent');

const html = 
	'<div class="row">'+
		'<div class="col-md-10">select 下拉框控件</div>'+
		'<ul class="col-md-12 form-group">'+
			'<li>1、支持原生select，option标签及属性</li>'+
			'<li>2、支持键盘事件，获取焦点(tab)，展开选项(enter)，选择选项(up,down)，确认选项(enter)</li>'+
			'<li>3、支持选项为多行文字样式</li>'+
			'<li>4、一次性初始化多个select标签“$("select").simSelect();”</li>'+
			'<li>5、支持移动端设备</li>'+
		'</ul>'+
		'<div class="col-md-12"><div class="row">'+
			'<div class="col-md-2">单行选项：</div>'+
			'<div class="col-md-2">多行选项：</div>'+
		'</div></div>'+
		'<div class="col-md-2">'+
			'<label class="select"><select class="J_simSelect">'+
				'<option value="11">11</option>'+
				'<option selected value="12">12</option>'+
				'<option value="13">13</option>'+
				'<option value="15" disabled>15</option>'+
			'</select></label>'+
		'</div>'+
		'<div class="col-md-2">'+
			'<label class="select"><select class="J_simSelect1" data-intercontent="true">'+
				'<option value="noPrice" data-content="<p>$0.00</p><p>Removes prices from page</p>">No Pricing</option>'+
				'<option value="PromotionPrice" data-content="<p>$2.00</p><p>Get promotion prices from page</p>">Promotion Price</option>'+
				'<option value="JDPricing" data-content="<p>$4.00</p><p>Get JD prices from page</p>">JD Pricing</option>'+
				'<option value="disabled" disabled data-content="<p>$4.00</p><p>Get JD prices from page</p>">Disabled Item</option>'+
			'</select></label>'+
		'</div>'+
		'<div class="col-md-2">'+
			'<select class="J_simSelect">'+
				'<option value="11">11</option>'+
				'<option selected value="12">12</option>'+
				'<option value="13">13</option>'+
				'<option value="15" disabled>15</option>'+
			'</select>'+
		'</div>'+
		'<div class="col-md-2">'+
			'<select class="error J_simSelect">'+
				'<option value="11">11</option>'+
				'<option selected value="12">12</option>'+
				'<option value="13">13</option>'+
				'<option value="15" disabled>15</option>'+
			'</select>'+
		'</div>'+		
	'</div>'

mainContent.append(html)

$('select').simSelect();

//new SimSelect('.J_simSelect');

//new SimSelect('.J_simSelect1');