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
	//echo var_dump($_POST);
	adduser();
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
		$stmt->execute([$Fname,$Lname,$pwd,$Email,date("Y-M-D"),$position]);
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
	$SiName=filter_var(trim(htmlspecialchars($_POST['SiName']),FILTER_SANITIZE_STRING));
	$FCode=filter_var(htmlspecialchars($_POST['FCode']),FILTER_SANITIZE_STRING);
	$FSize=filter_var(htmlspecialchars($_POST['FSize']),FILTER_SANITIZE_STRING);
	$SAmount=intval(trim(filter_var(htmlspecialchars($_POST['SAmount']),FILTER_SANITIZE_NUMBER_INT)));
	$SCost=intval(trim(filter_var(htmlspecialchars($_POST['SCost']),FILTER_SANITIZE_NUMBER_INT))); 
	$username=filter_var(htmlspecialchars($_SESSION['id']),FILTER_SANITIZE_EMAIL);
	$Name=filter_var(htmlspecialchars($_SESSION["fullname"]),FILTER_SANITIZE_STRING); 
	try{
		//echo ($SiName." ".$SDes." ".$SAmount."".$SCost."". $username.''.$Name) ;

		$stmt=$pdo->prepare("INSERT INTO Stocks(itemname,framecode,framesize,amount,cost,username,fullname)VALUES(?,?,?,?,?,?,?)");
		$stmt->execute([$SiName,$FCode,$FSize,$SAmount,$SCost,$username,$Name]);
		echo "success";
		


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

function stocksearch(){ 
	include("dbAccess.php");
	
	 $query=filter_var(trim(htmlspecialchars($_POST['query']),FILTER_SANITIZE_STRING)); 
	if (!empty($query)){

		 $stmt=$pdo->query("SELECT * FROM Stocks WHERE itemname LIKE '%$query%'");
		 $results= $stmt->fetchAll(PDO::FETCH_ASSOC);
		 ?>
<table id="tableStockSearchResults">
	<thead>
	<tr class="head">
		<th>Item Name</th>
		<th>Frame Code</th>
		<th>Frame Size</th>
		<th>Amount In Stock</th>
		<th>Cost</th>
	</tr>
</thead>
	<?php foreach ($results as $row): ?>
		<tr>
	<td><?= $row['itemname']?></td>
  	<td><?= $row['framecode']?></td>
  	<td><?= $row['framesize']?></td>
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
<table id="tableStockSearchResults">
	<thead>
	<tr class="head">
		<th>Item Name</th>
		<th>Frame Code</th>
		<th>Frame Size</th>
		<th>Amount In Stock</th>
		<th>Cost</th>
	</tr>
	</thead>
	<?php foreach ($results as $row): ?>
		<tr>
	<td><?= $row['itemname']?></td>
  	<td><?= $row['framecode']?></td>
  	<td><?= $row['framesize']?></td>
  	<td><?= $row['amount']?></td>
  	<td><?= $row['cost']?></td>

 </tr>
  	
 
<?php endforeach; ?>
</table>
<?php

	
}

}





