import winston, { createLogger, format, transports } from 'winston'
const { combine, timestamp, printf } = format

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`
})

const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), logFormat),
  defaultMeta: { service: 'my-express-app' },
  transports: [new transports.Console()],
})

if (process.env.NODE_ENV == 'production') {
  logger.add(new winston.transports.File({ filename: 'error.log', level: 'error' }))
  logger.add(new winston.transports.File({ filename: 'combined.log' }))
}

export default logger
