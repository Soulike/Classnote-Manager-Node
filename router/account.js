const {prefix, getUserAsync, error, generateErrorMessage} = require('../functions');
const {Response} = require('../objects');
const {User} = require('../database');
const REGEX = require('../Regex');

module.exports = (router) =>
{
    router.get(prefix('/validSession'), async (ctx, next) =>
    {
        try
        {
            const user = await getUserAsync(ctx.session);
            if (Object.is(user, null))
            {
                ctx.body = new Response(false);
            }
            else
            {
                ctx.body = new Response(true);
            }
        }
        catch (e)
        {
            ctx.body = new Response(false);
            error(generateErrorMessage('validating user session', e));
        }
        finally
        {
            await next();
        }
    });

    router.post(prefix('/signUp'), async (ctx, next) =>
    {
        try
        {
            const {username, password} = ctx.request.body;
            if (!REGEX.USERNAME.test(username) || !REGEX.PASSWORD.test(password))
            {
                ctx.body = new Response(false, '注册信息有误');
            }
            else
            {
                await User.create({username, password});
                ctx.body = new Response(true, '注册成功');
            }
        }
        catch (e)
        {
            ctx.body = new Response(false, '注册失败');
            error(generateErrorMessage('user signing up', e));
        }
        finally
        {
            await next();
        }
    });

    router.post(prefix('/login'), async (ctx, next) =>
    {
        try
        {
            const {username, password} = ctx.request.body;
            if (!REGEX.USERNAME.test(username) || !REGEX.PASSWORD.test(password))
            {
                ctx.body = new Response(false, '登录信息有误');
            }
            else
            {
                const user = await User.findOne({where: {username}});
                if (Object.is(user, null))
                {
                    ctx.body = new Response(false, '用户不存在');
                }
                else if (user.password !== password)
                {
                    ctx.body = new Response(false, '密码错误');
                }
                else
                {
                    ctx.session.username = username;
                    ctx.body = new Response(true, '登录成功');
                }
            }
        }
        catch (e)
        {
            ctx.body = new Response(false, '登录失败');
            error(generateErrorMessage('user logging in', e));
        }
        finally
        {
            await next();
        }
    });
};