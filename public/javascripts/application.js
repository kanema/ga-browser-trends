(function($) {

	var account_id;
	var accounts = function() {
		$.ajax({
			url: './ga/accounts',
			success: function(res) {
				render_options(res, '#accounts', list_accounts);
			},
			error: function() {
				console.info('Accounts Error');
			}
		});
	};

	var list_accounts = function(id) {
		$('#account-list').animate({
			opacity: 1
		}, 500).html('<option>Loading...</option>');
		$.ajax({
			url: './ga/list?account_id=' + id,
			success: function(res) {
				account_id = id;
				render_options(res, '#account-list', render_graphic);
			},
			error: function() {
				console.info('List Accounts Error');
			}
		});
	};

	var get_browsers = function(ga_id, cb) {
		$.ajax({
			url: './ga/get?account_id=' + account_id + '&ga_id=' + ga_id,
			success: function(res) {
				cb(res);
			},
			error: function() {
				cb();
			}
		});
	};

	var render_options = function(data, select, onchange) {
		if (data) {
			var options = '<option selected>Select...</options>';
			for (var i in data) {
				options += '<option value="' + data[i].id + '">' + data[i].name + '</option>';
			}
			$(select)
				.html(options)
				.on('change', function() {
					if (onchange) {
						var $this = $(this);
						onchange($this.val());
					}
				});
		}
	};

	var render_graphic = function(ga_id) {

		$('#container').after('<div id="container" />').remove();

		var chart = new Highcharts.Chart({
			chart: {
				renderTo: 'container',
				defaultSeriesType: 'spline',
				animation: false
			},
			loading: {
				style: {
					backgroundColor: 'silver'
				},
				labelStyle: {
					color: 'black'
				}
			},

			title: {
				text: 'Browsers'
			},
			xAxis: {
				type: 'datetime',
				maxZoom: 20 * 1000
			},
			yAxis: {
				min: 0,
				minPadding: 0.2,
				maxPadding: 0.2,
				title: {
					text: 'Unique Visitors',
					margin: 20
				},
				labels: {
					formatter: function() {
						return parseInt(this.value) + '%';
					}
				}
			}
		});

		var series = [];
		var now = new Date();
		var month = 12;

		// Default
		var valid_browsers = ['Chrome', 'Firefox', 'Opera', 'Safari', 'Android Browser'];

		// IE
		valid_browsers = valid_browsers.concat(['Internet Explorer', 'IE8 lte', 'IE9', 'IE10 gte']);

		// Geral
		valid_browsers = valid_browsers.concat(['Other']);

		// Create Series
		for (var i in valid_browsers) {
			if ('Internet Explorer' === valid_browsers[i]) {
				continue;
			}
			series.push(valid_browsers[i]);
			chart.addSeries({
				name: valid_browsers[i],
				data: []
			});
		}

		chart.showLoading();
		get_browsers(ga_id, function(res) {
			chart.hideLoading();
			for (var i in res) {
				var total = {};
				for (var browser in res[i]) {
					var versoes = res[i][browser];
					for (var v in versoes) {
						var is_valid = $.inArray(browser, valid_browsers);
						var label = browser;
						if (is_valid === -1) {
							label = 'Other';
						} else if (browser === 'Internet Explorer') {
							var suffix = v;
							if (suffix < 9) {
								suffix = '8 lte';
							} else if (v > 9) {
								suffix = '10 gte';
							}
							label = 'IE' + suffix;
						}

						if (total[label] === undefined) {
							total[label] = 0;
						}

						total[label] += versoes[v];
					}
				}
				for (var bw in total) {
					var index = $.inArray(bw, series);
					if (chart.series && chart.series[index]) {
						chart.series[index].addPoint([i * 1, total[bw]]);
					}
				}
			}
		});
	};

	$(window).ready(function() {
		accounts(function(data) {
			render_options(data, '#accounts', render_graphic);
		});
	});

})(jQuery);