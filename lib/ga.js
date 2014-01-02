var config = require('../config'),
	GA = require('googleanalytics');

var Model_GA = {
	_ga_cache: {},
	_list_cache: {},
	_result_cache: {},
	_init: function(account_id, fn) {

		if (Model_GA._ga_cache[account_id] === undefined) {

			if (config[account_id] === undefined) {
				throw "Invalid account_id";
			}

			Model_GA._ga_cache[account_id] = new GA.GA(config[account_id]);
			Model_GA._ga_cache[account_id].list = require('./ga/list');

			Model_GA._ga_cache[account_id].login(function(err, token) {
				if (err) {
					throw err;
				}
				Model_GA._token = token;
				fn(Model_GA._ga_cache[account_id], Model_GA._token);
			});
		} else {
			fn(Model_GA._ga_cache[account_id], Model_GA._token);
		}
	},
	_options: {
		'dimensions': 'ga:browser,ga:browserVersion',
		'metrics': 'ga:visitors'
	},
	_format_number: function(str, pad) {
		str = str + "";
		while(str.length < pad) {
			str = '0' + str;
		}
		return str;
	},
	_days_in_month: function(month, year) {
		return new Date(year, month, 0).getDate();
	},
	_sort_object: function(object) {
		var sorted = {},
		key, a = [];
		for (key in object) {
			if (object.hasOwnProperty(key)) {
				a.push(key);
			}
		}
		a.sort();
		for (key = 0; key < a.length; key++) {
			sorted[a[key]] = object[a[key]];
		}
		return sorted;
	},
	get_year: function(account_id, ga_id, cb) {
		var now = new Date();
		var month = 12;
		var data = {};
		
		var async = function() {
			if (month > 0) {
				var current = new Date();
				current.setMonth(now.getMonth() - month);
				month--;

				var _month = current.getMonth() + 1;
				var _year = current.getFullYear();

				Model_GA.get_month(account_id, ga_id, _month, _year, function(res, _date) {
					data[new Date(_date.start) * 1] = res;
					async();
				});
			} else {
				cb(data);
			}
		};
		async();
	},
	get_month: function(account_id, ga_id, month, year, cb) {
		var days = Model_GA._days_in_month(month, year);
		var year_month = Model_GA._format_number(year, 4) + "-" + Model_GA._format_number(month, 2) + "-";
		var start = year_month + '01';
		var end = year_month + days;
		Model_GA.get(account_id, ga_id, { start: start, end: end }, function(result, _date) {
			cb(result, _date);
		});
	},
	accounts: function() {
		var data = [];
		for (var i in config) {
			data.push({
				id: i,
				name: config[i].user
			});
		}
		return data;
	},
	list: function(id, cb) {
		Model_GA._init(id, function(ga) {
			if (Model_GA._list_cache[id] !== undefined) {
				cb(Model_GA._list_cache[id]);
			} else {
				ga.list(function(err, data) {
					if (err) {
						throw err;
					}
					var items = [];
					for (var i in data.items) {
						var item = data.items[i];
						items.push({
							name: item.name,
							id: item.id
						});
					}
					Model_GA._list_cache[id] = items;
					cb(Model_GA._list_cache[id]);
				});
			}
		});
	},
	get: function(account_id, ga_id, date, cb) {
		var options = Model_GA._options;
		options.ids = 'ga:' + ga_id;
		
		if (date.constructor === String) {
			options['start-date'] = options['end-date'] = date;
		} else {
			options['start-date'] = date['start'];
			options['end-date'] = date['end'];
		}
		
		var key = account_id + '.' + ga_id + '.' + options['start-date'] + '.' + options['start-end'];
		
		if (Model_GA._result_cache[key] !== undefined) {
			return cb(Model_GA._result_cache[key], date);
		}
		
		Model_GA._init(account_id, function(ga) {
			ga.get(options, function(err, entries) {
				if (err) {
					throw err;
				}
				
				var results = {};
				var total = 0;
				
				for (var i in entries) {
					for (var d in entries[i].dimensions) {
						var dm = entries[i].dimensions[d];
						var bw = dm['ga:browser'];
						var vs = parseInt((dm['ga:browserVersion'].split('.'))[0]);
						
						var value = parseInt(entries[i].metrics[d][options.metrics]);
						total += value;
						
						if (results[bw] === undefined) {
							results[bw] = {};
						}
						
						if (results[bw][vs] === undefined) {
							results[bw][vs] = 0;
						}
						
						results[bw][vs] += value;
					}
				}
				
				for (var browser in results) {
					for (var version in results[browser]) {
						if (results[browser][version] === 0) {
							continue;
						}
						var partial = results[browser][version];
						results[browser][version] = Math.round((1e2 / (total / partial)) * 1e2) / 1e2;
					}
				}
				
				Model_GA._result_cache[key] = results;
				cb(Model_GA._result_cache[key], date);
			});
		});
	}
};

module.exports = Model_GA;