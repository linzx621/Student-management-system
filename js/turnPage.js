(function() {

    function turnPage(options, pageWrapper) {
        this.currentPage = options.currentPage;
        this.totalPage = options.totalPage;
        this.wrapper = pageWrapper;
        this.change = options.change || function() {};
    }
    turnPage.prototype.init = function() {
            this.createDom();
            this.bindEvent();
        }
        // 创建翻页的结构：首先有个当前页，还有当前页的前两页和后两页，然后两个省略号的，
        //还有下一页和上一页的翻页按钮，当前页如果是第一页的话，则上一页的按钮消失，如果是最后一页的话，
        //下一页的按钮消失，如果当前到最后一页不超过两页的话，就不需要省略号了，距离第一页
        //不超过两页的话，同样也不需要省略号
    turnPage.prototype.createDom = function() {
        var pageWrapper = $('<ul class="page-wrapper"></ul>');
        if (this.currentPage > 1) { //判断当前页是否大于1，是的话就需要上一页按钮
            pageWrapper.append('<li class = "prev-page">上一页</li>');
        }
        if (this.currentPage == 1) {
            pageWrapper.append('<li class = "page-num active">1</li>');
        } else {
            pageWrapper.append('<li class = "page-num">1</li>');
        }
        //判断当前页距离第一页是不是超过两页，是的话添加省略号
        if (this.currentPage - 2 - 1 > 1) {
            pageWrapper.append('<span>...</span>');
        }
        //创建当前页的前两页和后两页
        for (var i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
            if (i > 1 && i < this.totalPage) { //i的值必须在第一页和总页数之间
                if (i == this.currentPage) {
                    pageWrapper.append('<li class = "page-num active">' + i + '</li>');
                } else {
                    pageWrapper.append('<li class = "page-num">' + i + '</li>');
                }
            }
        }
        //判断当前页距离最后一页是不是超过两页，是的话添加省略号
        if (this.currentPage + 2 + 1 < this.totalPage) {
            pageWrapper.append('<span>...</span>');
        }
        //当前页也有可能是最后一页
        if (this.currentPage == this.totalPage) {
            pageWrapper.append('<li class = "page-num active">' + this.totalPage + '</li>')
        } else {
            pageWrapper.append('<li class = "page-num">' + this.totalPage + '</li>')
        }
        //如果当前页小于总页数，则需要添加下一页按钮
        if (this.currentPage < this.totalPage) {
            pageWrapper.append('<li class = "next-page">下一页</li>');
        }
        $(this.wrapper).html('').html(pageWrapper);
    }

    turnPage.prototype.bindEvent = function() {
        var self = this;
        $(this.wrapper).find('.prev-page').click(function() {
            if (self.currentPage > 1) {
                self.currentPage--;
                self.change(self.currentPage);
            }
        }).end().find('.next-page').click(function() {
            if (self.currentPage < self.totalPage) {
                self.currentPage++;
                self.change(self.currentPage);
            }
        }).end().find('.page-num').click(function() {
            self.currentPage = parseInt($(this).text());
            $(this).addClass('active').siblings().removeClass('active');
            self.change(self.currentPage);
        })
    }



    $.fn.extend({
        turnPage: function(options) {
            var page = new turnPage(options, this)
            page.init();
        }
    })
}())