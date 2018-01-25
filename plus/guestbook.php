<?php
/**
 *
 * 留言板
 *
 * @version        $Id: guestbook.php 1 10:09 2010-11-10 tianya $
 * @package        DedeCMS.Site
 * @copyright      Copyright (c) 2007 - 2010, DesDev, Inc.
 * @license        http://help.dedecms.com/usersguide/license.html
 * @link           http://www.dedecms.com
 */
require_once(dirname(__FILE__).'/guestbook/guestbook.inc.php');
require_once(DEDEINC.'/datalistcp.class.php');
if(empty($action)) $action = '';
//修改留言
if($action=='admin')
{
    include_once(dirname(__FILE__).'/guestbook/edit.inc.php');
    exit();
}
//保存留言
else if($action=='save')
{   
    // var_dump($_POST);exit;
    if(!empty($_COOKIE['GUEST_BOOK_POS'])) $GUEST_BOOK_POS = $_COOKIE['GUEST_BOOK_POS'];
    else $GUEST_BOOK_POS = 'guestbook.php';
    if(empty($validate)) $validate=='';
    else $validate = strtolower($validate);
    $svali = GetCkVdValue();
    // lxw0804
    // if($validate=='' || $validate!=$svali)
    // {
    //      ShowMsg("验证码不正确!","");
    //      exit();
    // }

    // var_dump($uname);var_dump($email);var_dump($qq);var_dump($msg);exit();
    $ip = GetIP();
    $dtime = time();
    $uname = trimMsg($uname);
    $email = trimMsg($email);
    $homepage = trimMsg($homepage);
    $homepage = preg_replace("#http:\/\/#", '', $homepage);
    $qq = trimMsg($qq);
    $msg = trimMsg(cn_substrR($msg, 1024), 1);
    $tid = empty($tid) ? 0 : intval($tid);
    $reid = empty($reid) ? 0 : intval($reid);

    if($msg=='' || $uname=='') {
        // showMsg('你的姓名和留言内容不能为空!','-1');
         echo "<script>alert('你的姓名和留言内容不能为空 ！');window.history.go(-1);</script>";
        exit();
    }
    $title = HtmlReplace( cn_substrR($title,60), 1 );
    if($title=='') $title = '无标题';
    
    if($reid != 0)
    {
        $row = $dsql->GetOne("SELECT msg FROM `#@__guestbook` WHERE id='$reid' ");
        $msg = "<div class=\\'rebox\\'>".addslashes($row['msg'])."</div>\n".$msg;
    }
    $city=$_POST['city']?$_POST['city']:$_POST['area'];
    $query = "INSERT INTO `#@__guestbook`(title,tid,mid,uname,email,homepage,qq,face,msg,ip,dtime,ischeck,province,city)
                  VALUES ('$title','$tid','{$g_mid}','$uname','$email','$homepage','$qq','$img','$msg','$ip','$dtime','$needCheck','$province','$city'); ";
    $dsql->ExecuteNoneQuery($query);
    $gid = $dsql->GetLastID();
    if($needCheck==1)
    { 
        // showMsg('成功发送留言!','-1');
        echo "<script>alert('发送成功，我们会尽快联系您！');window.location.href='http://localhost/dededln/';</script>";
      //   require_once(DEDEINC."/oxwindow.class.php");
      // //   // $msg = "
      // //   // <font color='red'><b>成功发送或回复留言！</b></font> &nbsp; <a href='guestbook.php' 
      // //   // style='font-size:14px;font-weight:bold'><u>我已经知道了，点击此返回&gt;&gt;</u></a>";
      // //   // $msg="<script> alert(成功发送留言！); </script>";
      // // // $wintitle = "留言发布成功提示";
      // //   // $wecome_info = "留言发布成功：";
      //   $win = new OxWindow();
      // //   $win->Init("","js/blank.js","post");
      // //   // $win->AddTitle("提示：");
      //    echo 11;
      //   $win->AddMsgItem("<script> alert(成功发送留言！); </script>");
      //   $winform = $win->GetWindow("hand");
        // $win->Display();
    }
    else {
        // ShowMsg('成功发送一则留言，但需审核后才能显示！','guestbook.php',0,3000);
         echo "<script>alert('发送成功，我们会尽快联系您 ！');window.location.href='http://localhost/dededln/';</script>";
    }
    exit();
}
elseif($action == 'delete')  //删除 
{
    
    if(empty($do))
    {
        $id=$_POST['id'];
        if(is_array($id))
        {
            $ids = implode(',', $id);
        }else
        {
            showmsg('未选中要操作的内容', '-1');
            exit();
        }
        $query = "DELETE FROM `#@__guestbook` WHERE id IN ($ids)";
        if($dsql->ExecuteNoneQuery($query))
        {
            showmsg('删除成功', $GUEST_BOOK_POS);
        }
        else
        {
            showmsg('删除失败', $GUEST_BOOK_POS);
        }
    }

}elseif($action == 'check') //审核
{   
    $id=$_POST['id'];
    if(is_array($id))
    {   
        $ids = implode(',', $id);
    }
    else
    {   
        showmsg('未选中要操作的内容', '-1');
        exit();
    }
    $query = "UPDATE `#@__guestbook` SET ischeck=1 WHERE id IN ($ids)";
    if($dsql->ExecuteNoneQuery($query))
    {
        showmsg('审核成功', $GUEST_BOOK_POS);
    }
    else
    {
        showmsg('审核失败', $GUEST_BOOK_POS);
    }
}
else  //显示所有留言
{
    setcookie('GUEST_BOOK_POS',GetCurUrl(),time()+3600,'/');

    // if($g_isadmin) $sql = 'SELECT * FROM `#@__guestbook` ORDER BY id DESC';
    // else $sql = 'SELECT * FROM `#@__guestbook` WHERE ischeck=1 ORDER BY id DESC';
     $sql = 'SELECT * FROM `#@__guestbook`  ORDER BY id DESC';

    $dlist = new DataListCP();
    $dlist->pageSize = 10;
    $dlist->SetParameter('gotopagerank',$gotopagerank);
    $dlist->SetTemplate(DEDETEMPLATE.'/plus/guestbook.htm');
    $dlist->SetSource($sql);
    $dlist->Display();
}