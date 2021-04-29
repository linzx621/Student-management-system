(function() {
    var pie = {
        init: function() {
            this.option = {
                title: {
                    text: '', //主标题
                    subtext: '纯属虚构', //副标题
                    left: 'center' //主标题位置
                },
                legend: {
                    data: [], // legend的数据格式为['北京','上海','广州']
                    orient: 'vertical',
                    left: 'left',
                },
                series: {
                    name: '',
                    type: 'pie', //饼状图
                    data: [], // series的数据格式为[{ value: 1, name: '北京' },...]
                    radius: '55%',
                    center: ['70%', '50%'],
                    // itemStyle: {
                    //     emphasis: {
                    //         shadowBlur: 10,
                    //         shadowColor: 'rgba(0,0,0,.5)'
                    //     }
                    // }
                }
            };
            this.getData();
        },
        getData: function() {
            var _this = this;
            $.ajax({
                url: '/findAll',
                type: 'get',
                dataType: 'json',
                success: function(res) {
                    if (res.status == 'success') {
                        if (res.allStudent.data.length > 0) {
                            _this.areaCharts(res.allStudent.data);
                            _this.sexCharts(res.allStudent.data);
                        }
                    }
                }
            })
        },
        areaCharts: function(data) {
            var myCharts = echarts.init($('.areaCharts')[0]);
            var seriesData = {};
            var legendData = [];
            var newSeries = [];
            data.forEach(function(item) {
                var address = item.address.split(' ')[0];
                if (!seriesData[address]) {
                    seriesData[address] = 1;
                    legendData.push(address);
                } else {
                    seriesData[address]++;
                }
            })
            for (var prop in seriesData) {
                newSeries.push({
                    'name': prop,
                    'value': seriesData[prop]
                })
            }
            this.option.legend.data = legendData;
            this.option.series.data = newSeries;
            this.option.title.text = '学生区域分布图';
            this.option.series.name = '区域分布图';
            myCharts.setOption(this.option);
        },
        sexCharts: function(data) {
            var myCharts = echarts.init($('.sexCharts')[0]);
            var legendData = ['男', '女'];
            var newSeries = [{
                'name': '男',
                'value': 0
            }, {
                'name': '女',
                'value': 0
            }];
            data.forEach(function(item) {
                if (item.sex == 1) {
                    newSeries[1].value++;
                } else {
                    newSeries[0].value++;
                }
            })
            this.option.legend.data = legendData;
            this.option.series.data = newSeries;
            this.option.title.text = '学生性别分布图';
            this.option.series.name = '性别分布图';
            this.option.series.center = ['50 %', '50 %'];
            myCharts.setOption(this.option);
        }
    }
    pie.init();
})()

// address: "浙江省 湖州市 南浔区"
// appkey: "demo13_1545210570249"
// birth: 2006
// ctime: 1547190636
// email: "v.cygc@qq.com"
// id: "310000199003161875"
// name: "万敏"
// phone: 16091558024
// sNo: 10000
// sex: 0
// utime: 1547190636