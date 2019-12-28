"use strict";
function Main(){



	var bt=document.getElementById("Sbutton");
	var pwd=document.getElementById('pwd');
	var Email=document.getElementById('Em')
	var Errormsg=document.querySelector(".errorm");
	var Emailexp=/[a-zA-Z0-9]+\@[a-zA-Z0-9]+\.[a-zA-Z0-9]+/;
	var pwdexp=/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;// not yet used 


bt.onclick=function(e){
	e.preventDefault();
	if (Emailexp.test(Email.value)&& pwd.value!=""){
$.ajax({
	type:'POST',
	url:'database.php',
	data:{Email:Em.value,Password:pwd.value,MSG:"validate"},
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
				$('.maincenter').load("stock.html",viewStockjs)

			});//end of home js. the above code loades the menus options and applies action listener to each option. Also the viewStock fuction is loaded which alows the user to search for stocks see function bellow.



		}else{
			pwd.value='';
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
//-------------------------------------java script functions for menu functions below---------------------------------------------------------
    function viewStockjs(){// viewsStock function is by its self becasus it is used multiple times in the system.
    	var stockseacrhbtn=document.getElementById("stockseacrh");
    	var  stockseacrhinfo=document.getElementById("stockseacrhinfo");
    	var results=document.querySelector(".Searchresults");

    	stockseacrhbtn.onclick=function(e){
    		e.preventDefault();
    		$.ajax({
    		type:'POST',
    		url:'database.php',
    		data:{ query:stockseacrhinfo.value,MSG:"stockseacrh"},
    		success: function(data){
    			results.innerHTML=data;//retuns table 
    			var iname=document.getElementsByClassName("iname");//iname is a class name of tr returned from the server
    			$(".iname").hover(function(){$(this).toggleClass("hover");});// hover function for table rows
    			$(iname).on("click",function(){
    				var trow= $(this).text().split(" ");//.text() returns the row data as string
    				//purchase(trow);
    				$('.maincenter').load('iteminterface.html',function(){
    					purchase(trow)
    					 					

    					$('#IFpurchase').click(function(){
    						$('.Idetails').load('IFpurchase.html',function(){
    							purchase(trow);
    						});
    						
    					});

    					$('#IFdetails').click(function(){
							
							$('.Idetails').load('IFdetails.html',function(){
    							IFdetails(trow);
    						});

    					});
    					$('#IFedit').click(function(){
							alert('n/i');


    					});


    					
    				});



    				//alert(trow[0]);

    			});//end of eventlistener for table elements

    		}//end of success function
    	});
    }//end of on click function 

    
    function purchase(trow){//this function must only b called after iteminterface.html has been loaded into the DOM
    	//$('.maincenter').load('iteminterface.html',function(){
    					//var results=document.querySelector(".Idetails");
    					
    	var itemid=document.querySelector("#itemid");
    	var itemname=document.querySelector("#itemname");
    	var itemcode=document.querySelector("#itemcode");
    	var itemsize=document.querySelector("#itemsize");
    	var aIstock=document.querySelector("#AIstock");
    	var cost=document.querySelector("#cost");
    	var calcinput= document.getElementById('calcinput');
    	var calcbutton= document.getElementById('calcbutton');
    	var calcinputexp=/^[1-9]+[0-9]*$/;
    	
    	itemid.innerHTML=trow[0];
    	itemname.innerHTML=trow[1]
    	itemcode.innerHTML=trow[3];
    	itemsize.innerHTML=trow[5];
    	aIstock.innerHTML=trow[7];
    	cost.innerHTML='$'+trow[9];

    	calcbutton.onclick=function(e){
    		e.preventDefault();
    		if(calcinputexp.test(calcinput.value)){
    			$.ajax({
    				type:'POST',
    				url:'database.php',
    				data:{ID:trow[0],Pamount:calcinput.value,MSG:'purchase'},
    				success:function(data){
    					var iteminfo=document.querySelector("#iteminfo");
    					iteminfo.innerHTML=data;
    					calcinput.value='';
    					calcbutton.value='Purchace Again';



    				}//end of success function
    			});//end of ajax request for purchase



    		}else{//below shows if purchase feild is not validated
    			alert('Quantity not selected');


    		}

    	}//end of onclick fo calbotton
    	

    		
   
    }//end of purchase function

    function IFdetails(trow){
    	var itemid=document.querySelector("#itemid");
    	var itemname=document.querySelector("#itemname");
    	var itemcode=document.querySelector("#itemcode");
    	var itemsize=document.querySelector("#itemsize");
    	var aIstock=document.querySelector("#AIstock");
    	var cost=document.querySelector("#cost");
    	var addedby=document.querySelector("#addedby");
    	var addedbyemail=document.querySelector("#addedbyemail");
    	
    	$.ajax({
    		type:'POST',
    		url:'database.php',
    		data:{ID:trow[0],MSG:'itemdetails'},
    		success:function(data){
    			var itemDts =data.split(" ");
    			
    			itemid.innerHTML=itemDts[0];
    			itemname.innerHTML=itemDts[1];
    			itemcode.innerHTML=itemDts[2];
		    	itemsize.innerHTML=itemDts[3];
		    	aIstock.innerHTML=itemDts[4];
		    	cost.innerHTML='$'+itemDts[5];
		    	addedbyemail.innerHTML=itemDts[6];
		    	addedby.innerHTML=itemDts[7]+' '+itemDts[8];
		    	


    		}
    	});
    }//end of IFdetails function 

     function IFdedit(){
    	alert('yes sir');
    }//end of IFedit function 

    }//end of view stock function 
    
   

	function addStockjs(){
				var SiName = document.getElementById('SiName');
				var FCode=document.getElementById('FCode');
				var FSize=document.getElementById('FSize');
				var SAmount=document.getElementById('SAmount');
				var SCost=document.getElementById('SCost');
				var stockinputbtn=document.getElementById('stockinputbtn');
				var submitStatus=document.querySelector("#submitStatus");
				var SiNameExp=/[a-zA-Z0-9]+/;
				var FCodeExp=/[a-zA-Z0-9]+/;
				var SAmountExp=/[0-9]+/;
				var SCostExp=/[0-9]+/;
				var FSizeExp=/[a-zA-Z0-9]+/;

				stockinputbtn.onclick=function(e){
					e.preventDefault();
				if (SiNameExp.test(SiName.value)&&FCodeExp.test(FCode.value)&&FSizeExp.test(FSize.value)&& SAmountExp.test(SAmount.value)
					&&SCostExp.test(SCost.value)){
					SiName.classList.remove('invalidstockinput');
					SiName.classList.add('stockinput');
					FCode.classList.remove('invalidstockinput');
					FCode.classList.add('stockinput');
					FSize.classList.remove('invalidstockinput');
					FSize.classList.add('stockinput');
					SAmount.classList.remove('invalidstockinput');
					SAmount.classList.add('stockinput');
					SCost.classList.remove('invalidstockinput');
					SCost.classList.add('stockinput');
					submitStatus.innerHTML='';

					$.ajax({
						type:'POST',
						url:'database.php',
						data:{SiName:SiName.value,FCode:FCode.value,FSize:FSize.value,
						SAmount:SAmount.value,SCost:SCost.value,MSG:'addstock' },
						success: function(data){
							if (data==="success"){
								SiName.value='';
								FCode.value='';
								FSize.value='';
								SAmount.value='';
								SCost.value='';
								submitStatus.classList.remove('invalid')
								submitStatus.classList.add('valid')
								submitStatus.innerHTML="<strong>Item Added</strong>";

							}else if (data==="itemfound"){
							submitStatus.innerHTML="<strong>This Item is already in stock, if you wish to update or remove the item please use the update item option </strong>";

							}else{
								alert(data);
							}
						}//end of ajax request success function
					})// end of ajax request
				}else{// bellow shows what will happen if the feilds are not validated.
					if (SiNameExp.test(SiName.value)==false){
						SiName.classList.remove('stockinput');
						SiName.classList.add('invalidstockinput');

					}else{
						SiName.classList.remove('invalidstockinput');
						SiName.classList.add('stockinput');

					}
					if(FCodeExp.test(FCode.value)==false){
						FCode.classList.remove('stockinput');
						FCode.classList.add('invalidstockinput');
					}else{
						FCode.classList.remove('invalidstockinput');
						FCode.classList.add('stockinput');
					}
					if(FSizeExp.test(FSize.value)==false){
						FSize.classList.remove('stockinput');
						FSize.classList.add('invalidstockinput');
					}else{
						FSize.classList.remove('invalidstockinput');
						FSize.classList.add('stockinput');						
					}
					if(SAmountExp.test(SAmount.value)==false){
						SAmount.classList.remove('stockinput');
						SAmount.classList.add('invalidstockinput');
					}else{
						SAmount.classList.remove('invalidstockinput');
						SAmount.classList.add('stockinput');	
						
					}
					if(SCostExp.test(SCost.value)==false){
						SCost.classList.remove('stockinput');
						SCost.classList.add('invalidstockinput');
					}else{
						SCost.classList.remove('invalidstockinput');
						SCost.classList.add('stockinput');						
					}

					
					submitStatus.innerHTML="<strong>Missing or Invalid Data  Detected </strong>";
				}//end of else
			}//end of click function
		}//end of Addstockjs

	function addUserjs(){
		var Fname = document.getElementById('Fname');
		var Lname = document.getElementById('Lname');
		var Email = document.getElementById('Email');
		var posi = document.getElementById('posi');
		var pwd =document.getElementById('pwd');
		var vpwd =document.getElementById('vpwd');
		var adduserbtn =document.querySelector('.adduserbtn');
		var UsubmitStatus=document.querySelector("#UsubmitStatus");
		var NameExp=/[a-zA-Z]+/;
		var Emailexp=/[a-zA-Z0-9]+\@[a-zA-Z0-9]+\.[a-zA-Z0-9]+/;
		var posiexp=/(Clerk|Admin)/;
		var pwdexp=/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;

		adduserbtn.onclick=function(e){
			e.preventDefault();

			if(NameExp.test(Fname.value)&&NameExp.test(Lname.value)&&Emailexp.test(Email.value)
				&&posiexp.test(posi.value)&&pwdexp.test(pwd.value) &&pwd.value===vpwd.value){
				Fname.classList.remove('invalidAddUser');
				Fname.classList.add('adduser');
				Lname.classList.remove('invalidAddUser');
				Lname.classList.add('adduser');
				Email.classList.remove('invalidAddUser');
				Email.classList.add('adduser');
				posi.classList.remove('invalidAddUser');
				posi.classList.add('adduser');
				pwd.classList.remove('invalidAddUser');
				pwd.classList.add('adduser');
				vpwd.classList.remove('invalidAddUser');
				vpwd.classList.add('adduser')
				UsubmitStatus.innerHTML='';
				$.ajax({
					type:'POST',
					url:'database.php',
					data:{Fname:Fname.value,Lname:Lname.value,Email:Email.value,
						position:posi.value,pwd:pwd.value,MSG:'adduser'},
					success:function(data){
						if(data==="UserAlreadyExist"){
							UsubmitStatus.classList.remove('valid');
							UsubmitStatus.classList.add('UsubmitStatus');
					UsubmitStatus.innerHTML=' A user is already associated with that email address please try agian using a another email address';
					Email.value='';

						}
						else if(data==="success"){
							UsubmitStatus.innerHTML='<strong>User Added</strong>';
							UsubmitStatus.classList.add('valid');
							Fname.value='';
							Lname.value='';
							Email.value='';
							posi.value='';
							pwd.value='';
							vpwd.value='';

						}else{
							alert('Please review  data entered if this message continues please contact a system Admin');

						}					

						}//end of success function
					})//endof ajax call


			}else{
				if(NameExp.test(Fname.value)==false){
					Fname.classList.remove('adduser');
					Fname.classList.add('invalidAddUser');
					}else{
					Fname.classList.remove('invalidAddUser');
					Fname.classList.add('adduser');
					}
				if(NameExp.test(Lname.value)==false){
					Lname.classList.remove('adduser');
					Lname.classList.add('invalidAddUser');
					}else{
					Lname.classList.remove('invalidAddUser');
					Lname.classList.add('adduser');
				}
				if(Emailexp.test(Email.value)==false){
					Email.classList.remove('adduser');
					Email.classList.add('invalidAddUser');
					}else{
					Email.classList.remove('invalidAddUser');
					Email.classList.add('adduser');
				}
				if(posiexp.test(posi.value)==false){
					posi.classList.remove('adduser');
					posi.classList.add('invalidAddUser');
					}else{
					posi.classList.remove('invalidAddUser');
					posi.classList.add('adduser');
				}
				if(pwdexp.test(pwd.value)==false){
					pwd.classList.remove('adduser');
					pwd.classList.add('invalidAddUser');
					}else{
					pwd.classList.remove('invalidAddUser');
					pwd.classList.add('adduser');
				}
				if(pwdexp.test(vpwd.value)==false){
					vpwd.classList.remove('adduser');
					vpwd.classList.add('invalidAddUser');
					}else{
					vpwd.classList.remove('invalidAddUser');
					vpwd.classList.add('adduser');
				}
				if(pwd.value!=vpwd.value){
					UsubmitStatus.innerHTML='<strong>Passwords do not Match </strong>'
				}else{
					UsubmitStatus.innerHTML='';

				}

			}
			//alert(pwdexp.test(pwd.value));



			}//end of onclick
		}// end of  adduserjs		

//-------------------------------------------------------------------------------------------------    
		function Stock(){
		$('.maincenter').load("stock.html",viewStockjs)
		}
		function Adduser(){
			$('.maincenter').load('adduser.html',addUserjs)
		}
		function Addstock(){
			$('.maincenter').load('addstock.html',addStockjs)			
		}
		function Accountinfo(){
		alert("Not Impemented ");
		}
		function Ulist(){
		alert("Not Impemented");
		}
		function Comment(){
		alert("Not Impemented");
		}
		function Sout(){
		alert("Not Impemented");
		}


document.addEventListener("DOMContentLoaded",Main);