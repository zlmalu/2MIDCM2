<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Inventory extends CI_Controller {

    public function __construct(){
        parent::__construct();
		$this->purview_model->checkpurview(11);
		$this->load->model('data_model');
		$this->uid  = $this->session->userdata('uid');
		$this->name = $this->session->userdata('name');
        $this->path = $this->config->item('cache_path');
        $this->load->driver('cache', array('adapter' => 'file'));
    }
	
	public function index(){
		$this->load->view('inventory/index');
	}
	public function change(){
		if($this->input->get_post('BOM_ID',TRUE)){
			$BOM_ID=$this->input->get_post('BOM_ID',TRUE);
			$stock_id1=$this->input->get_post('stock_id1',TRUE);
			$stock_id2=$this->input->get_post('stock_id2',TRUE);
			$stock1=$this->input->get_post('stock1',TRUE);
			$stock2=$this->input->get_post('stock2',TRUE);
			$Amount=$this->input->get_post('nubmer',TRUE);
			$Amount1 = $this->mysql_model->db_select(BOM_STOCK,'(Stock_ID='.$stock_id1.' and BOM_ID='.$BOM_ID.')','Amount');
			$Cost = $this->mysql_model->db_select(BOM_STOCK,'(Stock_ID='.$stock_id1.' and BOM_ID='.$BOM_ID.')','Cost');
			$Name = $this->mysql_model->db_select(BOM_BASE,'(PK_BOM_ID='.$BOM_ID.')','Name');
			$Amount2 = $this->mysql_model->db_select(BOM_STOCK,'(Stock_ID='.$stock_id2.' and BOM_ID='.$BOM_ID.')','Amount');
if($Amount1)
$endAmount1 = $Amount1[0]-$Amount;
else

die('{"status":400,"msg":"'.$stock1.'中没有该物品！"}');
if($endAmount1<0) die('{"status":-1,"msg":"库存不足"}');
			 $this->db->trans_begin();
$sql1 = 'update t_'.BOM_STOCK.' set Amount='.$endAmount1.' where BOM_ID='.$BOM_ID.' and Stock_ID='.$stock_id1;
if($Amount2){
$endAmount2 = $Amount2[0]+$Amount;
$sql2 = 'update t_'.BOM_STOCK.' set Amount='.$endAmount2.' where BOM_ID='.$BOM_ID.' and Stock_ID='.$stock_id2;
                       $this->db->query($sql1);
                       $this->db->query($sql2);
}else{
	$sql3 = 'insert into t_'.BOM_STOCK.' (Stock_ID,BOM_ID,Amount,Cost) values ('.$stock_id2.','.$BOM_ID.','.$Amount.','.$Cost[0].')';
                       $this->db->query($sql1);
                       $this->db->query($sql3);
}
$info1['PK_BOM_SO_ID']      = str_no('SO');
            $info1['Type']        = 6;//调仓
            $info1['Status']    = 9;
            $info1['Review_ID'] = $this->uid;
            $info1['Creator_ID'] = $this->uid;
            $info1['Stock_ID'] = $stock_id2;
$info2['PK_BOM_SO_ID']      = str_no('SO');
            $info2['Type']        = 7;//调仓
            $info2['Status']    = 9;
            $info2['Review_ID'] = $this->uid;
            $info2['Creator_ID'] = $this->uid;
            $info2['Stock_ID'] = $stock_id1;

			$v1 = array();
                        $v1['PK_OSt_ID']       = $info1['PK_BOM_SO_ID'];
                        $v1['Ost_De']        = str_pad(1,5,"0",STR_PAD_LEFT);
                        $v1['BOM_ID']          = $BOM_ID;
                        $v1['Amount']      = $Amount;
                        $v1['Cost']      = $Cost[0];
			$v2 = array();
                        $v2['PK_OSt_ID']       = $info2['PK_BOM_SO_ID'];
                        $v2['Ost_De']        = str_pad(1,5,"0",STR_PAD_LEFT);
                        $v2['BOM_ID']          = $BOM_ID;
                        $v2['Amount']      = $Amount;
                        $v2['Cost']      = $Cost[0];
                        //$v1[0]['SO_SubTotal']      = (float)$row->Cost * (float)abs($row->change);//库存差*成本
 $this->mysql_model->db_inst(BOM_STOCK_ORDER,$info1);
 $this->mysql_model->db_inst(BOM_STOCK_ORDER,$info2);
                $this->mysql_model->db_inst(STOORDER_DETAIL,$v1);
                $this->mysql_model->db_inst(STOORDER_DETAIL,$v2);
			 if ($this->db->trans_status() === FALSE) {
				$this->db->trans_rollback();
				die('{"status":400,"msg":"盘点失败！"}');
			 } else {
				$this->db->trans_commit();
				$this->cache_model->delsome(BOM_STOCK);
				$this->cache_model->delsome(BOM_STOCK_ORDER);
				$this->cache_model->delsome(STOORDER_DETAIL);
				$msg = "($Name[0])$stock1-->$stock2:$Amount";
				$this->data_model->logs($msg);
				die('{"status":200,"msg":"'.$msg.'"}');
			 }
		}else
		$this->load->view('inventory/index2');
	}
	
	public function query() {
		$id  = intval($this->input->get_post('invId',TRUE));
	    $v   = '';
		$order = ' order by a.BOM_ID desc';
		$where = ' and a.BOM_ID='.$id;
	    $data['status'] = 200;
		$data['msg']    = 'success'; 
		$data['data']['page']        = 1;
		$data['data']['records']     = 1;                                                       
		$data['data']['total']       = 1;                                                       
		$list = $this->data_model->inventory($where,$order);  
		foreach ($list as $arr=>$row) {
		    $v[$arr]['invId']         = intval($row['BOM_ID']);
			$v[$arr]['stockId']    = 0;
			$v[$arr]['qty']           = $row['Amount'];
			$v[$arr]['stockName']  = $row['Stock_Name'];
		}
		$data['data']['rows']         = is_array($v) ? $v : '';
		die(json_encode($data)); 
	}


    /**
     * showdoc
     * @catalog 开发文档/仓库
     * @title 库存查询
     * @description 库存查询的接口
     * @method get
     * @url https://www.2midcm.com/inventory/lists
     * @param contactno 必选 string 供应商编号
     * @param contactid 可选 int 供应商ID
     * @param contactname 可选 string 供应商名称
     * @param billno 必选 string 单据编号
     * @param billdate 必选 int 单据日期
     * @param type 可选 int 1其他入库 2盘盈 3其他出库 4盘亏
     * @return "{"status":200,"msg":"success","data":{"categoryId":1,"goods":"true","showZero":"true"}}
     * @remark 这里是备注信息
     * @number 3
     */
	public function lists() {
	    $goods = str_enhtml($this->input->get_post('goods',TRUE));

	    $qty   =intval($this->input->get_post('showZero',TRUE));
		$page        = max(intval($this->input->get_post('page',TRUE)),1);
		$rows        = max(intval($this->input->get_post('rows',TRUE)),100);
	    $v = '';
		$where = '';
		$order = 'order by a.Stock_ID desc';
	    $data['status'] = 200;
		$data['msg']    = 'success';
		if($goods){
		    $where.=' and c.Name like "%'.$goods.'%"';
        }
        if($qty){
		    $where .= ' and a.Amount = 0';
        }
		$offset = $rows * ($page-1);
		$data['data']['page']        = $page;
		$data['data']['records']     = 1000;                                                       //总条数
		$data['data']['total']       = ceil($data['data']['records']/$rows);                       //总分页数
		$list = $this->data_model->inventory($where,$order);  
		foreach ($list as $arr=>$row) {
			$v[$arr]['Account']    = number_format($row['Amount'],2);
			$v[$arr]['Stock_Name'] = $row['Stock_Name'];
			$v[$arr]['Cost']      = (float)($row['Cost']);
			$v[$arr]['BOM_ID']    = $row['BOM_ID'];
			$v[$arr]['Stock_ID']    = $row['Stock_ID'];
            $v[$arr]['MInAccount'] = $row['MInAmount'];
            $v[$arr]['BOMName']      = ($row['BOMName']);
            $v[$arr]['BOMModel']    = $row['BOMModel'];
		}
		$data['data']['rows']        = is_array($v) ? $v : '';
		die(json_encode($data));
	}

    /**
     * showdoc
     * @catalog 开发文档/仓库
     * @title 盘点单据生成
     * @description 盘点生成单据的接口
     * @method get
     * @url https://www.2midcm.com/inventory/generator
     * @param postData 可选 array 盘点数据
     * @return "{"status":200,"msg":"success","data":{"type":1,"typename":"盘盈","billtype":"1"}}
     * @remark 这里是备注信息
     * @number 3
     */
	public function generator() {
	    $this->purview_model->checkpurview(12);
	    $cacheData = $this->cache->get('inventory.dataLock');
	    if($cacheData['lock'] != 1){
            die('{"status":400,"msg":"请先点击开始盘点！"}');
        }
		$data = $this->input->post('postData',TRUE);
		if (strlen($data)>0) {
		     $data = (array)json_decode($data);
$stockidArr;
                foreach ($data['entries'] as $arr=>$row) {
			$stockidArr[$arr] = $row->Stock_ID;			
		}
			 $msg = '';
		foreach (array_values(array_unique($stockidArr)) as $arr=>$row){
			 $v1 = array();
			 $v2 = array();
			 $this->db->trans_begin();
			 $updateArr = array();
			 //盘盈一个单
            $info1['PK_BOM_SO_ID']      = str_no('SO');
            $info1['Type']        = 4;//盘盈
            $info1['Status']    = 9;
            $info1['Review_ID'] = $this->uid;
            $info1['Creator_ID'] = $this->uid;
	    $info1['Stock_ID'] = $row;
            //盘亏一个单
            $info2['PK_BOM_SO_ID']      = str_no('SO');
            $info2['Type']        = 5;//盘盈
            $info2['Status']    = 9;
            $info2['Review_ID'] = $this->uid;
            $info2['Creator_ID'] = $this->uid;
	    $info2['Stock_ID'] = $row;
	

            $a=0; $b = 0;
            if (is_array($data['entries'])) {
                foreach ($data['entries'] as $arr=>$row) {
                    if ($row->checkInventory<0) {
                        die('{"status":400,"msg":"盘点库存要为数字，请输入有效数字！"}');
                    }

                    if((float)$row->checkInventory >= 0 && $row->checkInventory!=""){
                        $BOM_ID = intval($row->BOM_ID);
                        $Cost = $row->Cost;
                        $Amount = (float)$row->checkInventory;
                        $Stock_ID =  intval($row->Stock_ID);
$sql = 'update t_'.BOM_STOCK.' set Amount='.$Amount.',Cost='.$Cost.' where BOM_ID='.$BOM_ID.' and Stock_ID='.$Stock_ID;
$sql1 = 'update t_'.BOM_STOCK.' set Cost='.$Cost.' where BOM_ID='.$BOM_ID.' and Stock_ID='.$Stock_ID;
                       $this->db->query($sql);
                       $this->db->query($sql1);
                    }
                    if ($row->change > 0 and $row->Stock_ID==$info1['Stock_ID']) { //盘盈
                        $v1[$a]['PK_OSt_ID']       = $info1['PK_BOM_SO_ID'];
                        $v1[$a]['Ost_De']        = str_pad($a+1,5,"0",STR_PAD_LEFT);;
                        $v1[$a]['BOM_ID']          = intval($row->BOM_ID);
                        $v1[$a]['Cost']      = (float)$row->Cost;
                        $v1[$a]['SO_SubTotal']      = (float)$row->Cost * (float)abs($row->change);//库存差*成本
                        $v1[$a]['Amount'] = (float)abs($row->change);//盘点的库存差
                        $a++;
                    }
                    if ($row->change < 0 and $row->Stock_ID==$info2['Stock_ID']) { //盘亏
                        $v2[$b]['PK_Ost_ID']       = $info2['PK_BOM_SO_ID'];
                        $v2[$b]['Ost_De']        = str_pad($b+1,5,"0",STR_PAD_LEFT);
                        $v2[$b]['BOM_ID']          = $row->BOM_ID;
                        $v2[$b]['Cost']      = (float)$row->Cost;
                        $v2[$b]['SO_SubTotal']      = (float)$row->Cost * (float)abs($row->change);
                        $v2[$b]['Amount'] = (float)abs($row->change);
                        $b++;
                    }
                }
            }
            if(count($v1) > 0){
                $this->mysql_model->db_inst(BOM_STOCK_ORDER,$info1);
                $this->mysql_model->db_inst(STOORDER_DETAIL,$v1);
            }
            if(count($v2) > 0){
                $this->mysql_model->db_inst(BOM_STOCK_ORDER,$info2);
                $this->mysql_model->db_inst(STOORDER_DETAIL,$v2);
            }

			 if ($this->db->trans_status() === FALSE) {
				$this->db->trans_rollback();
				die('{"status":400,"msg":"盘点失败！"}');
			 } else {
				$this->db->trans_commit();
				$this->cache_model->delsome(BOM_STOCK);
				$this->cache_model->delsome(BOM_STOCK_ORDER);
				$this->cache_model->delsome(STOORDER_DETAIL);
				if (count($v1) > 0) {
				   $msg .= '生成盘盈单号：'.$info1['PK_BOM_SO_ID'].' ';
				}
				if (count($v2) > 0) {
                    $msg .= '生成盘亏单号：'.$info1['PK_BOM_SO_ID'].' ';
				}
				if(count($v1)==0&&count($v2)==0){
				   $msg = '修改成本成功';
			 }
		}

}
				$this->data_model->logs($msg);
				$this->inventoryUnLock();
				die('{"status":200,"msg":"'.$msg.'"}');
	}
		die('{"status":400,"msg":"请先进行盘点！"}');
	}

    /**
     * showdoc
     * @catalog 开发文档/仓库
     * @title 库存导出
     * @description 库存导出的接口
     * @method get
     * @url https://www.2midcm.com/inventory/export
     * @param contactno 必选 string 供应商编号
     * @param contactid 可选 int 供应商ID
     * @param contactname 可选 string 供应商名称
     * @param billno 必选 string 单据编号
     * @param billdate 必选 int 单据日期
     * @param type 可选 int 1其他入库 2盘盈 3其他出库 4盘亏
     * @return "{"status":200,"msg":"success","data":{"categoryId":1,"goods":"true","showZero":"true"}}
     * @remark 这里是备注信息
     * @number 3
     */
	public function export() {
	    $this->purview_model->checkpurview(13);
	    sys_xls(rawurlencode(date('Y-m-d',time()).'盘点表.xls'));
		$goods = str_enhtml($this->input->get_post('goods',TRUE));
		$qty = intval($this->input->get_post('showZero',TRUE));
		$where = '';
		$order = 'order by a.Stock_ID desc';

		if ($qty>0) {
            $where .= ' and a.Account = 0';
		}
		if ($goods)  $where .= ' and c.BOMName like "%'.$goods.'%"';
        $this->data_model->logs('导出盘点记录');
		$data['list'] = $this->data_model->inventory($where,$order);
		$this->load->view('inventory/export',$data);
	}

    //盘点时的锁
    public function inventoryLock(){
        $data['lock'] = 1;
        $a=$this->cache->save('inventory.dataLock',$data,86400);
    }

    //盘点完解锁
    public function inventoryUnLock(){        
	$this->cache->delete('inventory.dataLock');
    }

}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */
