class Response
{
    constructor(isSuccess, msg = '', data = {})
    {
        this.isSuccess = isSuccess;
        this.msg = msg;
        this.data = data;
    }
}


module.exports = {Response};