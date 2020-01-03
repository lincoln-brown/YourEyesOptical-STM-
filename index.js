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
				var downPayments=document.getElementById('DownPayments');
				downPayments.addEventListener('click',DownPayments);
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
    	var stockseacrhbtn=document.getElementById("seacrh");
    	var  stockseacrhinfo=document.getElementById("seacrhinfo");
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
    				$('.maincenter').load('iteminterface.html',function(){
    					purchase(trow);
    					 					

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
    						$('.Idetails').load('IFupdate.html',function(){
    							IFupdate(trow);
    						});
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
    	var itemcolor=document.querySelector("#itemcolor");
    	var aIstock=document.querySelector("#AIstock");
    	var cost=document.querySelector("#cost");    	
    	var customerName= document.getElementById('customerName')
    	var customerNumber= document.getElementById('customerNumber');
    	var paidbyinsurance= document.getElementById('paidbyinsurance');
    	var paidbycash= document.getElementById('paidbycash');
    	var purchaceAmt= document.getElementById('purchaceAmt');
    	var calcbutton= document.getElementById('calcbutton');
    	var customerNameExp=/[a-zA-Z0-9]+/;
    	var customerNumberExp=/[0-9]{3}\-[0-9]{3}\-[0-9]{4}/;
    	var paidbyinsuranceExp=/[0-9]+/;
    	var paidbycashExp= /[0-9]+/;
    	var purchaceAmtExp=/^[1-9]+[0-9]*$/;

    	$.ajax({
    		type:'POST',
    		url:'database.php',
    		data:{ID:trow[0],MSG:'itemdetails'},
    		success:function(data){/*the data recieved from the server is divided into two parts,size and dta
    			  size contans the size of each data while dta contains the data which is split in to one lage array with individual charaters
    			  the size array is used to get the start and end index of each data  which is then displyed in their respective divs 
    			  the parseInt function isues to convert the index  from string  to int*/
    			var itemDts =data.split("/");
    			var size=itemDts[0].split(" ");
    			var dta=itemDts[1].split("");
    			var id=dta.slice(0,parseInt(size[0]));
    			var name=dta.slice(parseInt(size[0]),parseInt(size[0])+parseInt(size[1])+1);
    			var code=dta.slice(parseInt(size[0])+parseInt(size[1])+1,parseInt(size[0])+parseInt(size[1])+1+parseInt(size[2])+1);
    			var isize=dta.slice(parseInt(size[0])+parseInt(size[1])+1+parseInt(size[2])+1,parseInt(size[0])+parseInt(size[1])+1+parseInt(size[2])+1+parseInt(size[3])+1);
    			var st=parseInt(size[0])+parseInt(size[1])+1+parseInt(size[2])+1+parseInt(size[3])+1;

    			var stock=dta.slice(st,st+parseInt(size[4])+1);
    			var icost=dta.slice(st+parseInt(size[4])+1,st+parseInt(size[4])+1+parseInt(size[5])+1);
    			var color=dta.slice(st+parseInt(size[4])+1+parseInt(size[5])+1+parseInt(size[6])+1+parseInt(size[7])+1,st+parseInt(size[4])+1+parseInt(size[5])+1+parseInt(size[6])+1+parseInt(size[7])+1+parseInt(size[8])+1)
    			itemid.innerHTML=id.join('');
    			itemname.innerHTML=name.join('');
    			itemcode.innerHTML=code.join('');
		    	itemsize.innerHTML=isize.join('');
		    	itemcolor.innerHTML=color.join('');
		    	aIstock.innerHTML=stock.join('');
		    	cost.innerHTML=icost.join('');
    		}
    	});
    	//-------------------What happens when thr purchase btn is clicked ------------------------
    	calcbutton.onclick=function(e){
    		e.preventDefault();
    		if(customerNameExp.test(customerName.value)&&customerNumberExp.test(customerNumber.value)
    			&&paidbyinsuranceExp.test(paidbyinsurance.value)&&paidbycashExp.test(paidbycash.value)
    			&&purchaceAmtExp.test(purchaceAmt.value)){
    			customerName.classList.remove('invalid');
    			customerNumber.classList.remove('invalid');
    			paidbyinsurance.classList.remove('invalid'); 
    			paidbycash.classList.remove('invalid'); 
    			purchaceAmt.classList.remove('invalid');  

    			$.ajax({
    				type:'POST',
    				url:'database.php',
    				data:{ID:trow[0],CustomerName:customerName.value,
    					CustomerNumber:customerNumber.value,Insurance:paidbyinsurance.value,
    					Cash:paidbycash.value,Pamount:purchaceAmt.value,MSG:'purchase'},
    				success:function(data){
    					var iteminfo=document.querySelector("#iteminfo");
    					iteminfo.innerHTML=data;
    					purchaceAmt.value='';
    					//calcbutton.style.display='none';



    				}//end of success function
    			});//end of ajax request for purchase



    		}else{//below shows if purchase feild is not validated
    			//alert('invalid data detected');
    			if(customerNameExp.test(customerName.value)==false){
    				customerName.classList.add('invalid');
    			}else{
    				customerName.classList.remove('invalid');
    			}
    			if(customerNumberExp.test(customerNumber.value)==false){
    				customerNumber.classList.add('invalid');
    			}else{
    				customerNumber.classList.remove('invalid');
    			}
    			if(paidbyinsuranceExp.test(paidbyinsurance.value)==false){
    				paidbyinsurance.classList.add('invalid');
    			}else{
    			   paidbyinsurance.classList.remove('invalid'); 				
    			}
    			if(paidbycashExp.test(paidbycash.value)==false){
    				paidbycash.classList.add('invalid');
    			}else{
    				paidbycash.classList.remove('invalid'); 	    				
    			}
    			if(purchaceAmtExp.test(purchaceAmt.value)==false){
    				purchaceAmt.classList.add('invalid');
    			}else{
    				purchaceAmt.classList.remove('invalid');     				
    			}


    		}

    	}//end of onclick fo calbotton
    	

    		
   
    }//end of purchase function

    function IFdetails(trow){
    	var itemid=document.querySelector("#itemid");
    	var itemname=document.querySelector("#itemname");
    	var itemcode=document.querySelector("#itemcode");
    	var itemsize=document.querySelector("#itemsize");
    	var itemcolor=document.querySelector("#itemcolor");
    	var aIstock=document.querySelector("#AIstock");
    	var cost=document.querySelector("#cost");
    	var addedby=document.querySelector("#addedby");
    	var addedbyemail=document.querySelector("#addedbyemail");
    	
    	$.ajax({
    		type:'POST',
    		url:'database.php',
    		data:{ID:trow[0],MSG:'itemdetails'},
    		success:function(data){/*the data recieved from the server is divided into two parts,size and dta
    			  size contans the size of each data while dta contains the data which is split in to one lage array with individual charaters
    			  the size array is used to get the start and end index of each data  which is then displyed in their respective divs 
    			  the parseInt function isues to convert the index  from string  to int*/
    			var itemDts =data.split("/");
    			var size=itemDts[0].split(" ");
    			var dta=itemDts[1].split("");
    			var id=dta.slice(0,parseInt(size[0]));
    			var name=dta.slice(parseInt(size[0]),parseInt(size[0])+parseInt(size[1])+1);
    			var code=dta.slice(parseInt(size[0])+parseInt(size[1])+1,parseInt(size[0])+parseInt(size[1])+1+parseInt(size[2])+1);
    			var isize=dta.slice(parseInt(size[0])+parseInt(size[1])+1+parseInt(size[2])+1,parseInt(size[0])+parseInt(size[1])+1+parseInt(size[2])+1+parseInt(size[3])+1);
    			var st=parseInt(size[0])+parseInt(size[1])+1+parseInt(size[2])+1+parseInt(size[3])+1;

    			var stock=dta.slice(st,st+parseInt(size[4])+1);
    			var icost=dta.slice(st+parseInt(size[4])+1,st+parseInt(size[4])+1+parseInt(size[5])+1);
    			var email= dta.slice(st+parseInt(size[4])+1+parseInt(size[5])+1,st+parseInt(size[4])+1+parseInt(size[5])+1+parseInt(size[6])+1);
    			var addername=dta.slice(st+parseInt(size[4])+1+parseInt(size[5])+1+parseInt(size[6])+1,st+parseInt(size[4])+1+parseInt(size[5])+1+parseInt(size[6])+1+parseInt(size[7])+1);
    			var color=dta.slice(st+parseInt(size[4])+1+parseInt(size[5])+1+parseInt(size[6])+1+parseInt(size[7])+1,st+parseInt(size[4])+1+parseInt(size[5])+1+parseInt(size[6])+1+parseInt(size[7])+1+parseInt(size[8])+1)
    			itemid.innerHTML=id.join('');
    			itemname.innerHTML=name.join('');
    			itemcode.innerHTML=code.join('');
		    	itemsize.innerHTML=isize.join('');
		    	itemcolor.innerHTML=color.join('');
		    	aIstock.innerHTML=stock.join('');
		    	cost.innerHTML=icost.join('');
		    	addedbyemail.innerHTML=email.join('');
		    	addedby.innerHTML=addername.join('');
		    	


    		}
    	});
    }//end of IFdetails function 

     function IFupdate(trow){
     	var itemid=document.querySelector("#itemid");
    	var itemname=document.querySelector("#itemname");
    	var itemcode=document.querySelector("#itemcode");
    	var itemsize=document.querySelector("#itemsize");
    	var itemcolor=document.querySelector("#itemcolor");
    	var uDstock=document.querySelector("#UDstock");
    	var uDcost=document.querySelector("#UDcost");
    	var updatebtn=document.getElementById('updatebtn');
    	
    	
    	$.ajax({
    		type:'POST',
    		url:'database.php',
    		data:{ID:trow[0],MSG:'itemdetails'},
    		success:function(data){
    			var itemDts =data.split("/");
    			var size=itemDts[0].split(" ");
    			var dta=itemDts[1].split("");
    			var id=dta.slice(0,parseInt(size[0]));
    			var name=dta.slice(parseInt(size[0]),parseInt(size[0])+parseInt(size[1])+1);
    			var code=dta.slice(parseInt(size[0])+parseInt(size[1])+1,parseInt(size[0])+parseInt(size[1])+1+parseInt(size[2])+1);
    			var isize=dta.slice(parseInt(size[0])+parseInt(size[1])+1+parseInt(size[2])+1,parseInt(size[0])+parseInt(size[1])+1+parseInt(size[2])+1+parseInt(size[3])+1);
    			var st=parseInt(size[0])+parseInt(size[1])+1+parseInt(size[2])+1+parseInt(size[3])+1;

    			var stock=dta.slice(st,st+parseInt(size[4])+1);
    			var icost=dta.slice(st+parseInt(size[4])+1,st+parseInt(size[4])+1+parseInt(size[5])+1);
    			var color=dta.slice(st+parseInt(size[4])+1+parseInt(size[5])+1+parseInt(size[6])+1+parseInt(size[7])+1,st+parseInt(size[4])+1+parseInt(size[5])+1+parseInt(size[6])+1+parseInt(size[7])+1+parseInt(size[8])+1)
    			itemid.innerHTML=id.join('');
    			itemname.innerHTML=name.join('');
    			itemcode.innerHTML=code.join('');
		    	itemsize.innerHTML=isize.join('');
		    	itemcolor.innerHTML=color.join('');
		    	uDstock.value=parseInt(stock.join(''));
		    	uDcost.value=parseInt(icost.join(''));





    			//--------------------------------------
    			
		    	updatebtn.onclick=function(){
		    		$.ajax({
		    			type:'POST',
			    		url:'database.php',
			    		data:{ID:trow[0],stock:uDstock.value,cost:uDcost.value,MSG:'updateitemdetails'},
			    		success:function(data){
			    			alert(data);

			    		}//end of success function for update details
			    	});//end of ajax call

		    	} //end off on click function 	


    		}//end of success funtion for item details used to  update items
    	});//end of ajax call for items details






    	
    }//end of IFedit function 

    }//end of view stock function 
    
   function downPayments(){
  		var downpmtseacrhbtn=document.getElementById("seacrh");
    	var  downpmtseacrhinfo=document.getElementById("seacrhinfo");
    	var paymentsearchresults=document.querySelector(".Searchresults")
    	document.getElementById("stocklable").innerHTML="Enter Customer Name";
    	downpmtseacrhbtn.onclick=function(e){
    		e.preventDefault();
    		$.ajax({
    		type:'POST',
    		url:'database.php',
    		data:{ query:downpmtseacrhinfo.value,MSG:"downpmtseacrhinfo"},
    		success: function(data){
    			paymentsearchresults.innerHTML=data;
    			$(".iname").hover(function(){$(this).toggleClass("hover");});
    			$(".iname").on("click",function(){
    			var trow= $(this).text().split(" ");
    			alert(trow);


    			});

    		}
    	});//end of  ajax call




    	}//end off onclick for downpmtseacrhbtn


   }//end of down payments 

	function addStockjs(){
				var SiName = document.getElementById('SiName');
				var FCode=document.getElementById('FCode');
				var FSize=document.getElementById('FSize');
				var SAmount=document.getElementById('SAmount');
				var SCost=document.getElementById('SCost');
				var SColor=document.getElementById('IColor');
				var stockinputbtn=document.getElementById('stockinputbtn');
				var submitStatus=document.querySelector("#submitStatus");
				var SiNameExp=/[a-zA-Z0-9]+/;
				var FCodeExp=/[a-zA-Z0-9]+/;
				var SAmountExp=/[0-9]+/;
				var SCostExp=/[0-9]+/;
				var FSizeExp=/[a-zA-Z0-9]+/;
				var SColorExp=/[a-zA-Z0-9]+/;

				stockinputbtn.onclick=function(e){
					e.preventDefault();
				if (SColorExp.test(SColor.value)&&SiNameExp.test(SiName.value)&&FCodeExp.test(FCode.value)&&FSizeExp.test(FSize.value)&& SAmountExp.test(SAmount.value)
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
					SColor.classList.remove('invalidstockinput');
					SColor.classList.add('stockinput');
					submitStatus.innerHTML='';

					$.ajax({
						type:'POST',
						url:'database.php',
						data:{SColor:SColor.value,SiName:SiName.value,FCode:FCode.value,FSize:FSize.value,
						SAmount:SAmount.value,SCost:SCost.value,MSG:'addstock' },
						success: function(data){
							if (data==="success"){
								SiName.value='';
								FCode.value='';
								FSize.value='';
								SAmount.value='';
								SCost.value='';
								SColor.value='';
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
					
					if(SColorExp.test(SColor.value)==false){
						SColor.classList.remove('stockinput');
						SColor.classList.add('invalidstockinput');
					}else{
						SColor.classList.remove('invalidstockinput');
						SColor.classList.add('stockinput');						
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
		function DownPayments(){
			$('.maincenter').load('stock.html',downPayments)
		
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