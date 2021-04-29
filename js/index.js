var page = 1;
var size = 15;
var total = 1;
var key = false;
init();
getTableData();

function init() {
    location.hash = 'student-list';
    bindEvent();
}

function bindEvent() {
    $('header .btn').click(function() {
        $('header ul').slideToggle();
    })
    $('header ul li').click(function() {
        var id = '#' + $(this).data('id');
        $(id).fadeIn().siblings().fadeOut();
        location.hash = id;
        $('header ul').slideUp();
    })
    $('.left-nav li').click(function() {
        $(this).addClass('active').siblings().removeClass('active');
        var id = '#' + $(this).data('id');
        $(id).fadeIn().siblings().fadeOut();
        location.hash = id;
    })
    $(window).on('hashchange', function() {
        var Class = location.hash.slice(1);
        $('.left-nav .' + Class).click();
    })

    $('.menu').on('click', 'dd', function(e) {
            $(this).addClass('active').siblings().removeClass('active');
            var id = $(this).data('id');
            $('#' + id).fadeIn().siblings().fadeOut();
        })
        // 删除按钮绑定的事件
        //这是jq中事件委托中的事件冒泡的一种写法，第二个参数指定是谁冒泡的
    $('#student-list  tbody').on('click', '.remove', function() {
        //由于做成翻页，所以每个index并不等于真实地index，还要看当前页是第几页
        var index = $(this).parents('tr').index() + (page - 1) * size;
        var isDel = confirm('是否删除学号为' + allStudent.data[index].sNo + '的同学？');
        if (isDel) {
            $.ajax({
                url: '/delBySno',
                dataType: 'json',
                data: {
                    sNo: allStudent.data[index].sNo
                },
                success: function(res) {
                    if (res.status == 'success') {
                        //allStudent.data.splice(index, 1); //截取掉当前要删除的学生对应位置的数组
                        getTableData(); //然后重新重新渲染页面
                    }
                }
            })
        }
    })

    // 通过学生学号或者姓名查找学生
    $('.search .searchBtn').click(function() {
        var sNo = $('.search .searchText').val();
        var searchStu = [];
        var isSno = isNaN(+sNo); //如果是学号字符串，转换成number不会是NaN,如果是姓名自字符串转换成number，会变成NaN
        if (sNo) {
            if (isSno) {
                allStudent.data.forEach(function(item) {
                    if (item.name == sNo) {
                        searchStu.push(item);
                    }
                });
            } else {
                allStudent.data.forEach(function(item) {
                    if (item.sNo == sNo) {
                        searchStu.push(item);
                    }
                });
            }
            if (searchStu.length > 0) {
                key = true;
                renderSearchData(searchStu);
                $('#page').css('display', 'none');
            } else {
                $('.search .searchText').val('');
                alert('查不到该学生');
            }
        } else {
            alert('请输入学号或姓名！');
        }
    })


    $('.search .backBtn').click(function() {
        if (key) { //通过这个key来判断，当前返回按钮是否有效果
            getTableData();
            $('.search .searchText').val('');
            $('#page').fadeIn();
        }
    })


    // 学生列表中 编辑按钮绑定的事件
    $('#student-list  tbody').on('click', '.edit', function() {
        $('.popup').slideDown();
        var index = $(this).parents('tr').index() + (page - 1) * size;
        var editFormData = $('#edit-formData')[0];
        renderEditTable(editFormData, allStudent.data[index]);
        $('#edit-submitBtn').click(function(e) {
            e.preventDefault(); //阻止默认事件，即提交的时候不要要信息渲染到地址栏
            var isRight = testData(editFormData);
            if (isRight.status == 'success') {
                $.ajax({
                    url: '/updateStudent',
                    dataType: 'json',
                    data: isRight.data,
                    success: function(res) {
                        if (res.status == 'success') {
                            //更新信息提交成功后，此页面就要消失重新跳转到学生列表的页面
                            $('.popup').click();
                            //allStudent.data[index] = isRight.data;
                            getTableData(); //把数据库的信息改了之后重新渲染页面
                        }
                    }
                })
            } else {
                confirm(isRight.msg);
            }
        })
    })

    // 编辑学生信息界面消失
    $('.popup').click(function(e) {
        if (e.target == this) {
            $(this).slideUp();
        }
    })

    // 新增学生页面 添加学生按钮绑定的事件
    $('#student-add #submitBtn').click(function(e) {
        e.preventDefault();
        var addFormData = $('#formData')[0]; //获取表单
        var isRight = testData(addFormData); //检验表单中的数据是否规范
        // var len = allStudent.data.length;
        if (isRight.status == 'success') {
            $.ajax({
                url: '/addStudent',
                dataType: 'json',
                data: isRight.data,
                success: function(res) {
                    if (res.status == 'success') {
                        getTableData();
                        //添加完得把form表单中的数据清除了 否则下次还是这些数据
                        clearFormData(addFormData);
                        //添加完就得跳转到学生列表的页面
                        console.log($('.left-nav li[data-id="student-list"]'));
                        $('.left-nav li[data-id="student-list"]').click();
                    }
                }
            })
        } else {
            confirm(isRight.msg);
        }
    })
}

function getTableData() {
    $.ajax({
        url: '/findAll',
        type: 'get',
        dataType: 'json',
        success: function(res) {
            if (res.status == 'success') {
                total = Math.ceil(allStudent.data.length / size);
                renderTable(res.allStudent.data);
            }
        }
    })
}

function renderSearchData(data) {
    // 如果data长度为1，说明是通过搜索学号传过来的数据，否则，就说明是通过翻页传过来的数据
    var pageData = data.length == 1 ? data : data.slice((page - 1) * size, page * size);
    var str = pageData.reduce(function(prev, item) {
        return prev + `<tr>
        <td>${item.sNo}</td>
        <td>${item.name}</td>
        <td>${item.sex == 0 ? '男' : '女'}</td>
        <td>${item.email}</td>
        <td>${new Date().getFullYear() - item.birth}</td>
        <td>${item.phone}</td>
        <td>${item.address}</td>
        <td>
            <button class="btn edit">编辑</button>
            <button class="btn remove">删除</button>
        </td>
    </tr>`
    }, '');
    $('#student-list  tbody').html('').html(str);
}

// 渲染所有学生
function renderTable(data) {
    var pageData = data.slice((page - 1) * size, page * size);
    var str = pageData.reduce(function(prev, item) {
        return prev + `<tr>
        <td>${item.sNo}</td>
        <td>${item.name}</td>
        <td>${item.sex == 0 ? '男' : '女'}</td>
        <td>${item.email}</td>
        <td>${new Date().getFullYear() - item.birth}</td>
        <td>${item.phone}</td>
        <td>${item.address}</td>
        <td>
            <button class="btn edit">编辑</button>
            <button class="btn remove">删除</button>
        </td>
    </tr>`
    }, '');
    $('#student-list  tbody').html('').html(str);
    $('#page').turnPage({
        currentPage: page,
        totalPage: total,
        change: function(currentPage) {
            page = currentPage;
            getTableData();
        }
    })
}

// 渲染编辑表单中的数据
function renderEditTable(dom, data) {
    for (var prop in data) {
        if (dom[prop]) {
            dom[prop].value = data[prop];
        }
    }
}

// 校验数据
function testData(editFormdata) {
    var result = {
        status: 'success',
        msg: '成功',
        data: {}
    };
    var name = editFormdata.name.value;
    var sex = editFormdata.sex.value;
    var email = editFormdata.email.value;
    var sNo = editFormdata.sNo.value;
    var birth = editFormdata.birth.value;
    var phone = editFormdata.phone.value;
    var address = editFormdata.address.value;
    //各内容都不能为空
    if (!name || !sex || !email || !sNo || !birth || !phone || !address) {
        result.status = 'fail';
        result.msg = '请将信息写全';
    }
    //性别只能为男或女，其他则不符合
    if (sex != '0' && sex != '1') {
        result.status = 'fail';
        result.msg = '请填写正确的性别';
    }
    //邮箱格式要符合要求
    var emailReg = /^[\w\.]+@[\w-]+\.(com|cn)$/;
    if (!emailReg.test(email)) {
        result.status = 'fail';
        result.msg = '邮箱格式错误';
    }
    //学号格式为4-16位数字，
    var sNoReg = /^\d{4,16}$/;
    if (!sNoReg.test(sNo)) {
        result.status = 'fail';
        result.msg = '学号格式错误';
    }
    //年龄要大于10小于80
    if (birth > 2011 || birth < 1991) {
        result.status = 'fail';
        result.msg = '出生年应该在1991-2011之间';
    }
    //手机号码格式：第一位数字为1，第二位为3-9，后边再接则9位数字
    var phoneReg = /^[1][3-9]\d{9}$/;
    if (!phoneReg.test(phone)) {
        result.status = 'fail';
        result.msg = '手机号码格式错误';
    }
    result.data.name = name;
    result.data.sex = sex;
    result.data.email = email;
    result.data.sNo = sNo;
    result.data.birth = birth;
    result.data.phone = phone;
    result.data.address = address;
    return result;
}
//清除form表单中数据
function clearFormData(form) {
    form.name.value = ''
    form.sex.value = ''
    form.phone.value = ''
    form.address.value = ''
    form.birth.value = ''
    form.sNo.value = ''
    form.email.value = ''
}