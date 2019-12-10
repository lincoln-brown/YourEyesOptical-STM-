"use strict";
function Main(){



	var bt=document.getElementById("Sbutton");
	var pwd=document.getElementById('pwd');
	var Email=document.getElementById('Em')
	var Errormsg=document.querySelector(".errorm");
	var Emailexp=/[a-zA-Z0-9]+\@[a-zA-Z0-9]+\.[a-zA-Z0-9]+/;


bt.onclick=function(e){
	e.preventDefault();
	if (Emailexp.test(Email.value)&& pwd.value!=""){
$.ajax({
	type:'POST',
	url:'database.php',
	data:{Email:Em.value,Password:pwd.value,MSG:"validate"  },
	success: function(data){
		if (data==="success"){
			$(".realcenter").load("home.html",function(){
				var stock=document.getElementById('stock');
				stock.addEventListener('click',Stock);
				var adduser=document.getElementById('adduser');
				adduser.addEventListener('click',Adduser);
				var accountinfo=document.getElementById('accountinfo');
				accountinfo.addEventListener('click',Accountinfo);
				var ulist=document.getElementById('ulist');
				ulist.addEventListener('click',Ulist);
				var comment=document.getElementById('comment');
				comment.addEventListener('click',Comment);
				var sout=document.getElementById('sout');
				sout.addEventListener('click',Sout);
				var addstock=document.getElementById('addstock');
				addstock.addEventListener('click',Addstock);
				$('.maincenter').load("stock.html",viewStock)

			});//end of home js



		}else{
			Errormsg.innerHTML=data;
		}
	}
})
}else{

Errormsg.innerHTML="<strong> Invalid Login Format </strong>"

}
}//end of on click function 


	//alert('alive');


	}
//-------------------------------------menu functions below---------------------------------------------------------
    function viewStock(){
    	var me=document.getElementById("lol");
    	me.onclick=function(){

    		alert("zvf");
    	}

    }
		function Stock(){
		$('.maincenter').load("stock.html",viewStock)

		}
		function Adduser(){
			$('.maincenter').load('adduser.html',function(){
		});
		//alert("fss");
		}
		function Addstock(){
			$('.maincenter').load('addstock.html',function(){
		});

			
		}
		function Accountinfo(){
		alert("fss");
		}
		function Ulist(){
		alert("fss");
		}
		function Comment(){
		alert("fss");
		}
		function Sout(){
		alert("fss");
		}


document.addEventListener("DOMContentLoaded",Main);