const crypto = require('crypto');
const fs = require('fs');
const {User} = require('./database');

async function mkdirAsync(path, options = {})
{
    return new Promise((resolve, reject) =>
    {
        fs.mkdir(path, options, e =>
        {
            if (e)
            {
                reject(e);
            }
            else
            {
                resolve();
            }
        });
    });
}

async function isExistAsync(path)
{
    return new Promise(((resolve) =>
    {
        fs.access(path, (err) =>
        {
            resolve(Object.is(err, null));
        });
    }));
}

function removeSlashes(str)
{
    let index = -1;
    for (let i = 0; i < str.length; i++)
    {
        if (str.charAt(i) !== '/')
        {
            index = i;
            break;
        }
    }
    if (index === -1)
    {
        return str;
    }
    else
    {
        return str.substring(index);
    }
}

function prefix(url)
{
    url = removeSlashes(url);
    return `/server/${url}`;
}

function log(msg)
{
    const date = new Date();
    console.log(`${date.getFullYear()}-${prefixZero(date.getMonth() + 1)}-${prefixZero(date.getDate())} ${prefixZero(date.getHours())}:${prefixZero(date.getMinutes())} ${msg}`);
}

function error(msg)
{
    const date = new Date();
    console.error(`${date.getFullYear()}-${prefixZero(date.getMonth() + 1)}-${prefixZero(date.getDate())} ${prefixZero(date.getHours())}:${prefixZero(date.getMinutes())} ${msg}`);
}

function prefixZero(num)
{
    if (num >= 0 && num < 10)
    {
        return '0' + num.toString();
    }
    else
    {
        return num.toString();
    }

}

function getHash(text, hashMethod)
{
    const hash = crypto.createHash(hashMethod);
    hash.update(text);
    return hash.digest('hex');
}

function getSHA256(text)
{
    return getHash(text, 'sha256');
}

async function getUserAsync(session)
{
    const {username} = session;
    if (!username)
    {
        return null;
    }
    else
    {
        return await User.findOne({where: {username}});
    }
}

function generateErrorMessage(when, error)
{
    return `Error occurred when ${when}. Error information:\n${error}`;
}

module.exports = {
    removeSlashes,
    prefix,
    log,
    error,
    getSHA256,
    generateErrorMessage,
    mkdirAsync,
    isExistAsync,
    getUserAsync
};