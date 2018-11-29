const Router = require('koa-router');
const router = new Router();

// import router files here
require('./account')(router);
require('./noteManagement')(router);

module.exports = router;