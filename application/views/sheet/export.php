<?php if (!defined('BASEPATH')) exit('No direct script access allowed');?>
        <?php foreach($list1 as $arr1=>$row1) {?>
		<table width="1500"  border="0">
		    <tr target="id" align="center">
				<td colspan="8" ><h3>报价单</h3></td>
		    </tr>
			<tr target="id">
                <td colspan="2">订单日期：<?=$row1['Create_Date']?></td>
                <td colspan="2">订单编号：<?=$row1['PK_OS_ID']?></td>
				<td colspan="2">客户：<?=$row1['Customer_Name']?></td>
<!--				<td colspan="2" align="right">业务类型: 报价</td>-->
			</tr>
		</table>	
		
		<table width="1500"  border="1">
				<tr>
					<td width="150" align="center"><b>详单编号<b></td>
					<td width="150" ><b>物品名称<b></td>
                    <td width="150" ><b>型号<b></td>
                    <td width="110" align="center"><b>销售单价<b></td>
                    <td width="60" align="center"><b>销售量<b></td>
                    <td width="60" align="center"><b>单位<b></td>
                    <td width="110" align="center"><b>销售小计<b></td>
				</tr>
			  <?php 
			  $i = 1;
			  foreach($list2 as $arr2=>$row2) {
			      if ($row1['PK_OS_ID']==$row2['OS_ID']) {
			  ?>
				<tr>
                    <td ><?=$row2['OS_De']?></td>
                    <td ><?=$row2['BOMName']?></td>
                    <td ><?=$row2['BOMModel']?></td>
                    <td ><?=str_money($row2['Sale_Price'])?></td>
                    <td ><?=(float)abs($row2['Amount'])?></td>
                    <td ><?=$row2['unitName']?></td>
                    <td ><?=str_money($row2['Sale_SubTotal'])?></td
				</tr>
				
				<?php $i++;}}?>

            <tr target="id">
                <td colspan="8" >订单总金额：<?=str_money($row1['SaleOrder_Total'])?></td>
            </tr>
		</table>	

		<table width="1500"  border="0">
            <tr target="id">
                <td colspan="8" > 订单名称：<?=$row1['orderName']?> </td>
                <td colspan="8" > 付款条件：<?=$row1['SaleOrder_Payment']?> </td>
            </tr>
            <tr target="id">
                <td>制单人：<?=$row1['Username']?></td>
                <td></td>
                <td></td>
<!--                <td>出货人签： </td>
                <td></td>
                <td>客户签字:  </td>
                <td></td>-->
            </tr>
		</table>	
 
<br><br><br>				 
				 
<?php }?>
