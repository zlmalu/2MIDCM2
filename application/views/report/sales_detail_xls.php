<?php if (!defined('BASEPATH')) exit('No direct script access allowed');?>
<table width=100% class="caption">
  			<tr><td class='H'><h3>商品销售明细表</h3></td></tr>
  			<tr><td>日期：<?=$stt?>至<?=$ett?></td></tr>
  		</table>
  		<table width="1440px" class="list" border="1">
  			<thead>
  				<tr>
					<td>销售日期</td>
					<td>销售订单编号</td>
					<td>业务类别</td>
					<td>客户</td>
					<td>商品编号</td>
					<td>商品名称</td>
					<td>规格型号</td>
					<td>单位</td>
					<td>数量</td>
					<td>单价</td>
					<td>销售收入</td>
  				</tr>
  			</thead>
  			<tbody>
  			     <?php 
				 $qty    = 0;
				 $price  = 0;
				 $amount = 0;
				 foreach($list as $arr=>$row){?>
  			       <tr class="link" data-id="<?=$row['invsaid']?>" data-type="PUR">
  			       <td><?=$row['billdate']?></td>
  			       <td><?=$row['billno']?></td>
  			       <td><?=$row['type']==1?'销货':'退货'?></td>
  			       <td><?=$row['contactname']?></td>
  			       <td><?=$row['number']?></td>
  			       <td><?=$row['goodsname']?></td>
  			       <td><?=$row['spec']?></td>
  			       <td><?=$row['unitname']?></td>
  			       <td class="R"><?=str_money($row['qty'])?></td>
  			       <td class="R"><?=str_money($row['price'])?></td>
  			       <td class="R"><?=str_money($row['amount'])?></td>
  			       </tr>
  			     <?php 
				 $qty    += $row['qty'];
				 $price  += $row['price'];
				 $amount += $row['amount'];
				 }?>
  				<tr>
  				<td colspan="8" class="R B">合计：</td>
  				<td class="R B"><?=str_money($qty)?></td>
  				<td class="R B"><?=$qty>0?str_money($amount/$qty):0?></td>
  				<td class="R B"><?=str_money($amount)?></td>
  				</tr>
  			</tbody>
  		</table>