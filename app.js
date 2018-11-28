const Koa = require('koa');
const app = new Koa();
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const {key, CONFIG: KOA_SESSION_CONFIG} = require('./staticConfigs/koa-session');
const router = require('./router/router');
const {log, error, generateErrorMessage, mkdirAsync, isExistAsync} = require('./functions');
const {PORT, PATH} = require('./config');
const {db} = require('./database');

isExistAsync(PATH.NOTE_PATH)
    .then(isExist =>
    {
        if (!isExist)
        {
            log('Note folder does not exist');
            mkdirAsync(PATH.NOTE_PATH, {recursive: true})
                .then(() =>
                {
                    log('Note folder creation succeeded');
                })
                .catch(e =>
                {
                    error(generateErrorMessage('creating note folder', e));
                    process.exit(0);
                });
        }
        else
        {
            log('Note folder has existed');
        }

    })
    .catch(e =>
    {
        error(generateErrorMessage('detecting note folder existence', e));
        process.exit(0);
    });

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