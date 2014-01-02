var Model_GA = require('../lib/ga');

exports.get = function(req, res) {
	res.charset = 'utf-8';

	var account_id = req.query.account_id;
	var ga_id = req.query.ga_id;

	if (account_id === undefined || !ga_id) {
		return res.end('Need params "ga_id", "account_id" @ GET.');
	}

	res.set('Content-Type', 'application/json');

	Model_GA.get_year(account_id, ga_id, function(results) {
		res.end(JSON.stringify(results));
	});
};

exports.list = function(req, res) {
	res.charset = 'utf-8';
	res.set('Content-Type', 'application/json');

	if (!req.query.account_id) {
		return res.end('Need param "account_id".');
	}

	Model_GA.list(req.query.account_id, function(results) {
		res.end(JSON.stringify(results));
	});
};

exports.accounts = function(req, res) {
	res.charset = 'utf-8';
	res.set('Content-Type', 'application/json');

	res.end(JSON.stringify(Model_GA.accounts()));
};