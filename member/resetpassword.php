<?php
/**
 * 密码重设
 * 
 * @version        $Id: resetpassword.php 1 8:38 2010年7月9日Z tianya $
 * @package        DedeCMS.Member
 * @copyright      Copyright (c) 2007 - 2010, DesDev, Inc.
 * @license        http://help.dedecms.com/usersguide/license.html
 * @link           http://www.dedecms.com
 */
require_once(dirname(__FILE__)."/config.php");
require_once(DEDEMEMBER."/inc/inc_pwd_functions.php");
// if(empty($dopost)) $dopost = "";
// $id = isset($id)? intval($id) : 0;

if(empty($dopost))
{
    // include(dirname(__FILE__)."/templets/resetpassword.htm");
    include(dirname(__FILE__)."/templets/article_forgetpsw.htm");
}
elseif($dopost == "getpwd")
{   
    // var_dump($_POST);exit();

    //验证验证码
    // if(!isset($vdcode)) $vdcode = '';

    // $svali = GetCkVdValue();
    // if(strtolower($vdcode) != $svali || $svali=='')
    // {
    //     ResetVdValue();
    //     ShowMsg("对不起，验证码输入错误！","-1");
    //     exit();
    // }

    //验证邮箱，用户名
    if(empty($mail) || empty($telephone))
    {
        // showmsg('对不起，请输入账号或邮箱', '-1');
        echo "<script>alert('对不起，请输入账号或邮箱 !');window.history.go(-1);</script>";
        exit;
    } else if (!preg_match("#(.*)@(.*)\.(.*)#", $mail))
    {
        // showmsg('对不起，请输入正确的邮箱格式', '-1');
        echo "<script>alert('对不起，请输入正确的邮箱格式 !');window.history.go(-1);</script>";
        exit;
    } else if (!preg_match("/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/", $telephone))
    {
        // ShowMsg("你输入的用户名 {$userid} 不合法！","-1");
        echo "<script>alert('对不起，请输入正确的手机号格式 !');window.history.go(-1);</script>";
        exit();
    }
    $member = member($mail, $telephone);
    //以邮件方式取回密码；
    if($type == 1)
    {
        //判断系统邮件服务是否开启
        if($cfg_sendmail_bysmtp == "Y")
        {
            sn($member['mid'],$telephone,$member['email']);
             // newmail($member['mid'],$telephone,$member['email'],'INSERT',$send = 'Y');
        }
        else
        {
             echo "<script>alert('对不起邮件服务暂未开启，请联系管理员 !');window.location.href='login.php';</script>";
            exit();
        }

        
    } 
    //以安全问题取回密码；
    // else if ($type == 2)
    // {
    //     if($member['safequestion'] == 0)
    //     {
    //         showmsg('对不起您尚未设置安全密码，请通过邮件方式重设密码', 'login.php');
    //         exit;
    //     }
    //     require_once(dirname(__FILE__)."/templets/resetpassword3.htm");
    // }
    exit();
}
// else if($dopost == "safequestion")
// {
//     $mid = preg_replace("#[^0-9]#", "", $id);
//     $sql = "SELECT safequestion,safeanswer,userid,email FROM #@__member WHERE mid = '$mid'";
//     $row = $db->GetOne($sql);
//     if(empty($safequestion)) $safequestion = '';

//     if(empty($safeanswer)) $safeanswer = '';

//     if($row['safequestion'] == $safequestion && $row['safeanswer'] == $safeanswer)
//     {
//         sn($mid, $row['userid'], $row['email'], 'N');
//         exit();
//     }
//     else
//     {
//         ShowMsg("对不起，您的安全问题或答案回答错误","-1");
//         exit();
//     }

// }

    //修改密码
else if($dopost == "getpasswd")
{   
    
    if(empty($setp))
    {
        // $tptim= (60*60*24*3);
        // $dtime = time();
        // if($dtime - $tptim > $row['mailtime'])
        // {
        //     $db->executenonequery("DELETE FROM `#@__pwd_tmp` WHERE `md` = '$id';");
        //     ShowMsg("对不起，临时密码修改期限已过期","login.php");
        //     exit();
        // }
        // require_once(dirname(__FILE__)."/templets/resetpassword2.htm");
         require_once(dirname(__FILE__)."/templets/article_chgpsw.htm");
    }
    elseif($setp == 2)
    {


        // var_dump($telephone);exit();
        // echo "44";exit;
        // if(empty($id))
        // {
        //     ShowMsg("对不起，请不要非法提交","login.php");
        //     exit();
        // }
        // $mid = preg_replace("#[^0-9]#", "", $id);
        $row = $db->GetOne("SELECT * FROM #@__member WHERE telephone = '$telephone'");
        // var_dump($row);exit;
        if(empty($row['telephone']))
        {
         echo "<script>alert('对不起，您输入的账号不存在 !');window.history.go(-1);</script>";
        }


        // var_dump($_POST);exit;
        // if(isset($key)) $pwdtmp = $key;
        // $sn = md5(trim($pwdtmp));
        // if($row['pwd'] == $sn)
        // {
            if($pwd != "")
            {
                if($pwd == $pwdok)
                {
                    $pwdok = md5($pwdok);
                    // $sql = "DELETE FROM `#@__pwd_tmp` WHERE `mid` = '$id';";
                    // $db->executenonequery($sql);
                    $sql = "UPDATE `#@__member` SET `pwd` = '$pwdok' WHERE `telephone` = '$telephone';";
                    if($db->executenonequery($sql))
                    {
                    echo "<script>alert('更改密码成功，请牢记新密码 !');window.location.href='login.php';</script>";
                    }
                }
            }
            echo "<script>alert('对不起，新密码为空或填写不一致 !');window.history.go(-1);</script>";
        // }
        // showmsg('对不起，临时密码错误', '-1');
        // exit;
    }
}