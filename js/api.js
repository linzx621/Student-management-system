var allStudent = Mock.mock({
    "data|500": [{
        "id": '@id()',
        "name": "@cname(2,4)",
        "birth": '@integer(1991, 2011)',
        "sex|1": [0, 1],
        "sNo|+1": 10000,
        "email": "@email('qq.com')",
        "phone": "@integer(13000000000, 19999999999)",
        "address": "@county(true)",
        "appkey": "demo13_1545210570249",
        "ctime": 1547190636,
        "utime": 1547190636
    }]
})


// 查找所有学生接口
Mock.mock(RegExp('/findAll?(\w\W)*'), 'get', function(options) {
    return {
        'status': 'success',
        'msg': '查询成功',
        'allStudent': allStudent
    }
})

// 更新学生信息接口
Mock.mock(RegExp('/updateStudent?(\w\W)*'), 'get', function(options) {
    var str = options.url.slice(options.url.indexOf('?') + 1);
    var queryStr = decodeURIComponent(str);
    var queryObj = getMsgObj(queryStr);
    allStudent.data.forEach(function(ele, index) {
        if (ele.sNo == queryObj.sNo) {
            allStudent.data[index] = queryObj;
        }
    })
    return {
        "msg": "修改成功",
        "status": "success",
        'allStudent': allStudent
    }
})


// 删除学生接口
Mock.mock(RegExp('/delBySno?(\w\W)*'), 'get', function(options) {
    var str = options.url.slice(options.url.indexOf('?') + 1);
    var delObj = getMsgObj(str);
    allStudent.data = allStudent.data.filter(function(item) {
        return item.sNo != delObj.sNo;
    })
    return {
        "msg": "删除成功",
        "status": "success",
        'allStudent': allStudent
    }
})


// 添加学生接口
Mock.mock(RegExp('/addStudent?(\w\W)*'), 'get', function(options) {
    var str = options.url.slice(options.url.indexOf('?') + 1);
    var queryStr = decodeURIComponent(str);
    var queryObj = getMsgObj(queryStr);
    allStudent.data.push(queryObj);
    return {
        "msg": "添加成功",
        "status": "success",
        'allStudent': allStudent
    }
})


function getMsgObj(str) {
    var queryArr = str.split('&');
    var queryObj = {};
    for (var i = 0; i < queryArr.length; i++) {
        var key = queryArr[i].split('=')[0];
        var value = queryArr[i].split('=')[1];
        queryObj[key] = value;
    }
    return queryObj
}