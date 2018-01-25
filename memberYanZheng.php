<?php

require_once (dirname(__FILE__) . "/include/common.inc.php");

require_once(DEDEINC.'/memberlogin.class.php');

		$cfg_ml = new MemberLogin();

		if($cfg_ml->IsLogin()){

		$login='1';//已经登陆

		}else{

		$login='2';//没有登陆

		}

$arr2 = array("login"=>$login);

echo json_encode($arr2); 