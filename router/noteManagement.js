const {prefix, getUserAsync, error, generateErrorMessage} = require('../functions');
const {Response} = require('../objects');
const {Note} = require('../database');

module.exports = (router) =>
{
    router.get(prefix('/getNoteList'), async (ctx, next) =>
    {
        try
        {
            const user = await getUserAsync(ctx.session);
            if (Object.is(user, null))
            {
                ctx.body = new Response(false, '请重新登录');
            }
            else
            {
                const notes = await user.getNotes({order: [['updatedAt', 'DESC']]});
                const data = [];
                for (const note of notes)
                {
                    const {id, name, updatedAt: lastModifyTime} = note;
                    data.push({
                        id, name, lastModifyTime
                    });
                }
                ctx.body = new Response(true, '文章列表获取成功', data);
            }
        }
        catch (e)
        {
            ctx.body = new Response(false, '文章列表获取失败');
            error(generateErrorMessage('getting note list', e));
        }
        finally
        {
            await next();
        }
    });

    router.post(prefix('/submitNote'), async (ctx, next) =>
    {
        try
        {
            const user = await getUserAsync(ctx.session);
            if (Object.is(user, null))
            {
                ctx.body = new Response(false, '请重新登录');
            }
            else
            {
                const {name, content, id} = ctx.request.body;
                if (id === -1) // 如果是新的笔记
                {
                    const note = await Note.create({name, content});
                    await note.setUser(user);
                    ctx.body = new Response(true, '笔记创建成功');
                }
                else // 如果是修改原有笔记
                {
                    const note = await Note.findOne({where: {id}});
                    if (Object.is(note, null))
                    {
                        ctx.body = new Response(false, '被修改的笔记不存在');
                    }
                    else
                    {
                        note.content = content;
                        await note.save();
                        ctx.body = new Response(true, '笔记修改成功');
                    }
                }
            }
        }
        catch (e)
        {
            ctx.body = new Response(false, '笔记修改失败');
            error(generateErrorMessage('user submitting note', e));
        }
        finally
        {
            await next();
        }
    });

    router.post(prefix('/deleteNote'), async (ctx, next) =>
    {
        try
        {
            const user = await getUserAsync(ctx.session);
            if (Object.is(user, null))
            {
                ctx.body = new Response(false, '请重新登录');
            }
            else
            {
                const {id} = ctx.request.body;
                const note = await Note.findOne({where: {id}});
                if (Object.is(note, null))
                {
                    ctx.body = new Response(false, '笔记不存在');
                }
                else if ((await note.getUser()).id !== user.id)
                {
                    ctx.body = new Response(false, '不能删除别人的笔记');
                }
                else
                {
                    await note.destroy();
                    ctx.body = new Response(true, '删除成功');
                }
            }
        }
        catch (e)
        {
            ctx.body = new Response(false, '删除失败');
            error(generateErrorMessage('user deleting note', e));
        }
        finally
        {
            await next();
        }
    });

    router.get(prefix('/getNote'), async (ctx, next) =>
    {
        try
        {
            const user = await getUserAsync(ctx.session);
            if (Object.is(user, null))
            {
                ctx.body = new Response(false, '请重新登录');
            }
            else
            {
                const {id} = ctx.query;
                const note = await Note.findByPk(parseInt(id));
                if (Object.is(note, null))
                {
                    ctx.body = new Response(false, '笔记不存在');
                }
                else if ((await note.getUser()).id !== user.id)
                {
                    ctx.body = new Response(false, '不能获取别人的笔记');
                }
                else
                {
                    const {name, content, updatedAt: lastModifyTime} = note;
                    ctx.body = new Response(true, '获取成功', {name, content, lastModifyTime});
                }
            }
        }
        catch (e)
        {
            ctx.body = new Response(false, '获取笔记失败');
            error(generateErrorMessage('user getting note', e));
        }
        finally
        {
            await next();
        }
    });
};