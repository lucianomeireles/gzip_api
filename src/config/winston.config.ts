const { createLogger, format, transports } = require('winston')

// define log format
const logFormat = format.combine(
  // format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  // format.errors({ stack: true }),
  // format.splat(),
  // format.json(),

  format.errors({ stack: false }),
)

const debugFormat = format.combine(format.errors({ stack: true }), format.splat(), format.json())

// define log transports
const transportsList = [
  new transports.Console({
    level: 'info',
    format: format.combine(format.colorize(), logFormat),
  }),
  new transports.Console({
    level: 'debug',
    format: format.combine(format.colorize(), debugFormat),
  }),
  new transports.Console({
    level: 'error',
    format: format.combine(format.colorize(), debugFormat),
  }),
]

// create logger instance
const logger = createLogger({
  level: 'info',
  format: logFormat,
  transports: transportsList,
})

export default logger
