$(function(){
    //跑马灯
	/*var aDiv=$('#m_r_house div');
    var timer = null;
    var i = -1;
    function show(){
        i++;
        aDiv.eq(i).addClass('none').siblings().removeClass('none');
        if(i==7){
            i=-1;
        }
    }
    timer=setInterval(show,500);
   	for(var v=0;v<aDiv.length;v++){
   		var index=v;
   		aDiv.eq(v).mouseenter(function(){
   			clearInterval(timer);
   			for(var j=0;j<aDiv.length;j++){
   				aDiv.eq(j).removeClass('none');
   			}
   		});
   		aDiv.eq(v).mouseleave(function(){
   			var i=v;
   		    timer=setInterval(show,500);
   		})	
   	}*/
	
//动画   
	$.func = {
	    oneM:function() {
			$('#m_cont1').stop().animate({'left':'100%'},{'easing':'swing','duration':500});
	    },
	    twoM:function(){
			$('#m_cont2').stop().animate({'left':'100%'},{'easing':'swing','duration':500});
		},
		thrM:function() {
			$('#m_cont3').stop().animate({'left':'100%'},{'easing':'swing','duration':500});
	    },
	    fourM:function(){
			$('#m_cont4').stop().animate({'left':'100%'},{'easing':'swing','duration':500});
		},
		fiveM:function() {
			$('#m_cont5').stop().animate({'left':'100%'},{'easing':'swing','duration':500});
	    },
	    sixM:function(){
			$('#m_cont6').stop().animate({'left':'100%'},{'easing':'swing','duration':500});
		},
		sevM:function() {
			$('#m_cont7').stop().animate({'left':'100%'},{'easing':'swing','duration':500});
	    }
	}
	
	$('#main').mouseleave(function(){
		$('#m_left').delay(500).show(0);
		$('#m_right').stop().animate({'left':'45%'},{'easing':'swing','duration':1500});
		$.func.oneM();$.func.twoM();$.func.thrM();$.func.fourM();$.func.fiveM();$.func.sixM();$.func.sevM();
	})
	
	//1
	$('#one').click(function(){
		$('#m_left').delay(500).hide(0);
		$('#m_right').stop().animate({'left':'-5%'},{'easing':'swing','duration':1500});
		$('#m_cont1').stop().animate({'left':'50%'},{'easing':'swing','duration':1500});
		$.func.twoM();$.func.thrM();$.func.fourM();$.func.fiveM();$.func.sixM();$.func.sevM();
	});
	
	//2
	$('#two').click(function(){
		$('#m_left').delay(500).hide(0);
		$('#m_right').stop().animate({'left':'-5%'},{'easing':'swing','duration':1500});
		$('#m_cont2').stop().animate({'left':'50%'},{'easing':'swing','duration':1500});
		$.func.oneM();$.func.thrM();$.func.fourM();$.func.fiveM();$.func.sixM();$.func.sevM();
	});
	
	//3
	$('#thr').click(function(){
		$('#m_left').delay(500).hide(0);
		$('#m_right').stop().animate({'left':'-5%'},{'easing':'swing','duration':1500});
		$('#m_cont3').stop().animate({'left':'50%'},{'easing':'swing','duration':1500});
		$.func.oneM();$.func.twoM();$.func.fourM();$.func.fiveM();$.func.sixM();$.func.sevM();
	});
	
	//4
	$('#four').click(function(){
		$('#m_left').delay(500).hide(0);
		$('#m_right').animate({'left':'-5%'},{'easing':'swing','duration':1500});
		$('#m_cont4').animate({'left':'50%'},{'easing':'swing','duration':1500});
		$.func.oneM();$.func.twoM();$.func.thrM();$.func.fiveM();$.func.sixM();$.func.sevM();
	});

	//5
	$('#five').click(function(){
		$('#m_left').delay(500).hide(0);
		$('#m_right').stop().animate({'left':'-5%'},{'easing':'swing','duration':1500});
		$('#m_cont5').stop().animate({'left':'50%'},{'easing':'swing','duration':1500});
		$.func.oneM();$.func.twoM();$.func.thrM();$.func.fourM();$.func.sixM();$.func.sevM();
	});

	//6
	$('#six').click(function(){
		$('#m_left').delay(500).hide(0);
		$('#m_right').stop().animate({'left':'-5%'},{'easing':'swing','duration':1500});
		$('#m_cont6').stop().animate({'left':'50%'},{'easing':'swing','duration':1500});
		$.func.oneM();$.func.twoM();$.func.thrM();$.func.fourM();$.func.fiveM();$.func.sevM();
	});

	//7
	$('#sev').click(function(){
		$('#m_left').delay(500).hide(0);
		$('#m_right').stop().animate({'left':'-5%'},{'easing':'swing','duration':1500});
		$('#m_cont7').stop().animate({'left':'50%'},{'easing':'swing','duration':1500});
		$.func.oneM();$.func.twoM();$.func.thrM();$.func.fourM();$.func.fiveM();$.func.sixM();
	});
});
 