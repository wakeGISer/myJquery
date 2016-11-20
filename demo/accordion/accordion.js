/**
 * Created by 25106 on 2016-11-19.
 */
/* 鼠标移入时候li 宽度动画增大，*/
$(function () {
    var oSpan = $('span')[0];
    var oDiv = $('#show1')[0];
    var aLi = $('li')[0];
    var iMinWidth = 9999;
    var i;
    for (i = 0; i < oSpan.length; i++) {
        oSpan[i].index = i;
        $(oSpan[i]).bind('mousemove', function (ev) {
            goImg(this.index, oDiv, iMinWidth);
        })
        iMinWidth= Math.min(iMinWidth,aLi[i].offsetWidth); //取li的宽度  最小步长
    }

    function goImg(index, oDiv, iMinWidth) {
        if(oDiv.timer){
            clearInterval(oDiv.timer);
        }

        oDiv.timer = setInterval(function(){
            changeWidthInner(oDiv,index,iMinWidth);
        },30)
    }

    function changeWidthInner(oDiv,index,iMinWidth)
    {
        var aLi=oDiv.getElementsByTagName('li');
        var aSpan=oDiv.getElementsByTagName('span');
        var iWidth=oDiv.offsetWidth;
        var step=0;
        var bEnd=true;
        var i=0;

        for(i=0;i<aLi.length;i++)
        {
            if(i==index)
            {
                continue;
            }

            if(iMinWidth==aLi[i].offsetWidth) //当前是否有正在运动的li标签
            {
                iWidth-=iMinWidth;
                continue;
            }

            bEnd=false;

            var speed=Math.ceil((aLi[i].offsetWidth-iMinWidth)/10);

            step=aLi[i].offsetWidth-speed;

            if(step<=iMinWidth)
            {
                step=iMinWidth;
            }

            aLi[i].style.width=step+'px';

            iWidth-=step;
        }

        aLi[index].style.width=iWidth+'px';

        if(bEnd)
        {
            clearInterval(oDiv.timer);
            oDiv.timer=null;
        }
    }
});