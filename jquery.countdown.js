/* 	
	http://ogulcanorhan.com
  	CountDown for jQuery v1.4+
  	Licensed under the GPL (http://www.gnu.org/copyleft/gpl.html)
  	Developed by Ogulcan Orhan (mail@ogulcan.org) December 2011
 
	Please do not remove these copyright.
  
	This program is free software; you can redistribute it and/or modify
	it under the terms of the GNU General Public License, version 2, as
	published by the Free Software Foundation.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program; if not, write to the Free Software
	Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

(function ( $ ) {

	var _defaults = { 'from' : 'now', 'until' : '21/12/2012-00:00:00', 'lang': 'en', 'format': 'seconds' , 'id' : '#jq_count_up', 'class' : '', 'seperator': ',', 'zero': false, 'message': 'Finished!' };

	var _timeStructure = { 'year': '', 'month': '', 'day': '', 'hour': '', 'minute': '', 'seconds': '' };
	var _monthDayStructure = { 1: 31, 2:28, 3:31, 4:30, 5:31, 6:31, 7:30, 8:31, 9:30, 10:31, 11:30, 12:31 };	
	var _lang = { 
		'en' : { 'year': 'years', 'month': 'months', 'day': 'days', 'hour': 'hours', 'minute': 'minutes', 'seconds': 'seconds',  },
		'tr' : { 'year': 'yıl', 'month': 'ay', 'day': 'gün', 'hour': 'saat', 'minute': 'dakika', 'seconds': 'saniye' },
		'es' : { 'year': 'año' ,'month': 'mes', 'day': 'día' ,'hour': 'horas' ,'minute': 'minuto','seconds': 'segundo'	},
		'de' : { 'year': 'jahr' ,'month': 'monat' ,'day': 'tag' ,'hour': 'stunde' ,'minute': 'minute','seconds': 'sekunden' }
	};
		    
	var methods = {
		
		init: function (args) {
			if(args && ("now" == args.from)) {
				
				var _myOptions = $.extend( {}, _defaults, args);
					_myOptions.from = new Date();
				
				var _fromDate =  this.startDateWithFormat(_myOptions.from);
				var _untilDate = this.expiryDateWithFormat(_myOptions.until);
				var _timeDifference = this.timeDifference(_fromDate, _untilDate);
				_timeDifference = this.formatted(_timeDifference, _myOptions);
				
				_myOptions.inter = setInterval(function() { methods.update(_timeDifference, _myOptions, _untilDate.month); }, 999);
								
			} else { 
				$.error("error: 'from' parameter should be 'now'"); 
			}
		},
		
		timeDifference: function (start, end) {
			var timeDiff = $.extend([], _timeStructure);
			
			var eString = parseInt(String(end.year)+String(end.month)+String(end.day)+String(end.hour)+String(end.minute)+String(end.seconds), 10);
			var sString = parseInt(String(start.year)+String(start.month)+String(start.day)+String(start.hour)+String(start.minute)+String(start.seconds), 10);
			if (sString > eString) throw new Error ("Check dates");
			
			//year difference
			timeDiff.year = end.year - start.year;
			var eYearString = parseInt(String(end.month)+String(end.day)+String(end.hour)+String(end.minute), 10);
			var sYearString = parseInt(String(start.month)+String(start.day)+String(start.hour)+String(start.minute), 10);			
			if( eYearString < sYearString ) { timeDiff.year--; }
			
			//month difference
			var eMonthString = parseInt(String(end.day)+String(end.hour)+String(end.minute), 10);
			var sMonthString = parseInt(String(start.day)+String(start.hour)+String(start.minute), 10);				

			if(end.month < start.month) {
				timeDiff.month = 12 - Math.abs(end.month - start.month);
				if(eMonthString < sMonthString) timeDiff.month--;
			} else if((end.month == start.month)) {
				if(eMonthString < sMonthString) timeDiff.month = 11;
				else timeDiff.month = 0;
			} else if( end.month > start.month) {
				timeDiff.month = end.month - start.month;
				if(eMonthString < sMonthString) timeDiff.month--;
			}

			//day difference
			var eDayString = parseInt(String(end.hour)+String(end.minute)+String(end.seconds), 10);
			var sDayString = parseInt(String(start.hour)+String(start.minute)+String(start.seconds), 10);

			if(end.day < start.day) {
				timeDiff.day = _monthDayStructure[parseInt(start.month, 10)] - Math.abs(end.day - start.day);
				if(eDayString < sDayString ) timeDiff.day--;
			} else if (end.day == start.day) {
				if(eDayString < sDayString) timeDiff.day = _monthDayStructure[start.month] - 1;
				else timeDiff.day = 0;
			} else if (end.day > start.day) {
				timeDiff.day = end.day - start.day;
				if(eDayString < sDayString ) timeDiff.day--;
			}

			//hour difference
			var eHourString = parseInt(String(end.minute)+String(end.seconds) ,10);
			var sHourString = parseInt(String(start.minute)+String(start.seconds),10);
		
			if(end.hour < start.hour) {
				timeDiff.hour = 24 - Math.abs(end.hour - start.hour);
				if(eHourString < sDayString) timeDiff.hour--;
			} else if (end.hour == start.hour) {
				if(eHourString < sHourString) timeDiff.hour = 23;
				else timeDiff.hour = 0;
			} else if (end.hour > start.hour) {
				timeDiff.hour = end.hour - start.hour;
				if(eHourString < sDayString) timeDiff.hour--;
			}

			//minute difference
			if(end.minute < start.minute) {
				timeDiff.minute = 60 - Math.abs(end.minute - start.minute);
				if(end.seconds < start.seconds) timeDiff.minute--;
			} else if(end.minute == start.minute) {
				if(end.seconds < start.seconds) timeDiff.minute = 59;
				else timeDiff.minute = 0;
			} else if(end.minute > start.minute) {
				timeDiff.minute = end.minute - start.minute;
				if(end.seconds < start.seconds) timeDiff.minute--;
			}

			//seconds difference
			if(end.seconds < start.seconds) {
				timeDiff.seconds = 60 - Math.abs(end.seconds - start.seconds);
			} else if (end.seconds == start.seconds) {
				timeDiff.seconds = 0;
			} else if (end.seconds > start.seconds) {
				timeDiff.seconds = end.seconds - start.seconds;
			}

			return timeDiff;
		},
		
		startDateWithFormat: function (startDate) {
			var fromDate = $.extend([], _timeStructure);
			fromDate.year   = startDate.getFullYear();

			(startDate.getMonth()<9)    ? fromDate.month   = "0" + startDate.getMonth()+1 : fromDate.month   = startDate.getMonth()+1;
			(startDate.getDate()<10)    ? fromDate.day     = "0" + startDate.getDate()    : fromDate.day     = startDate.getDate();
			(startDate.getHours()<10)   ? fromDate.hour    = "0" + startDate.getHours()   : fromDate.hour    = startDate.getHours();
			(startDate.getMinutes()<10) ? fromDate.minute  = "0" + startDate.getMinutes() : fromDate.minute  = startDate.getMinutes();
			(startDate.getSeconds()<10) ? fromDate.seconds = "0" + startDate.getSeconds() : fromDate.seconds = startDate.getSeconds();	

			return fromDate;			
		},
		
		expiryDateWithFormat: function (expiryDate) {
			var splitted = expiryDate.split("-");
			var splittedDate = splitted[0].split("/");
			var splittedTime = splitted[1].split(":");
			
			var expiryDate = $.extend([], _timeStructure);
			expiryDate.year = splittedDate[2];
			expiryDate.month = splittedDate[1];
			expiryDate.day = splittedDate[0];
			expiryDate.hour = splittedTime[0];
			expiryDate.minute = splittedTime[1];
			(splittedTime[2]) ? expiryDate.seconds = splittedTime[2] : expiryDate.seconds = 0;
			
			return expiryDate;
		},
		
		update: function (time, options, month) {
			
			if((time.year == 0) && (time.month == 0) && (time.hour == 0) && (time.hour == 0) && (time.minute == 0) && (time.seconds == 0)) {
				clearInterval(options.inter);
				this.finish(options);
			}
			 
			if( time.seconds > 0 || options['format'] == 'seconds' ) time.seconds--;
			else {
				time.seconds = 59;
				if ( time.minute > 0 ) time.minute--;
				else {
					time.minute = 59;
					if ( time.hour > 0 ) time.hour--;
					else {
						time.hour = 23;
						if ( time.day > 0 || options['format'] == 'day' ) time.day--;
						else {
							time.day = _monthDayStructure[month+1];
							if( time.month > 0 ) time.month--;
							else {
								time.month = 11;
								time.year--;
							}
						} 
					} 
				}
			}
			
			this.print(time, options);
		},
		
		finish: function (options) {
			$(options['div_id']).html(options.message);
			throw new Error("It finished!");
		},
		
		print: function (time, options) {
			
			var year   = '<span id='+options["class_prefix"]+'_year">'+time.year+' '+_lang[options['lang']].year+options['seperator']+' </span>';
			var month  = '<span id='+options["class_prefix"]+'_month">'+time.month+' '+_lang[options['lang']].month+options['seperator']+' </span>';
			var day    = '<span id='+options["class_prefix"]+'_day">'+time.day+' '+_lang[options['lang']].day+options['seperator']+' </span>';
			var hour   = '<span id='+options["class_prefix"]+'_hour">'+time.hour+' '+_lang[options['lang']].hour+options['seperator']+' </span>';
			var day    = '<span id='+options["class_prefix"]+'_day">'+time.day+' '+_lang[options['lang']].day+options['seperator']+' </span>';
			var hour   = '<span id='+options["class_prefix"]+'_hour">'+time.hour+' '+_lang[options['lang']].hour+options['seperator']+' </span>';
			var minute = '<span id='+options["class_prefix"]+'_minute">'+time.minute+' '+_lang[options['lang']].minute+options['seperator']+' </span>';
			var seconds = '<span id='+options["class_prefix"]+'_seconds">'+time.seconds+' '+_lang[options['lang']].seconds+' </span>';
			
			if(options['write_zero']) {
				$(options['div_id']).html(year+month+day+hour+minute+seconds);
			} else {
				$(options['div_id']).html(null);
				var zero = false;
				if((time.year > 0) ||  zero) {
					$(options['div_id']).append(year);
					zero = true;
				} 
				if((time.month > 0) || zero) {
					$(options['div_id']).append(month);
				}
				if((time.day > 0) ||  zero) { 
					$(options['div_id']).append(day);
					zero = true;
				}
				if((time.hour > 0) ||  zero) {
					$(options['div_id']).append(hour);
					zero = true;
				}
				if((time.minute > 0) ||  zero) {
					$(options['div_id']).append(minute);
					zero = true;
				}
				if((time.seconds > 0) ||  zero)
					$(options['div_id']).append(seconds);
			}
		},
		
		formatted: function (timeDiff, options) {
			if(options['format'] != 'full') {
				timeDiff.day = (timeDiff.year * 365) + (timeDiff.month * 30) + timeDiff.day;
				timeDiff.year = 0; 
				timeDiff.month = 0;
				if(options['format'] == 'seconds') {
					timeDiff.seconds = (timeDiff.day*86400) + (timeDiff.hour*3600) + (timeDiff.minute*60) + timeDiff.seconds;
					timeDiff.day = 0;
					timeDiff.hour = 0;
					timeDiff.minute = 0;
				}
			}
			return timeDiff;			
		}
		
	};
	
	$.fn.countDown = function (method) {	
		_defaults['div_id'] = "#"+$(this).attr('id');
		_defaults['class_prefix'] = $(this).attr('id');
		var myMethods = Object.create(methods);
		myMethods.init(method);		
	}
})( jQuery );
