import morgan from 'morgan';
import dayjs from 'dayjs';
import chalk from 'chalk';
import { logger } from '../config/winston-config.js';

const MethodColors = {
    GET: chalk.green,
    POST: chalk.blue,
    PUT: chalk.yellow,
    DELETE: chalk.red,
    PATCH: chalk.magenta,
    OPTIONS: chalk.cyan,
    default: chalk.white,
};

const StatusColors = [
    { condition: (status) => status >= 500, color: chalk.red },
    { condition: (status) => status >= 400, color: chalk.yellow },
    { condition: (status) => status >= 300, color: chalk.cyan },
    { condition: (status) => status >= 200, color: chalk.green },
    { condition: (status) => status >= 100, color: chalk.white },
    { condition: (status) => status >= 0, color: chalk.gray },
];

const ResponseTimeColors = [
    { condition: (responseTime) => responseTime >= 1000, color: chalk.red },
    { condition: (responseTime) => responseTime >= 500, color: chalk.yellow },
    { condition: (responseTime) => responseTime >= 250, color: chalk.cyan },
    { condition: (responseTime) => responseTime >= 0, color: chalk.green },
];

const ResponseSizeColors = [
    { condition: (responseSize) => responseSize >= 100000, color: chalk.red },
    { condition: (responseSize) => responseSize >= 50000, color: chalk.yellow },
    { condition: (responseSize) => responseSize >= 25000, color: chalk.cyan },
    { condition: (responseSize) => responseSize >= 0, color: chalk.green },
];

const ResponseTimeFormatter = (responseTime) => {
    if (responseTime >= 60000) {
        const minutes = Math.floor(responseTime / 60000);
        const seconds = Math.floor((responseTime % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    if (responseTime >= 1000) {
        return `${(responseTime / 1000).toFixed(3)}s`;
    }

    return `${responseTime}ms`;
};

const ResponseSizeFormatter = (responseSize) => {
    if (responseSize >= 1000000) {
        return `${(responseSize / 1000000).toFixed(3)}mb`;
    }

    if (responseSize >= 1000) {
        return `${(responseSize / 1000).toFixed(3)}kb`;
    }

    return `${responseSize}b`;
};

const defaultColor = chalk.grey;

// Winston stream adapter for Morgan
const winstonStream = {
    write: (message) => {
        logger.info(message.trim());
    },
};

const logRequest = async (app) => {
    const onRequest = morgan(
        (tokens, req, res) => {
            const methodColor =
                MethodColors[req.method] || MethodColors.default;

            return [
                chalk.yellow('🡶'),
                defaultColor(`[${dayjs().format('hh:mm:ss a')}]`),
                methodColor(tokens.method(req, res)),
                defaultColor(tokens.url(req, res)),
            ].join(' ');
        },
        { immediate: true, stream: winstonStream }
    );

    const onResponse = morgan(
        (tokens, req, res) => {
            const methodColor = MethodColors[req.method] || MethodColors.default;
            const statusColor =
                StatusColors.find((c) => c.condition(res.statusCode))?.color ||
                defaultColor;
            const responseTimeColor =
                ResponseTimeColors.find((c) =>
                    c.condition(Number(tokens['response-time'](req, res)))
                )?.color || defaultColor;
            const responseSizeColor =
                ResponseSizeColors.find((c) =>
                    c.condition(Number(tokens.res(req, res, 'content-length')))
                )?.color || defaultColor;

            return [
                chalk.blue('🡴'),
                defaultColor(`[${dayjs().format('hh:mm:ss a')}]`),
                methodColor(tokens.method(req, res)),
                defaultColor(tokens.url(req, res)),
                statusColor(tokens.status(req, res)),
                responseSizeColor(
                    ResponseSizeFormatter(
                        Number(tokens.res(req, res, 'content-length') ?? 0)
                    )
                ),
                defaultColor('-'),
                responseTimeColor(
                    ResponseTimeFormatter(Number(tokens['response-time'](req, res)))
                ),
            ].join(' ');
        },
        { stream: winstonStream }
    );

    app.use(onRequest);
    app.use(onResponse);
};

export default logRequest;
