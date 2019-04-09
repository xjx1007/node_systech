var express = require('express');
var url = require('url')
var https = require('https')
var request = require('request')
var mysql=require('mysql')
var app = express();
/* 配置MySQL数据库信息 */
var connection=mysql.createConnection({
    host     : 'localhost',
    port     : '3306',
    database : 'mysql_demo',
    multipleStatements: true,
    user     : 'root',
    password : 'abcd#1234',
})

/*小程序授权请求*/
app.get('/GetOpeid', function (req, res) {
    var pathname = url.parse(req.url, true)
    /* res.send(pathname); */
    var js_code = pathname.query.code;
    GetOpeid(js_code);
    console.log('这是异步,获取用户openid')
    response.end();
})

function GetOpeid(js_code) {
    request.get(`https://api.weixin.qq.com/sns/jscode2session?appid=wxbe9d7454a059c4ef&secret=ffb6c73a68cb92093f7187133f66e38d&js_code=${js_code}&grant_type=authorization_code`, function (error, response, body) {
        console.log(body)
    })
}
/*接受小程序获取设备的请求，返回json字符串 */
app.get('/GetFac', function (req, res) {
    var pathname = url.parse(req.url, true);
    var openid = pathname.query.openid;
    GetDevice(openid,res);
    console.log('这是同步，响应小程序请求，返回设备信息!opendi为'+openid)
    res.end();
})
/* 根据opneid获取用户对应的设备 */
function GetDevice(openid,res) {
    var sql='select * from devicefac';
    connection.query(sql,function(err,result){//异步查询
        if(err){
            console.log('查询失败'+err)
            return;
        }
        for (const key in result) {
            console.log('设备ID为'+result[key].DeviceID)
            console.log('设备名称为'+result[key].DeviceName)
        }       
        //console.log(result)
    })
    var device = {
        'facidArray': '',
        'facArray': ''
    }
    if (openid == '1') {
        device.facArray = 'A';
        device.facidArray = '1'
        console.log(JSON.stringify(device))//把一个对象转换json字符串
    } else {
        device.facArray = 'B';
        device.facidArray = '2';
        console.log(JSON.stringify(device))
    }
    //res.send(JSON.stringify(result))
}
/* 根据小程序的请求指令，设置开关 */
app.get('/OperationDevice',function(request,response){
    var pathname=url.parse(request.url,true);
    var Operationjsonstr=pathname.query.jsonbody;
    console.log('设置开关的设备信息，设备ID：'+JSON.parse(Operationjsonstr).devId+'请求指令信息'+JSON.parse(Operationjsonstr).param.cmd)//将json字符串转换成json对象
    response.end();
})
