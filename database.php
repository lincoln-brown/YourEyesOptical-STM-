<?php 

if ($_POST['MSG']=="validate"){
validate_user();
}






function validate_user(){
	include("dbAccess.php");
$email=  filter_var(htmlspecialchars($_POST['Email']),FILTER_SANITIZE_EMAIL);
$password=hash("sha256",$_POST['Password']);

$stmt = $pdo->prepare('SELECT * FROM USERS WHERE email= ?');
$stmt->execute([$email]);
$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
if (sizeof($result)!=0){
	if ($result[0]['password']==$password){
			echo "success";
			session_id($email);
			session_start();
			$_SESSION['id']=$email;
			

	}else{
		echo "Invalid Password";
	}

}else{
	echo "User Not Found";
}
//echo var_dump($result) ;


}




