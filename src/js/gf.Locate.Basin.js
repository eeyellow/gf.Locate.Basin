;
(function ($, window, document, undefined) {
    //'use strict';
    var pluginName = 'gfLocateBasin'; //Plugin名稱
    var gfLocateBasin;

    $.ajax({
        url: 'node_modules/select2/dist/css/select2.min.css',
        dataType: 'text',
        cache: true
    }).then(function(data){
        var style = $('<style/>',{ 'text': data });
        $('head').append(style);
    });
    $.ajax({
        url: 'node_modules/gf.locate.basin/src/css/gf.Locate.Basin.css',
        dataType: 'text',
        cache: true
    }).then(function(data){
        var style = $('<style/>',{ 'text': data });
        $('head').append(style);
    });
    //Load dependencies first
    $.when(
        $.ajax({
            url: 'node_modules/select2/dist/js/select2.min.js',
            dataType: 'script',
            cache: true
        })
    )
    .done(function(){
        //建構式
        gfLocateBasin = function (element, options) {

            this.target = element; //html container
            //this.prefix = pluginName + "_" + this.target.attr('id'); //prefix，for identity
            this.opt = {};
            var initResult = this._init(options); //初始化
            if (initResult) {
                //初始化成功之後的動作
                this._style();
                this._event();
                this._subscribeEvents();

                this.target.trigger('onInitComplete');
            }
        };

        //預設參數
        gfLocateBasin.defaults = {
            url: 'http://203.74.124.83/d3_new/php/getBasinList.php',
            css: {
                'width': '100%',

                'background-color': '#e3f0db',
                'overflow-y': 'hidden',
                'overflow-x': 'hidden',
            },

            onClick: undefined,
            onInitComplete: undefined

        };

        //方法
        gfLocateBasin.prototype = {
            //私有方法
            _init: function (_options) {
                //合併自訂參數與預設參數
                try {
                    this.opt = $.extend(true, {}, gfLocateBasin.defaults, _options);
                    return true;
                } catch (ex) {
                    return false;
                }
            },
            _style: function () {
                var o = this;
                o.target.css(o.opt.css);

                var row1 = $('<div/>', { 'class': 'gfLocateBasin-Row' });
                var lbl1 = $('<label/>', { 'class': 'gfLocateBasin-Label', 'text': '主集水區' });
                var sel = $('<select/>', { 'class': 'gfLocateBasin-Select' });
                o._getOption({}, "basin", "basin", sel);
                row1.append(lbl1);
                row1.append(sel);


                var row4 = $('<div/>', { 'class': 'gfLocateBasin-Row' });
                var btn4 = $('<button/>', { 'class': 'gfLocateBasin-Button', 'text': '定位' });
                row4.append(btn4);

                o.target.append(row1);

                o.target.append(row4);

                sel.select2();
            },
            _event: function () {
                var o = this;
                o.target
                    .find('.gfLocateBasin-Button')
                    .click(function(e){

                    });
            },

            _getOption: function(_data, _valueField, _textField, _container){
                var o = this;
                $.ajax({
                    url: o.opt.url,
                    type: 'POST',
                    data: _data,
                    dataType: 'JSON',
                    success: function(res){
                        res.forEach(function(data){
                            var option = $('<option/>', { value: data[_valueField], text: data[_textField] });
                            _container.append(option);
                        });
                    }
                })
            },
            //註冊事件接口
            _subscribeEvents: function () {
                //先解除所有事件接口
                this.target.off('onClick');
                this.target.off('onInitComplete');
                //綁定點擊事件接口
                if (typeof (this.opt.onClick) === 'function') {
                    this.target.on('onClick', this.opt.onClick);
                }
                if (typeof (this.opt.onInitComplete) === 'function') {
                    this.target.on('onInitComplete', this.opt.onInitComplete);
                }
            }



        };
    });

    //實例化，揭露方法，回傳
    $.fn[pluginName] = function (options, args) {
        var gfInstance;
        this.each(function () {
            gfInstance = new gfLocateBasin($(this), options);
        });

        return this;
    };
})(jQuery, window, document);