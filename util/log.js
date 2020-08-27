/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars

const winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const myFormat = printf(({ level, message, timestamp }) => {
	return `[${timestamp} UTC +0] [${level.toUpperCase()}]: ${message}`;
});

const logger = createLogger({
	format: combine(
		timestamp(),
		myFormat,

	),

	transports: [
		new transports.Console(),
		new transports.File({ filename: './log/all.log' }),
	],

});


class AlLog {

	run(client) {


		// debug
		/* Emitted for general debugging information.
		PARAMETER    TYPE         DESCRIPTION
		info         string       The debug information    */
		client.on('debug', function(info) {
			logger.info(`${info}`);
		});

		// disconnect
		/* Emitted when the client's WebSocket disconnects and will no longer attempt to reconnect.
		PARAMETER    TYPE              DESCRIPTION
		Event        CloseEvent        The WebSocket close event    */
		client.on('disconnect', function(event) {
			logger.error('The WebSocket has closed and will no longer attempt to reconnect');
		});

		// error
		/* Emitted whenever the client's WebSocket encounters a connection error.
		PARAMETER    TYPE     DESCRIPTION
		error        Error    The encountered error    */
		client.on('error', function(error) {
			logger.error(`client's WebSocket encountered a connection error: ${error}`);
		});

		// reconnecting
		/* Emitted whenever the client tries to reconnect to the WebSocket.    */
		client.on('reconnecting', function() {
			logger.info('client tries to reconnect to the WebSocket');
		});

		// resume
		/* Emitted whenever a WebSocket resumes.
		PARAMETER    TYPE          DESCRIPTION
		replayed     number        The number of events that were replayed    */
		client.on('resume', function(replayed) {
			logger.info(`whenever a WebSocket resumes, ${replayed} replays`);
		});
	}

	log(level, data) {
		logger.log(level, data);
	}
}
module.exports = AlLog;