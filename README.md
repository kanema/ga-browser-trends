# ga-browser-trends

> A graphic analyzer in [express](http://expressjs.com) of tendency of web browsers in [Google Analytics](http://www.google.com/analytics/). Using [Google API analytics](https://npmjs.org/package/googleanalytics) to understand your users.

## Getting Started
This requires Node `~0.10`

To use just run the `npm install` or open the `ga-browser-trends.bat` (in Windows)

```shell
npm install
node app.js
```

### Config
Open the file in `config.js`

```config.js
module.exports = [
	{
		'user': 'analytics@gmail.com',
		'password': 'mypassword',
	},
	{
		'user': 'analytics2@gmail.com',
		'password': 'mypassword2',
	}
];
```

### Overview
An instance of the express will be started on port 3000.
Enter this url to view the results.
These are demonstrated in percent the last year of the desired account.
As an example below:

```example
http://localhost:3000
```

![Example](https://raw.github.com/kanema/ga-browser-trends/master/docs/example.png "Example")