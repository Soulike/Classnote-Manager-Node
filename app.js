const Koa = require('koa');
const app = new Koa();
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const {key, CONFIG: KOA_SESSION_CONFIG} = require('./staticConfigs/koa-session');
const router = require('./router/router');
const {log, error, generateErrorMessage} = require('./functions');
const {PORT} = require('./config');
const {db} = require('./database');

db.sync()
    .then(() =>
    {
        log('Database synchronization succeeded');
    })
    .catch(e =>
    {
        error(generateErrorMessage('synchronizing database', e));
        process.exit(0);
    });

// 对所有请求增加一个小时的缓存减少服务器压力
app.use(async (ctx, next) =>
{
    ctx.set('Cache-Control', 'max-age=3600');
    await next();
});

app.use(bodyParser());

app.keys = key;
app.use(session(KOA_SESSION_CONFIG, app));

app
    .use(router.routes())
    .use(router.allowedMethods());

log(`Server is running on port ${PORT}`);
app.listen(PORT);