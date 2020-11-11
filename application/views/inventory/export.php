<?php if (!defined('BASEPATH')) exit('No direct script access allowed');?>
		<table class="table" width="1500"  border="1">
			<thead>
			    <tr>
				    <th colspan="6" align="center"><h3>盘点表</h3></th>
				</tr>
				
				<tr>
					<th width="150" align="center">物料编号</th>
                    <th width="300" align="center">物料名称</th>
                    <th width="300" align="center">型号</th>
                    <th width="200" align="center">仓库</th>
					<th width="150" align="center">最低库存量</th>
					<th width="150" align="center">系统库存</th>
				</tr>
			</thead>
			<tbody>
			  <?php foreach($list as $arr=>$row) {?>
				<tr target="id">
				    <td align="center"><?=$row['BOM_ID']?></td>
					<td align="center"><?=$row['BOMName']?></td>
					<td align="center"><?=$row['BOMModel']?></td>
                    <td align="center"><?=$row['Stock_Name']?></td>
                    <td align="center"><?=$row['MInAmount']?></td>
					<td align="center"><?=$row['Amount']?></td>
				</tr>
				<?php }?>
 
 </tbody>
</table>	
