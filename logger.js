const winston = require('winston');
const Sentry = require('winston-raven-sentry');

let logger = winston.createLogger({
    transports: [
        new winston.transports.Console({ //Вывод в консоль
            level: 'debug', // Уровень debug или выше
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({
                    format: 'HH:mm:ss'
                }),
                winston.format.printf(info => `${info.level}: ${info.message}`)
            )
        }),
        new Sentry({ //Вывод в Sentry
            level: 'warn', //Уровень warn или выше
            dsn: "https://8690a0ab2153475caaf82d1ce431af0b@sentry.io/1312332",
            debug: true
        })
    ],
});

logger.stream = {
    write: (message, encoding)=>{
        logger.info(message.replace(/[\n]/g, ""));
    }
};

module.exports = logger;