<?php

require_once (dirname(__FILE__) . "/include/common.inc.php");

require_once(DEDEINC.'/memberlogin.class.php');

		$cfg_ml = new MemberLogin();

		if($cfg_ml->IsLogin()){

		$login='1';//�Ѿ���½

		}else{

		$login='2';//û�е�½

		}

$arr2 = array("login"=>$login);

echo json_encode($arr2); 