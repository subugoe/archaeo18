/**
 * Extended SimileAjax.DateTime Object
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @version 0.9
 */

SimileAjax.DateTime.MILLISECOND = 0;
SimileAjax.DateTime.SECOND = 1;
SimileAjax.DateTime.MINUTE = 2;
SimileAjax.DateTime.HOUR = 3;
SimileAjax.DateTime.DAY = 4;
SimileAjax.DateTime.WEEK = 5;
SimileAjax.DateTime.MONTH = 6;
SimileAjax.DateTime.QUARTER = 7;
SimileAjax.DateTime.SEMESTER = 8;
SimileAjax.DateTime.YEAR = 9;
SimileAjax.DateTime.LUSTRUM = 10;
SimileAjax.DateTime.DECADE = 11;
SimileAjax.DateTime.HALFCENTURY = 12;
SimileAjax.DateTime.CENTURY = 13;
SimileAjax.DateTime.HALFMILLENNIUM = 14;
SimileAjax.DateTime.MILLENNIUM = 15;

SimileAjax.DateTime.Strings = {
	"en" : [
		"milliseconds",
		"seconds",
		"minutes",
		"hours",
		"days",
		"weeks",
		"months",
		"quarters",
		"semester",
		"years",
		"5 years",
		"decades",
		"50 years",
		"centuries",
		"500 years",
		"millenniums"
	],
	"de" : [
		"Millisekunden",
		"Sekunden",
		"Minuten",
		"Stunden",
		"Tage",
		"Wochen",
		"Monate",
		"Quartale",
		"Semester",
		"Jahre",
		"5 Jahre",
		"Dekaden",
		"50 Jahre",
		"Jahrhunderte",
		"500 Jahre",
		"Jahrtausende"
	]
};

SimileAjax.DateTime.gregorianUnitLengths = [];
(function(){
    var d = SimileAjax.DateTime;
    var a = d.gregorianUnitLengths;
    
    a[d.MILLISECOND] = 1;
    a[d.SECOND] = 1000;
    a[d.MINUTE] = a[d.SECOND] * 60;
    a[d.HOUR] = a[d.MINUTE] * 60;
    a[d.DAY] = a[d.HOUR] * 24;
    a[d.WEEK] = a[d.DAY] * 7;
    a[d.MONTH] = a[d.DAY] * 31;
    a[d.QUARTER] = a[d.DAY] * 91;
    a[d.SEMESTER] = a[d.DAY] * 182;
    a[d.YEAR] = a[d.DAY] * 365;
    a[d.LUSTRUM] = a[d.YEAR] * 5;
    a[d.DECADE] = a[d.YEAR] * 10;
    a[d.HALFCENTURY] = a[d.YEAR] * 50;
    a[d.CENTURY] = a[d.YEAR] * 100;
    a[d.HALFMILLENNIUM] = a[d.YEAR] * 500;
    a[d.MILLENNIUM] = a[d.YEAR] * 1000;
})();

SimileAjax.DateTime.roundDownToInterval = function(date, intervalUnit, timeZone, multiple, firstDayOfWeek){
	timeZone = (typeof timeZone == 'undefined') ? 0 : timeZone;
    var timeShift = timeZone * SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.HOUR];
    
    var date2 = new Date(date.getTime() + timeShift);
    var clearInDay = function(d){
        d.setUTCMilliseconds(0);
        d.setUTCSeconds(0);
        d.setUTCMinutes(0);
        d.setUTCHours(0);
    };
    var clearInWeek = function(d){
        clearInDay(d);
        var day = d.getDay();
        var millies = d.getTime();
        millies -= day * 1000 * 60 * 60 * 24;
        d.setTime(millies);
    };
    var clearInYear = function(d){
        clearInDay(d);
        d.setUTCDate(1);
        d.setUTCMonth(0);
    };
    
    switch (intervalUnit) {
        case SimileAjax.DateTime.MILLISECOND:
            var x = date2.getUTCMilliseconds();
            date2.setUTCMilliseconds(x - (x % multiple));
            break;
        case SimileAjax.DateTime.SECOND:
            date2.setUTCMilliseconds(0);
            var x = date2.getUTCSeconds();
            date2.setUTCSeconds(x - (x % multiple));
            break;
        case SimileAjax.DateTime.MINUTE:
            date2.setUTCMilliseconds(0);
            date2.setUTCSeconds(0);
            var x = date2.getUTCMinutes();
            date2.setTime(date2.getTime() - (x % multiple) * SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.MINUTE]);
            break;
        case SimileAjax.DateTime.HOUR:
            date2.setUTCMilliseconds(0);
            date2.setUTCSeconds(0);
            date2.setUTCMinutes(0);
            var x = date2.getUTCHours();
            date2.setUTCHours(x - (x % multiple));
            break;
        case SimileAjax.DateTime.DAY:
            clearInDay(date2);
            break;
        case SimileAjax.DateTime.WEEK:
            clearInWeek(date2);
            break;
        case SimileAjax.DateTime.MONTH:
            clearInDay(date2);
            date2.setUTCDate(1);
            var x = date2.getUTCMonth();
            date2.setUTCMonth(x - (x % multiple));
            break;
        case SimileAjax.DateTime.QUARTER:
            clearInDay(date2);
            date2.setUTCDate(1);
            var x = date2.getUTCMonth();
            date2.setUTCMonth(x - (x % 3));
            break;
        case SimileAjax.DateTime.SEMESTER:
            clearInDay(date2);
            date2.setUTCDate(1);
            var x = date2.getUTCMonth();
            date2.setUTCMonth(x - (x % 6));
            break;
        case SimileAjax.DateTime.YEAR:
            clearInYear(date2);
            var x = date2.getUTCFullYear();
            date2.setUTCFullYear(x - (x % multiple));
            break;
        case SimileAjax.DateTime.LUSTRUM:
            clearInYear(date2);
            date2.setUTCFullYear(Math.floor(date2.getUTCFullYear() / 5) * 5);
            break;
        case SimileAjax.DateTime.DECADE:
            clearInYear(date2);
            date2.setUTCFullYear(Math.floor(date2.getUTCFullYear() / 10) * 10);
            break;
        case SimileAjax.DateTime.HALFCENTURY:
            clearInYear(date2);
            date2.setUTCFullYear(Math.floor(date2.getUTCFullYear() / 50) * 50);
            break;
        case SimileAjax.DateTime.CENTURY:
            clearInYear(date2);
            date2.setUTCFullYear(Math.floor(date2.getUTCFullYear() / 100) * 100);
            break;
        case SimileAjax.DateTime.HALFMILLENNIUM:
            clearInYear(date2);
            date2.setUTCFullYear(Math.floor(date2.getUTCFullYear() / 500) * 500);
            break;
        case SimileAjax.DateTime.MILLENNIUM:
            clearInYear(date2);
            date2.setUTCFullYear(Math.floor(date2.getUTCFullYear() / 1000) * 1000);
            break;
    }
    
    date.setTime(date2.getTime() - timeShift);
};

SimileAjax.DateTime.incrementByInterval = function(date, intervalUnit, timeZone){
    timeZone = (typeof timeZone == 'undefined') ? 0 : timeZone;
    
    var timeShift = timeZone * SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.HOUR];
    
    var date2 = new Date(date.getTime() + timeShift);
    
    switch (intervalUnit) {
        case SimileAjax.DateTime.MILLISECOND:
            date2.setTime(date2.getTime() + 1)
            break;
        case SimileAjax.DateTime.SECOND:
            date2.setTime(date2.getTime() + 1000);
            break;
        case SimileAjax.DateTime.MINUTE:
            date2.setTime(date2.getTime() + SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.MINUTE]);
            break;
        case SimileAjax.DateTime.HOUR:
            date2.setTime(date2.getTime() + SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.HOUR]);
            break;
        case SimileAjax.DateTime.DAY:
            date2.setUTCDate(date2.getUTCDate() + 1);
            break;
        case SimileAjax.DateTime.WEEK:
            date2.setUTCDate(date2.getUTCDate() + 7);
            break;
        case SimileAjax.DateTime.MONTH:
            date2.setUTCMonth(date2.getUTCMonth() + 1);
            break;
        case SimileAjax.DateTime.QUARTER:
            date2.setUTCMonth(date2.getUTCMonth() + 3);
            break;
        case SimileAjax.DateTime.SEMESTER:
            date2.setUTCMonth(date2.getUTCMonth() + 6);
            break;
        case SimileAjax.DateTime.YEAR:
            date2.setUTCFullYear(date2.getUTCFullYear() + 1);
            break;
        case SimileAjax.DateTime.LUSTRUM:
            date2.setUTCFullYear(date2.getUTCFullYear() + 5);
            break;
        case SimileAjax.DateTime.DECADE:
            date2.setUTCFullYear(date2.getUTCFullYear() + 10);
            break;
        case SimileAjax.DateTime.HALFCENTURY:
            date2.setUTCFullYear(date2.getUTCFullYear() + 50);
            break;
        case SimileAjax.DateTime.CENTURY:
            date2.setUTCFullYear(date2.getUTCFullYear() + 100);
            break;
        case SimileAjax.DateTime.HALFMILLENNIUM:
            date2.setUTCFullYear(date2.getUTCFullYear() + 500);
            break;
        case SimileAjax.DateTime.MILLENNIUM:
            date2.setUTCFullYear(date2.getUTCFullYear() + 1000);
            break;
    }
    date.setTime(date2.getTime() - timeShift);
};

SimileAjax.DateTime.getTimeLabel = function( unit, t ){
		var time = SimileAjax.DateTime;
		var second = t.getUTCSeconds();
		var minute = t.getUTCMinutes();
		var hour = t.getUTCHours();
		var day = t.getUTCDate();
		var month = t.getUTCMonth()+1;
		var year = t.getUTCFullYear();
		switch(unit){
			case time.SECOND:
           		return hour+":"+((minute<10)?"0":"")+minute+":"+((second<10)?"0":"")+second;
			case time.MINUTE:
				return hour+":"+((minute<10)?"0":"")+minute;
			case time.HOUR:
				return hour + ":00";
			case time.DAY:
			case time.WEEK:
			case time.MONTH:
			case time.QUARTER:
			case time.SEMESTER:
           		return year+"-"+((month<10)?"0":"")+month+"-"+((day<10)?"0":"")+day;
			case time.YEAR:
			case time.LUSTRUM:
			case time.DECADE:
			case time.HALFCENTURY:
			case time.CENTURY:
			case time.HALFMILLENNIUM:
			case time.MILLENNIUM:
				return year;
		}
	};

SimileAjax.DateTime.getTimeString = function( unit, t ){
		var time = SimileAjax.DateTime;
		switch(unit){
			case time.MILLISECOND:
			case time.SECOND:
			case time.MINUTE:
			case time.HOUR:
				var m = t.getUTCMonth()+1;
				var d = t.getUTCDate();
				var h = t.getUTCHours();
				var min = t.getUTCMinutes();
				var s = t.getUTCSeconds();
           		return t.getUTCFullYear()+"-"+((m<10)?"0":"")+m+"-"+((d<10)?"0":"")+d+" "+((h<10)?"0":"")+h+":"+((min<10)?"0":"")+min+":"+((s<10)?"0":"")+s;
			case time.DAY:
			case time.WEEK:
			case time.MONTH:
			case time.QUARTER:
			case time.SEMESTER:
				var m = t.getUTCMonth()+1;
				var d = t.getUTCDate();
           		return t.getUTCFullYear()+"-"+((m<10)?"0":"")+m+"-"+((d<10)?"0":"")+d;
			case time.YEAR:
			case time.LUSTRUM:
			case time.DECADE:
			case time.HALFCENTURY:
			case time.CENTURY:
			case time.HALFMILLENNIUM:
			case time.MILLENNIUM:
				return t.getUTCFullYear();
		}
	};
