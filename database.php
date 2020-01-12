<?php 
session_start();
include("dbAccess.php");

if ($_POST['MSG']=="validate"){
validate_user();

}
if($_POST['MSG']=="addstock"){
	 addstock();
}
if($_POST['MSG']=="stockseacrh"){
stocksearch();
	}
if($_POST['MSG']=="adduser"){
	adduser();
}
if($_POST['MSG']=="purchase"){
	makepurchase();
}
if($_POST['MSG']=="itemdetails"){
	itemdetails();
}
if($_POST['MSG']=="updateitemdetails"){
	updateitemdetails();
	
}
if($_POST['MSG']=="downpmtseacrhinfo"){
	paymentsearch();
	
}
if($_POST['MSG']=="allpaymentdetails"){
	allpaymentdetails();// all payments returns all the items and down payments being made by a customer
	
}
if($_POST['MSG']=="downPayment"){
	downPayment();
	
}
if($_POST['MSG']=="logout"){
	logout();
	
}

function downPayment(){
	include("dbAccess.php");
	$ID=intval($_POST['ID']);
	$Cash=intval(filter_var(htmlspecialchars(trim($_POST['Payment'])),FILTER_SANITIZE_NUMBER_INT));
	$Name=filter_var(htmlspecialchars(trim($_SESSION["fullname"])),FILTER_SANITIZE_STRING); 
	try{
		$stmt = $pdo->prepare('SELECT customerNumber FROM Payments WHERE id= ?');
		$stmt->execute([$ID]);
		$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
		$tel=$result[0]['customerNumber'];
		$stmt = $pdo->prepare('SELECT * FROM Payments WHERE customerNumber= ?');
		$stmt->execute([$tel]);
		$results=$stmt->fetchAll(PDO::FETCH_ASSOC);
		$lastpayment=end($results);//getting last payment for user with $tel
		$balance=intval($lastpayment['balance'])-$Cash;//calculating new balance 
		if ($lastpayment['status']=='OPEN'){ //IF STATUS IS OPEN then a new payment is accepted 

		//inserting payment info in to payment table 
		$stmt=$pdo->prepare("INSERT INTO Payments(customername,customerNumber,itemname,
    	item_cost,amount_of_items,total_cost_of_items,paidbyinsurance,Paidbycash,balance,date_of_purchase,status)VALUES(?,?,?,?,?,?,?,?,?,?,?)");
    	$stmt->execute([$lastpayment['customername'],$lastpayment['customerNumber'],$lastpayment['itemname'],$lastpayment['item_cost'],$lastpayment['amount_of_items'],$lastpayment['total_cost_of_items'],$lastpayment['paidbyinsurance'],$Cash,$balance,date("Y-M-d"),'OPEN']);

    	$stmt = $pdo->prepare('SELECT * FROM Payments WHERE customerNumber= ?');
		$stmt->execute([$tel]);
		$results=$stmt->fetchAll(PDO::FETCH_ASSOC);
		//=====================================================
		foreach ($results as $row) {
			if ($row['status']=='CLOSED'){
				$totalcash=0;
			}else{
				$totalcash=$totalcash+intval($row['Paidbycash']);
		}
		}
		//-------------------------------
		$totalpaid=$totalcash+intval($lastpayment['paidbyinsurance']);

		$lastpayment=end($results);
		if(intval($lastpayment['balance'])<=0){
			//Updating the status if the balance is paid in full 
			$stmt = $pdo->prepare('UPDATE Payments SET status = ? WHERE id= ?');
			$stmt->execute(['CLOSED',$lastpayment['id']]);
			//inserting the data in to the sales table

			$stmt=$pdo->prepare("INSERT INTO Sales(soldby,amount_sold,date_of_sale,
    	itemname,paidbyinsurance,Paidbycash,total_sale,customername,customerNumber)VALUES(?,?,?,?,?,?,?,?,?)");
    	$stmt->execute([$Name,$lastpayment['amount_of_items'],date("Y-M-d"),$lastpayment['itemname'],$lastpayment['paidbyinsurance'],$totalcash,$totalpaid,$lastpayment['customername'],$lastpayment['customerNumber']]);



			echo 'paid in full';
		}else{
			echo'outstanding balance is '.$lastpayment['balance'];
		}
	}else{
		echo 'The current payment has already been paid in full ';

	}

	}catch(Exception $e){
		echo $e;
	}

}
function allpaymentdetails(){
	include("dbAccess.php");
	$ID=intval($_POST['ID']);
	try{

		$stmt = $pdo->prepare('SELECT customerNumber FROM Payments WHERE id= ?');
		$stmt->execute([$ID]);
		$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
		$tel=$result[0]['customerNumber'];
		$stmt = $pdo->prepare('SELECT * FROM Payments WHERE customerNumber= ?');
		$stmt->execute([$tel]);
		$results=$stmt->fetchAll(PDO::FETCH_ASSOC);

				 ?>
<table  id="paymentsdetails" >
	<thead>	
		<th>Customer Name</th>
		<th>Customer Number</th>
		<th>Item Name</th>
		<th>Item Cost</th>
		<th>Item Amount</th>
		<th>Total Cost</th>
		<th>Insur.</th>
		<th>Cash Payment</th>
		<th>Balance</th>
		<th>Payment Date</th>
		<th>Status</th>
		
</thead>
	<?php foreach ($results as $row): ?>
		<tr class="iname">
	<td><?= $row['customername']?></td>
  	<td><?= $row['customerNumber']?></td>
  	<td><?= $row['itemname']?></td>
  	<td><?= $row['item_cost']?></td>
  	<td><?= $row['amount_of_items']?></td>
  	<td><?= $row['total_cost_of_items']?></td>
  	<td><?= $row['paidbyinsurance']?></td>
  	<td><?= $row['Paidbycash']?></td>
  	<td><?= $row['balance']?></td>
  	<td><?= $row['date_of_purchase']?></td>
  	<td><?= $row['status']?></td>
 </tr>
  	
 
<?php endforeach; ?>
</table>
<?php
//---------------------

	}catch(Exception $e){
			 echo $e;
	}

}

function updateitemdetails(){
	include("dbAccess.php");
	$Cost=intval(filter_var(htmlspecialchars(trim($_POST['cost'])),FILTER_SANITIZE_NUMBER_INT));
	$Stock=intval(filter_var(htmlspecialchars(trim($_POST['stock'])),FILTER_SANITIZE_NUMBER_INT));
	$ID=intval($_POST['ID']);
	try{
		$stmt = $pdo->prepare('UPDATE Stocks SET amount = ?, cost = ?  WHERE id= ?');
        $stmt->execute([$Stock,$Cost,$ID]);
        echo 'done';
    }catch(Exception $e){
    	echo $e;
    }


}
function itemdetails(){
	include("dbAccess.php");
	$ID=intval($_POST['ID']);
	try{
	$stmt = $pdo->prepare('SELECT * FROM Stocks WHERE id= ?');
		$stmt->execute([$ID]);
		$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
		echo strlen($result[0]['id']).' '.strlen($result[0]['itemname']).' '.strlen($result[0]['framecode']).' '.strlen($result[0]['framesize']).' '.strlen($result[0]['amount']).' '.strlen($result[0]['cost']).' '.strlen($result[0]['username']).' '.strlen($result[0]['fullname']).' '.strlen($result[0]['framecolor']).'/';

		echo ($result[0]['id'].' '.$result[0]['itemname'].' '.$result[0]['framecode'].' '
		.$result[0]['framesize'].' '.$result[0]['amount'].' '.$result[0]['cost'].' '
		.$result[0]['username'].' '.$result[0]['fullname'].' '.$result[0]['framecolor'].' ' );
		}catch(Exception $e){
			echo $e;
		}




}
function adduser(){
	include("dbAccess.php");
	$Fname=	filter_var(trim(htmlspecialchars($_POST['Fname']),FILTER_SANITIZE_STRING));
	$Lname=filter_var(trim(htmlspecialchars($_POST['Lname']),FILTER_SANITIZE_STRING));
	$Email=filter_var(trim(htmlspecialchars($_POST['Email']),FILTER_SANITIZE_EMAIL));
	$position=filter_var(trim(htmlspecialchars($_POST['position']),FILTER_SANITIZE_STRING));
	$pwd=hash("sha256",$_POST['pwd']);
	try{

		$stmt = $pdo->prepare('SELECT * FROM USERS WHERE email= ?');
		$stmt->execute([$Email]);
		$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
		if(sizeof($result)==0){

		
		$stmt=$pdo->prepare("INSERT INTO USERS(firstname,lastname,password,email,date_joined,position)VALUES(?,?,?,?,?,?)");
		$stmt->execute([$Fname,$Lname,$pwd,$Email,date("Y-M-d"),$position]);
		echo "success";
	}else{
		echo "UserAlreadyExist";
	}

	}catch(Exception $e){
		echo $e;

	}
}
function addstock(){
	include("dbAccess.php");	
	$SColor=filter_var(htmlspecialchars(trim($_POST['SColor'])),FILTER_SANITIZE_STRING);
	$SiName=filter_var(htmlspecialchars(trim($_POST['SiName'])),FILTER_SANITIZE_STRING);
	$FCode=filter_var(htmlspecialchars(trim($_POST['FCode'])),FILTER_SANITIZE_STRING);
	$FSize=filter_var(htmlspecialchars(trim($_POST['FSize'])),FILTER_SANITIZE_STRING);
	$SAmount=intval(filter_var(htmlspecialchars(trim($_POST['SAmount'])),FILTER_SANITIZE_NUMBER_INT));
	$SCost=intval(filter_var(htmlspecialchars(trim($_POST['SCost'])),FILTER_SANITIZE_NUMBER_INT)); 
	$username=filter_var(htmlspecialchars(trim($_SESSION['id'])),FILTER_SANITIZE_EMAIL);
	$Name=filter_var(htmlspecialchars(trim($_SESSION["fullname"])),FILTER_SANITIZE_STRING); 
	try{
		//echo ($SiName." ".$SDes." ".$SAmount."".$SCost."". $username.''.$Name) ;
		$stmt = $pdo->prepare('SELECT * FROM Stocks WHERE framecode= ?');
		$stmt->execute([$FCode]);
		$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
		if(sizeof($result)==0){

		$stmt=$pdo->prepare("INSERT INTO Stocks(itemname,framecode,framesize,framecolor,amount,cost,username,fullname)VALUES(?,?,?,?,?,?,?,?)");
		$stmt->execute([$SiName,$FCode,$FSize,$SColor,$SAmount,$SCost,$username,$Name]);
		echo "success";}
		else{
			echo "itemfound";
		}
		


	}catch(Exception $e){
	echo $e ;
}
}




function validate_user(){
	
	
	include("dbAccess.php");
	//include("classlist.php");
$email=  filter_var(htmlspecialchars($_POST['Email']),FILTER_SANITIZE_EMAIL);
$password=hash("sha256",$_POST['Password']);
try{

$stmt = $pdo->prepare('SELECT * FROM USERS WHERE email= ?');
$stmt->execute([$email]);
$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
if (sizeof($result)!=0):
	if ($result[0]['password']==$password):
			
		$_SESSION["id"]=$email;
		$_SESSION["fullname"] =$result[0]['firstname'].' '.$result[0]['lastname'];
		$_SESSION['position']=$result[0]['position'];
			
			echo "success";
			
	else:
		echo "Invalid Password";
	endif;

else:
	echo "User Not Found";
endif;
}catch(Exception $e){		echo $e->getMessage();}
//echo var_dump($result) ;
}

function paymentsearch(){ 
	include("dbAccess.php");
	
	 $query=filter_var(trim(htmlspecialchars($_POST['query']),FILTER_SANITIZE_STRING)); 
	if (!empty($query)){

		 $stmt=$pdo->query("SELECT * FROM Payments WHERE customername LIKE '%$query%'");
		 $results= $stmt->fetchAll(PDO::FETCH_ASSOC);
		 ?>
<table class="tableStockSearchResults">
	<thead>	
		<th>Payment ID</th>
		<th>Customer Name</th>
		<th>Customer Number</th>
		<th>Paid by Insurance</th>
		<th>Paid by cash</th>
		<th>Balance</th>
		
</thead>
	<?php foreach ($results as $row): ?>
		<tr class="iname">
	<td><?= $row['id']." "?></td>
	<td><?= $row['customername']?></td>
  	<td><?= $row['customerNumber']?></td>
  	<td><?= $row['paidbyinsurance']?></td>
  	<td><?= $row['Paidbycash']?></td>
  	<td><?= $row['balance']?></td>
  	

 </tr>
  	
 
<?php endforeach; ?>
</table>
<?php
	}else{
		$stmt=$pdo->query("SELECT * FROM Payments");
		 $results= $stmt->fetchAll(PDO::FETCH_ASSOC);
		 ?>
<table class="tableStockSearchResults">
	<thead>	
		<th>Payment ID</th>
		<th>Customer Name</th>
		<th>Customer Number</th>
		<th>Paid by Insurance</th>
		<th>Paid by cash</th>
		<th>Balance</th>
		
	</thead>
	<?php foreach ($results as $row): ?>
		<tr class="iname">
	<td><?= $row['id']." "?></td>
	<td><?= $row['customername']?></td>
  	<td><?= $row['customerNumber']?></td>
  	<td><?= $row['paidbyinsurance']?></td>
  	<td><?= $row['Paidbycash']?></td>
  	<td><?= $row['balance']?></td>
  	

 </tr>
  	
 
<?php endforeach; ?>
</table>
<?php
}

}



function stocksearch(){ 
	include("dbAccess.php");
	
	 $query=filter_var(trim(htmlspecialchars($_POST['query']),FILTER_SANITIZE_STRING)); 
	if (!empty($query)){

		 $stmt=$pdo->query("SELECT * FROM Stocks WHERE itemname LIKE '%$query%'");
		 $results= $stmt->fetchAll(PDO::FETCH_ASSOC);
		 ?>
<table class="tableStockSearchResults">
	<thead>	
		<th>Element ID</th>
		<th>Item Name</th>
		<th>Frame Code</th>
		<th>Frame Size</th>
		<th>Frame Colour</th>
		<th>Amount In Stock</th>
		<th>Cost</th>	
</thead>
	<?php foreach ($results as $row): ?>
		<tr class="iname">
	<td><?= $row['id']." "?></td>
	<td><?= $row['itemname']?></td>
  	<td><?= $row['framecode']?></td>
  	<td><?= $row['framesize']?></td>
  	<td><?= $row['framecolor']?></td>
  	<td><?= $row['amount']?></td>
  	<td><?= $row['cost']?></td>

 </tr>
  	
 
<?php endforeach; ?>
</table>
<?php
	}else{
		$stmt=$pdo->query("SELECT * FROM Stocks");
		 $results= $stmt->fetchAll(PDO::FETCH_ASSOC);
		 ?>
<table class="tableStockSearchResults">
	<thead>	
		<th>Element ID</th>
		<th>Item Name</th>
		<th>Frame Code</th>
		<th>Frame Size</th>
		<th>Frame Colour</th>
		<th>Amount In Stock</th>
		<th>Cost</th>	
	</thead>
	<?php foreach ($results as $row): ?>
		<tr class="iname">
	<td><?= $row['id']." "?></td>
	<td><?= $row['itemname']?></td>
  	<td><?= $row['framecode']?></td>
  	<td><?= $row['framesize']?></td>
  	<td><?= $row['framecolor']?></td>
  	<td><?= $row['amount']?></td>
  	<td><?= $row['cost']?></td>

 </tr>
  	
 
<?php endforeach; ?>
</table>
<?php
}

}
function makepurchase(){
	include("dbAccess.php");
	$ID=intval($_POST['ID']);
	$pamount=intval(filter_var(htmlspecialchars(trim($_POST['Pamount'])),FILTER_SANITIZE_NUMBER_INT));
	$CustomerName=filter_var(htmlspecialchars(trim($_POST['CustomerName'])),FILTER_SANITIZE_STRING);
	$CustomerNumber=filter_var(htmlspecialchars(trim($_POST['CustomerNumber'])),FILTER_SANITIZE_STRING);
	$Insurance=intval(filter_var(htmlspecialchars(trim($_POST['Insurance'])),FILTER_SANITIZE_STRING));
	$Cash=intval(filter_var(htmlspecialchars(trim($_POST['Cash'])),FILTER_SANITIZE_STRING));
	$Name=filter_var(htmlspecialchars(trim($_SESSION["fullname"])),FILTER_SANITIZE_STRING); 
	
	try{
	$stmt = $pdo->prepare('SELECT * FROM Stocks WHERE id = ?');
	$stmt->execute([$ID]);
	$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
	
	 if (intval($result[0]['amount'])>=intval($pamount)){//if the item is paid in full 
	 	$total=intval($result[0]['cost'])*$pamount;
	 	$totalpaid=$Insurance+$Cash;
	 	if($totalpaid>=$total){
	 	$itemname=$result[0]['itemname'];
    	$itmecost=$result[0]['cost'];
    	$stmt=$pdo->prepare("INSERT INTO Sales(soldby,amount_sold,date_of_sale,
    	itemname,paidbyinsurance,Paidbycash,total_sale,customername,customerNumber)VALUES(?,?,?,?,?,?,?,?,?)");
    	$stmt->execute([$Name,$pamount,date("Y-M-d"),$itemname,$Insurance,$Cash,$totalpaid,$CustomerName,$CustomerNumber]);


	 		//echo'paid in full';


	 		//===============
	 		?><head><link rel="stylesheet" type="text/css" href="index.css"> </head>
	 		<div>
       <p>Your eyes optical<br> Shop #2 Lee's Plaza<br>Claremont St Ann</p>
       <hr>
       <h6 class="receipt">Item Name</h6>
        <?=$result[0]['itemname'];?><br>
        <h6 class="receipt">Item Code</h6>
        <?=$result[0]['framecode'];?><br>
        <h6 class="receipt">Item Size</h6>
        <?=$result[0]['framesize'];?><br>
        <h6 class="receipt">QTY</h6>
        <?=$pamount;?><br>
        <h6 class="receipt">Cost</h6>
        <?='$'.$result[0]['cost'];?><br>
        <hr>
        <h6 class="receipt">Total</h6>
        <?='$'.$result[0]['cost']*$pamount;?>
        </div>
        <?php





	 	//insert receipt here.

	 	$stmt = $pdo->prepare('UPDATE Stocks SET amount = ? WHERE id= ?');
        $stmt->execute([intval($result[0]['amount'])-$pamount, $ID]);
    }else{//if the item is not paid in full

    	$stmt = $pdo->prepare('SELECT * FROM Payments WHERE customerNumber=?');
    	$stmt->execute([$CustomerNumber]);
    	$rsl= $stmt->fetchAll(PDO::FETCH_ASSOC);
    	if (intval(end($rsl)['balance'])<=0){
    	 	
    	$itemname=$result[0]['itemname'];
    	$itmecost=$result[0]['cost'];
    	$balance=$total-$totalpaid;
    	$stmt=$pdo->prepare("INSERT INTO Payments(customername,customerNumber,itemname,
    	item_cost,amount_of_items,total_cost_of_items,paidbyinsurance,Paidbycash,balance,date_of_purchase,status)VALUES(?,?,?,?,?,?,?,?,?,?,?)");
    	$stmt->execute([$CustomerName,$CustomerNumber,$itemname,$itmecost,$pamount,$total,$Insurance,$Cash,$balance,date("Y-M-d"),'OPEN']);
    	$stmt = $pdo->prepare('UPDATE Stocks SET amount = ? WHERE id= ?');
        $stmt->execute([intval($result[0]['amount'])-$pamount, $ID]);
    	echo'Downpayment Successfull';
    	}else{
    		echo 'Downpayment not successfull '.$CustomerName.' has an outstanding item';

    	}

    	



    }
       /* ?><div>
       <p>Your eyes optical<br> Shop #2 Lee's Plaza<br>Claremont St Ann</p>
       <hr>
       <h6 class="receipt">Item Name</h6>
        <?=$result[0]['itemname'];?><br>
        <h6 class="receipt">Item Code</h6>
        <?=$result[0]['framecode'];?><br>
        <h6 class="receipt">Item Size</h6>
        <?=$result[0]['framesize'];?><br>
        <h6 class="receipt">QTY</h6>
        <?=$pamount;?><br>
        <h6 class="receipt">Cost</h6>
        <?='$'.$result[0]['cost'];?><br>
        <hr>
        <h6 class="receipt">Total</h6>
        <?='$'.$result[0]['cost']*$pamount;?>
        </div>
        <?php*/
    	
	 }else{
	 	echo'not enough items in stock';
	 }


}catch(Exception $e){
echo $e;
}


}
function logout()
{
    if (isset($_COOKIE[session_name()])) :
        setcookie(session_name(), '', time() - 7000000, '/');
        session_destroy();
        echo "success";

    endif;
}
function test(){
		if ($_SESSION['position']!='Admin'){
			echo'access denied';
		}else{
			echo'access granted';
	}
}





