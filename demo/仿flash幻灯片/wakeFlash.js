/**
 * Created by 25106 on 2016-11-19.
 */
$(function(){
    var iNow = 0;
    var iLength = $('.small_pic').find('li')[0].length;
    var aLiBig = $('.big_pic').find('li')[0];
    var aLismall = $('.small_pic').find('li')[0];
    var iNowZindex = 1;

    for(var i =0; i< aLismall.length;i++){
        aLismall[i].index = i;
        aLiBig[i].index = i;
    }

    $('.small_pic').find('li').bind('mouseenter',function(){
        $(this).css('opacity',1);
    }).bind('mouseout',function(){
        if(iNow == this.index) return;
        $(this).css('opacity',0.6);
    });

    $('.small_pic').find('li').bind('click',function(){
        var index = $(this).attr('index');
        $(aLiBig[index]).css('z-index',++iNowZindex);
        var iHeight = aLiBig[index].offsetHeight;
        $(aLiBig[index]).css('height',0);
        aLiBig[index].timer = setInterval(function(){
            moveAnimate(aLiBig[index],iHeight)
        },50)
        moveAnimate(aLiBig[index],iHeight);
    });

    function moveAnimate(oLiBig,iHeight) {


        var cur = parseInt($(oLiBig).css('height'));
        var step = Math.ceil(iHeight / 20);

        var iEndHeight = Math.min(iHeight,cur + step);
        $(oLiBig).css('height',iEndHeight+'px');

        if(cur+step > iEndHeight){
            clearInterval(oLiBig.timer);
        }
    }

})