<?php
/**
 *
 * 自定义表单
 *
 * @version        $Id: diy.php 1 15:38 2010年7月8日Z tianya $
 * @package        DedeCMS.Site
 * @copyright      Copyright (c) 2007 - 2010, DesDev, Inc.
 * @license        http://help.dedecms.com/usersguide/license.html
 * @link           http://www.dedecms.com
 */
require_once(dirname(__FILE__)."/../include/common.inc.php");

/***********lxw201824***********/ 
    //邮件发送函数
    function sendmail($email, $mailtitle, $mailbody)
    {
        global $cfg_sendmail_bysmtp, $cfg_smtp_server, $cfg_smtp_port, $cfg_smtp_usermail, $cfg_smtp_user, $cfg_smtp_password, $cfg_adminemail,$cfg_webname;
        if($cfg_sendmail_bysmtp == 'Y' && !empty($cfg_smtp_server))
        {
            $mailtype = 'HTML';
            require_once(DEDEINC.'/mail.class.php');
            $smtp = new smtp($cfg_smtp_server,$cfg_smtp_port,true,$cfg_smtp_usermail,$cfg_smtp_password);
            $smtp->debug = false;
            if(!$smtp->smtp_sockopen($cfg_smtp_server)){
              ShowMsg('邮件发送失败,请联系管理员','-1');
            exit();
            }
            $smtp->sendmail($email,$cfg_webname,$cfg_smtp_usermail, $mailtitle, $mailbody, $mailtype);
        }else{
            @mail($email, $mailtitle, $mailbody, $headers);
        }
    }
/************************/ 

$diyid = isset($diyid) && is_numeric($diyid) ? $diyid : 0;
$action = isset($action) && in_array($action, array('post', 'list', 'view')) ? $action : 'post';
$id = isset($id) && is_numeric($id) ? $id : 0;

if(empty($diyid))
{
    showMsg('非法操作!', 'javascript:;');
    exit();
}

require_once DEDEINC.'/diyform.cls.php';
$diy = new diyform($diyid);

/*----------------------------
function Post(){ }
---------------------------*/
if($action == 'post')
{

    // var_dump($_POST);exit();
    if(empty($do))
    {
        $postform = $diy->getForm(true);
        include DEDEROOT."/templets/plus/{$diy->postTemplate}";
        exit();
    }
    elseif($do == 2)
    {
        $dede_fields = empty($dede_fields) ? '' : trim($dede_fields);
        $dede_fieldshash = empty($dede_fieldshash) ? '' : trim($dede_fieldshash);
        if(!empty($dede_fields))
        {
            if($dede_fieldshash != md5($dede_fields.$cfg_cookie_encode))
            {
                showMsg('数据校验不对，程序返回', '-1');
                exit();
            }
        }
        $diyform = $dsql->getOne("select * from #@__diyforms where diyid='$diyid' ");
        // var_dump($diyform);

        if(!is_array($diyform))
        {
            showmsg('自定义表单不存在', '-1');
            exit();
        }

        $addvar = $addvalue = '';
        if(!empty($dede_fields))
        {

            $fieldarr = explode(';', $dede_fields);
            if(is_array($fieldarr))
            {
                foreach($fieldarr as $field)
                {
                    if($field == '') continue;
                    $fieldinfo = explode(',', $field);
                    if($fieldinfo[1] == 'textdata')
                    {
                        ${$fieldinfo[0]} = FilterSearch(stripslashes(${$fieldinfo[0]}));
                        ${$fieldinfo[0]} = addslashes(${$fieldinfo[0]});
                    }
                    else
                    {
                        ${$fieldinfo[0]} = GetFieldValue(${$fieldinfo[0]}, $fieldinfo[1],0,'add','','diy', $fieldinfo[0]);
                    }
                    $addvar .= ', `'.$fieldinfo[0].'`';
                    $addvalue .= ", '".${$fieldinfo[0]}."'";
                }
            }

        }
        // 改动lxw  20170812
        // $query = "INSERT INTO `{$diy->table}` (`id`, `ifcheck` $addvar)  VALUES (NULL, 0 $addvalue); ";
       $username=$_POST['username'];
       $tel=$_POST['tel'];
       $province=$_POST['province'];
        $city=$_POST['city'];
        $address=$_POST['address'];
        $style=implode('-', $_POST['style']);
        $otherneeds=$_POST['otherneeds'];
        $time=time();
         $query = "INSERT INTO `{$diy->table}` (`id`, `ifcheck`, `username`,`tel`,`province`,`city`,`address`,
                    `style`,`otherneeds`,`time` )  VALUES (NULL, 0 ,'$username','$tel','$province',
                     '$city','$address','$style','$otherneeds','$time'); ";
        // var_dump($query);
        // var_dump($dsql->ExecuteNoneQuery($query));exit;
        if($dsql->ExecuteNoneQuery($query))
        {
            // echo '0';exit;
            /*************lxw 20178024*********/ 
                // $email = "1844912514@qq.com";  //这里填写要发送到的邮箱
                // $mailtitle = "邮件标题";
                // $mailbody = "邮件内容";
                // sendmail($email, $mailtitle, $mailbody);
            /***********lxw2017824***********/ 
            $id = $dsql->GetLastID();
            if($diy->public == 2)
            {      
                // $goto = "diy.php?action=list&diyid={$diy->diyid}";
                // $bkmsg = '发布成功，现在转向表单列表页...';
                $goto = !empty($cfg_cmspath) ? $cfg_cmspath : '/';
                echo "<script>alert('发布成功，请等待管理员处理...');window.location.href='".$goto."';</script>";
            }
            else
            {
                // $goto = !empty($cfg_cmspath) ? $cfg_cmspath : '/';
                // $bkmsg = '发布成功，请等待管理员处理...';
                $goto = !empty($cfg_cmspath) ? $cfg_cmspath : '/';
                echo "<script>alert('发布成功，请等待管理员处理...');window.location.href='".$goto."';</script>";
            }
            // showmsg($bkmsg, $goto);
        }
    }
}
/*----------------------------
function list(){ }
---------------------------*/
else if($action == 'list')
{
    if(empty($diy->public))
    {
        showMsg('后台关闭前台浏览', 'javascript:;');
        exit();
    }
    include_once DEDEINC.'/datalistcp.class.php';
    if($diy->public == 2)
        $query = "SELECT * FROM `{$diy->table}` ORDER BY id DESC";
    else
        $query = "SELECT * FROM `{$diy->table}` WHERE ifcheck=1 ORDER BY id DESC";

    $datalist = new DataListCP();
    $datalist->pageSize = 10;
    $datalist->SetParameter('action', 'list');
    $datalist->SetParameter('diyid', $diyid);
    $datalist->SetTemplate(DEDEINC."/../templets/plus/{$diy->listTemplate}");
    $datalist->SetSource($query);
    $fieldlist = $diy->getFieldList();
    $datalist->Display();
}
else if($action == 'view')
{
    if(empty($diy->public))
    {
        showMsg('后台关闭前台浏览' , 'javascript:;');
        exit();
    }

    if(empty($id))
    {
        showMsg('非法操作！未指定id', 'javascript:;');
        exit();
    }
    if($diy->public == 2)
    {
        $query = "SELECT * FROM {$diy->table} WHERE id='$id' ";
    }
    else
    {
        $query = "SELECT * FROM {$diy->table} WHERE id='$id' AND ifcheck=1";
    }
    $row = $dsql->GetOne($query);

    if(!is_array($row))
    {
        showmsg('你访问的记录不存在或未经审核', '-1');
        exit();
    }

    $fieldlist = $diy->getFieldList();
    include DEDEROOT."/templets/plus/{$diy->viewTemplate}";
}