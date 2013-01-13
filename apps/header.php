<?php
    
    function sbHeader($message=NULL, $links=NULL, $size = NULL) {
?>
<link href="../header.css" rel="stylesheet"  type="text/css"/>

<div id="header"<?
    if ($size != NULL) {
        echo
        "style=\"font-size:".$size."px;".
        "position:relative;".
        "left:0px;".
        "margin:0px;".
        "padding:0px;".
        "background-color:rgba(0, 0, 0, 0);\"";
    }
?>>
<a href="http://stevebob.net"<?


?>>back</a> |<?

    if ($links != NULL) {
        foreach($links as $name => $addr) {
            ?>
            
            <a href="<? echo $addr ?>"><? echo $name ?></a> |<?
        }
    }

?> stevebob.net...<? if ($message != NULL) echo $message; ?>
</div>
<?
    }

?>
