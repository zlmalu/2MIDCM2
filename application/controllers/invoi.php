<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Invoi extends CI_Controller {

    public function __construct(){
        parent::__construct();
        $this->purview_model->checkpurview();
        $this->load->model('data_model');
        $this->uid   = $this->session->userdata('uid');
        $this->name = $this->session->userdata('name');
    }

    public function index(){
        $this->purview_model->checkpurview(14);
        $this->load->view('invoi/index');
    }

    public function outindex(){
        $this->purview_model->checkpurview(18);
        $this->load->view('invoi/outindex');
    }

    /**
     * showdoc
     * @catalog 开发文档/仓库
     * @title 入库
     * @description 入库的接口
     * @method get
     * @url https://www.2midcm.com/invoi/in
     * @param contactno 必选 string 供应商编号
     * @param contactid 可选 int 供应商ID
     * @param contactname 可选 string 供应商名称
     * @param billno 必选 string 单据编号
     * @param billdate 必选 int 单据日期
     * @return {"status":200,"msg":"success","data":{"id":'.intval($invoiid).'}}
     * @return_param status int 1：'200'入库成功;2："-1"入库失败
     * @remark 这里是备注信息
     * @number 3
     */
    public function in(){
        $this->purview_model->checkpurview(15);
        $data = $this->input->post('postData',TRUE);
        if (strlen($data)>0) {
            $data = (array)json_decode($data);//var_dump($data);exit;
            /*
             * 其他入库为其他入库，是工厂生成产品入库，此时应是不用选供应商的,又或者选择车间入库生产品？
             *
             *
             */
            /*(!isset($data['buId']) || $data['buId']<1) && die('{"status":-1,"msg":"请选择购货单位"}');
                         $contact = $this->mysql_model->db_one(CONTACT,'(id='.intval($data['buId']).')');
                         count($contact)<1 && die('{"status":-1,"msg":"请选择购货单位"}');
                        if(isset($data['buId']) && intval($data['buId']) > 0){
                            $contact = $this->mysql_model->db_one(CONTACT,'(id='.intval($data['buId']).')');
                        }*/
            $info['PK_BOM_SO_ID']      = str_no('SO');
            $info['Creator_ID']    = $this->uid;
            $info['Type']    = 0;
            $info['Status']    = 9;
            $info['Stock_ID']    = $data['Stock_ID'];
            $this->db->trans_begin();

            $v = array();
            if (is_array($data['entries'])) {
                $values = array();
                $bomArr = array();
                foreach ($data['entries'] as $arr=>$row) {
                    $v[$arr]['PK_OSt_ID']  = $info['PK_BOM_SO_ID'];
                    $v[$arr]['OSt_De']        = str_pad($arr+1,5,"0",STR_PAD_LEFT);
                    $v[$arr]['BOM_ID']     = $row->invId;
                    $v[$arr]['Amount']   = (float)$row->qty;
                    $v[$arr]['SO_SubTotal']   = (float)$row->price * (float)$row->qty;
                    $v[$arr]['Cost']   = ($row->price!=null)?$row->price:0;
//                    $v[$arr]['Creator_ID']    = $this->uid;
                    //处理入库数据
                    if(!isset($values[$row->invId])) {
                        $bomArr[] = $row->invId;
                        $values[$row->invId]['BOM_ID'] = $row->invId;
                        $values[$row->invId]['Amount'] = (float)$row->qty;
                        $values[$row->invId]['Cost'] = (float)$row->price;
                    }else{
                        $values[$row->invId]['Amount'] += (float)$row->qty;
                    }
                }

                $cacheData = $this->cache->get('inventory.dataLock');
                if($cacheData['lock'] == 1){//处于盘点状态
                    die('{"status":400,"msg":"正在盘点,盘点完后再进行入库操作...."}');
                    /*$cacheData['data']['in'][] = array('orderId' => $info['SO_ID'], 'value' => $values);//盘点状态时，先将入库数据存入缓存
                    if(!$this->cache->save('inventory.dataLock',$cacheData,86400)){
                        die('{"status":-1,"msg":"success","入库失败');
                    }
                    $info['Status']    = 5;       //盘点状态时订单状态置为签订
                    $this->mysql_model->db_inst(BOM_STOCK_ORDER,$info);
                    $this->mysql_model->db_inst(STOORDER_DETAIL,$v);
                    if ($this->db->trans_status() === FALSE) {
                        $this->db->trans_rollback();
                        die();
                    } else {
                        $this->db->trans_commit();
                        $this->cache_model->delsome(BOM_STOCK_ORDER);
                        $this->cache_model->delsome(STOORDER_DETAIL);
                        $this->cache_model->delsome(BOM_STOCK);
                        $this->data_model->logs('新增其他入库 单据编号：'.$info['PK_BOM_SO_ID']);;
                    }*/
                }else{           //不处于盘点状态
                    $bomStr = implode(',',$bomArr);
                    $sql = 'select BOM_ID, Amount, Cost from t_'.BOM_STOCK .' where Stock_ID='.$data['Stock_ID'].' and BOM_ID in (' . $bomStr .')';

                    $list = $this->mysql_model->db_sql($sql,2);//现有库存
		    if($list){
                    $updateArr = array();
/*print_r($list);
print_r($v);
print_r($values);
*/                    foreach ($list as $arr=>$val){
			$endAmount=$val['Amount']+$v[$arr]['Amount'];
			$Cost=($val['Amount']*$val['Cost']+$v[$arr]['SO_SubTotal'])/$endAmount;
			$sql1 = 'update t_'.BOM_STOCK.' set Amount='.$endAmount.',Cost='.$Cost.' where Stock_ID='.$data['Stock_ID'].' and BOM_ID='.$val['BOM_ID'].'';		
			$this->db->query($sql1);
                    }
}else{
			foreach($v as $arr=>$val){
			$sql1 = 'insert into t_'.BOM_STOCK.' (Amount,Cost,BOM_ID,Stock_ID) values('.$val['Amount'].','.$val['Cost'].','.$val['BOM_ID'].','.$data['Stock_ID'].')';		
			$this->db->query($sql1);
}
	
}
            $this->mysql_model->db_inst(BOM_STOCK_ORDER,$info);
            $this->mysql_model->db_inst(STOORDER_DETAIL,$v);
            if ($this->db->trans_status() === FALSE) {
                $this->db->trans_rollback();
                die();
            } else {
                $this->db->trans_commit();
                $this->cache_model->delsome(BOM_STOCK_ORDER);
                $this->cache_model->delsome(STOORDER_DETAIL);
                $this->cache_model->delsome(BOM_STOCK);
                $this->data_model->logs('新增其他入库 单据编号：'.$info['PK_BOM_SO_ID']);
                die('{"status":200,"msg":"保存成功"}');
            }
    }    }
} else {
            $data['billno'] = str_no('SO');
            $data['storehouse'] = $this->data_model->stockList('','');
            $this->load->view('invoi/in',$data);
        }
    }







    /**
     * showdoc
     * @catalog 开发文档/仓库
     * @title 入库修改
     * @description 入库修改的接口
     * @method get
     * @url https://www.2midcm.com/invoi/inedit
     * @param contactno 必选 string 供应商编号
     * @param contactid 可选 int 供应商ID
     * @param contactname 可选 string 供应商名称
     * @param billno 必选 string 单据编号
     * @param billdate 必选 int 单据日期
     * @return {"status":200,"msg":"success","data":{"id":'.$id.'}}
     * @return_param status int 1：'200'入库成功;2："-1"入库失败
     * @remark 这里是备注信息
     * @number 3
     */
    //作废
    public function inedit() {
        //$this->purview_model->checkpurview(16);
        $id   = $this->input->get('id',TRUE);
        $data = '';//$this->input->post('postData',TRUE);
        if (strlen($data)>0) {
            $data = (array)json_decode($data);
            !isset($data['id']) && die('{"status":-1,"msg":"参数错误"}');
            $id                  = intval($data['id']);
            $info['billno']      = $data['billNo'];
            $info['billtype']    = 1;
            $info['type']        = intval($data['transTypeId']);
            $info['typename']    = $data['transTypeName'];
            $info['contactid']   = intval($data['buId']);
            $info['description'] = $data['description'];
            $info['totalamount'] = (float)$data['totalAmount'];
            $info['totalqty']    = (float)$data['totalQty'];
            $info['uid']         = $this->uid;
            $info['username']    = $this->name;
            $info['billdate']    = date('Y-m-d H:i:s',time());
            $v = array();
            $this->db->trans_begin();
            $this->mysql_model->db_upd(BOM_STOCK,$info,'(id='.$id.')');
            $this->mysql_model->db_del(INVOI_INFO,'(invoiid='.$id.')');
            if (is_array($data['entries'])) {
                foreach ($data['entries'] as $arr=>$row) {
                    $v[$arr]['invoiid']       = $id;
                    $v[$arr]['billno']        = $info['billno'];
                    $v[$arr]['type']          = $info['type'];
                    $v[$arr]['billtype']      = $info['billtype'];
                    $v[$arr]['typename']      = $info['typename'];
                    $v[$arr]['contactid']     = $info['contactid'];
                    $v[$arr]['contactname']   = $info['contactname'];
                    $v[$arr]['goodsid']       = $row->invId;
                    $v[$arr]['qty']           = (float)$row->qty;
                    $v[$arr]['amount']        = (float)$row->amount;
                    $v[$arr]['price']         = (float)$row->price;
                    $v[$arr]['description']   = $row->description;
                    $v[$arr]['goodsno']       = $row->invNumber;
                    $v[$arr]['billdate']      = $data['date'];
                }
            }
            $this->mysql_model->db_inst(INVOI_INFO,$v);
            if ($this->db->trans_status() === FALSE) {
                $this->db->trans_rollback();
                die();
            } else {
                $this->db->trans_commit();
                $this->cache_model->delsome(BOM_BASE);
                $this->cache_model->delsome(BOM_STOCK);
                $this->cache_model->delsome(INVOI_INFO);
                $this->data_model->logs('修改其他入库 单据编号：'.$info['billno']);
                die('{"status":200,"msg":"success","data":{"id":'.$id.'}}');
            }
        } else {
            $data = $this->mysql_model->db_select(STOORDER_DETAIL,'(PK_OSt_ID="'.$id.'")');
            if (count($data)>0) {
                $this->load->view('invoi/inedit',$data);
            } else {
                $data['billno'] = str_no('SO');
                $this->load->view('invoi/in',$data);
            }
        }
    }


    /**
     * showdoc
     * @catalog 开发文档/仓库
     * @title 出库
     * @description 出库的接口
     * @method get
     * @url https://www.2midcm.com/invoi/out
     * @param contactno 必选 string 客户编号
     * @param contactid 可选 int 客户ID
     * @param contactname 可选 string 客户名称
     * @param billno 必选 string 单据编号
     * @param billdate 必选 int 单据日期
     * @return {"status":200,"msg":"success","data":{"id":'.$id.'}}
     * @return_param status int 1：'200'出库成功;2："-1"出库失败
     * @remark 这里是备注信息
     * @number 3
     */
    public function out()
    {
        $this->purview_model->checkpurview(19);
        $data = $this->input->post('postData', TRUE);
        if (strlen($data) > 0) {
            $cacheData = $this->cache->get('inventory.dataLock');
            if ($cacheData['lock'] == 1) {//处于盘点状态
                die('{"status":-1,"msg":"库存盘点中，请盘点完成后再进行出库操作..."}');//若是很多人都在盘点的时候执行出库，库存数据得不到及时更新，最后处理缓存数据的时候很可能出库数>库存数，导致谁都出库不了
            }
            $data = (array)json_decode($data);
	    $Stock_ID = $data['Stock_ID'];
            $info['Type'] = 2;
            $info['PK_BOM_SO_ID'] = $data['billNo'];
            $info['Creator_ID'] = $this->uid;
            $info['Status'] = 9;
            $info['Stock_ID']    = $data['Stock_ID'];
            $this->db->trans_begin();
            $this->mysql_model->db_inst(BOM_STOCK_ORDER, $info);
            $v = array();
            if (is_array($data['entries'])) {
                $values = array();
                foreach ($data['entries'] as $arr => $row) {
                    $v[$arr]['PK_OSt_ID'] = $info['PK_BOM_SO_ID'];
                    $v[$arr]['Ost_De'] = str_pad($arr+1,5,"0",STR_PAD_LEFT);
                    $v[$arr]['Amount'] = (float)($row->qty);
                    $v[$arr]['BOM_ID'] = $row->invId;
                    $v[$arr]['Cost'] = (float)$row->price;
                    $v[$arr]['SO_SubTotal'] = (float)($row->qty) * (float)$row->price;
//                    $v[$arr]['Creator_ID'] = $info['Creator_ID'];

                    //处理出库数据
                    if (!isset($values[$row->invId])) {
                        $bomArr[] = $row->invId;
                        $values[$row->invId]['BOM_ID'] = $row->invId;
                        $values[$row->invId]['Amount'] = (float)$row->qty;
                        $values[$row->invId]['BOMName'] = $row->invName;
                    } else {
                        $values[$row->invId]['Amount'] += (float)$row->qty;
                        $values[$row->invId]['BOMName'] = $row->invName;
                    }
                }
                $bomStr = implode(',', $bomArr);
                $sql = 'SELECT BOM_ID, Amount FROM  t_' . BOM_STOCK . ' WHERE BOM_ID IN (' . $bomStr . ') and Stock_ID='.$Stock_ID.'';
                $list = $this->mysql_model->db_sql($sql, 2);
//                var_dump($list);
                 $updateArr = array();
//                $Id = array();
if(!$list)
                            die('{"status":-1,"msg":"该仓库中没有此物品"}');
                foreach ($list as $val) {
                    if (isset($values[$val['BOM_ID']])) {
                        if($values[$val['BOM_ID']]['Amount'] > $val['Amount']){  //如果出库数量大于库存，则出库失败
                            $this->db->trans_rollback();
                            die('{"status":-1,"msg":"'. $values[$val['BOM_ID']]['BOMName'] .'库存不足"}');
                        }
                        $values[$val['BOM_ID']]['Amount'] = (float)$val['Amount'] - $values[$val['BOM_ID']]['Amount'];
                        unset($values[$val['BOM_ID']]['BOMName']);//if donnot unset here,it will have a mistake on updating bom_stock
                        $updateArr[] = $values[$val['BOM_ID']];
                        unset($values[$val['BOM_ID']]);
                    }
                }
//                if(count($values) > 0){//出库的商品里有库存表没有数据记录的，则出库失败
//                    $missStr = implode(',', $this->searchMultiArray($values,'$values[$val[\'BOM_ID\']][\'BOM_ID\']','key'));//库存表没有数据记录的商品名
//                    die('{"status":-1,"msg":"'. $missStr .'没有库存记录"}');
//                }
//                var_dump($updateArr);
                if (count($updateArr) > 0) {
                    $this->mysql_model->db_upd(BOM_STOCK, $updateArr, 'BOM_ID');
//                    var_dump($result);
                }
            }
                $this->mysql_model->db_inst(STOORDER_DETAIL, $v);
                if ($this->db->trans_status() === FALSE) {
                    $this->db->trans_rollback();
                    die('{"status":-1,"msg":"出库失败"}');
//                    die();
                } else {
                    $this->db->trans_commit();
                    $this->cache_model->delsome(BOM_BASE);
                    $this->cache_model->delsome(BOM_STOCK);
                    $this->cache_model->delsome(BOM_STOCK_ORDER);
                    $this->cache_model->delsome(STOORDER_DETAIL);
                    $this->data_model->logs('新增其他出库 单据编号：' . $data['billNo']);
                    die('{"status":200,"msg":"success","data":{"id":"' . $data['billNo'] . '"}}');
                }
            } else {
                $data['billno'] = str_no('SO');
            $data['storehouse'] = $this->data_model->stockList('','');
                $this->load->view('invoi/out', $data);
            }
        }


//    public function out()
//    {
//        $this->purview_model->checkpurview(19);
//        $data = $this->input->post('postData', TRUE);
//        if (strlen($data) > 0) {
//            $cacheData = $this->cache->get('inventory.dataLock');
//            if ($cacheData['lock'] == 1) {//处于盘点状态
//                die('{"status":-1,"msg":"库存盘点中，请盘点完成后再进行出库操作..."}');//若是很多人都在盘点的时候执行出库，库存数据得不到及时更新，最后处理缓存数据的时候很可能出库数>库存数，导致谁都出库不了
//            }
//            $data = (array)json_decode($data);
//            /*			 (!isset($data['buId']) && $data['buId']<1) && die('{"status":-1,"msg":"请选择客户"}');
//                         $contact = $this->mysql_model->db_one(CONTACT,'(id='.intval($data['buId']).')');
//                         count($contact)<1 && die('{"status":-1,"msg":"请选择客户"}');*/
//            $info['billtype'] = 2;
//            $info['billno'] = str_no('QTCK');
//            $info['contactid'] = intval($data['buId']);
//            $info['contactname'] = '';//$contact['number'].' '.$contact['name'];
//            $info['billdate'] = date('Y-m-d H:i:s', time());
//            $info['type'] = $data['transTypeId'];
//            $info['typename'] = $data['transTypeName'];
//            $info['description'] = $data['description'];
//            $info['totalamount'] = -(float)$data['totalAmount'];
//            $info['totalqty'] = (float)$data['totalQty'];
//            $info['uid'] = $this->uid;
//            $info['username'] = $this->name;
//            $this->db->trans_begin();
//            $invoiid = $this->mysql_model->db_inst(INVOI, $info);
//            $v = array();
//            if (is_array($data['entries'])) {
//                $values = array();
//                foreach ($data['entries'] as $arr => $row) {
////                    $v[$arr]['invoiid'] = intval($invoiid);
//                    $v[$arr]['billtype'] = 2;
//                    $v[$arr]['billno'] = $info['billno'];
//                    $v[$arr]['contactid'] = $info['contactid'];
//                    $v[$arr]['contactname'] = $info['contactname'];
//                    $v[$arr]['type'] = $data['transTypeId'];
//                    $v[$arr]['typename'] = $data['transTypeName'];
//                    $v[$arr]['goodsid'] = intval($row->invId);
////                    $v[$arr]['goodsno']       = $row->invNumber;
//                    $v[$arr]['Account'] = -(float)($row->qty);
//                    $v[$arr]['amount'] = -(float)$row->amount;
//                    $v[$arr]['price'] = (float)$row->price;
//                    $v[$arr]['description'] = $row->description;
//                    $v[$arr]['billdate'] = $data['date'];
//                    //处理出库数据
//                    if (!isset($values[$row->invId])) {
//                        $bomArr[] = $row->invId;
//                        $values[$row->invId]['BOM_ID'] = $row->invId;
//                        $values[$row->invId]['Account'] = (float)$row->qty;
////                        $values[$row->invId]['goodsname'] = $row->invName;
//                    } else {
//                        $values[$row->invId]['Account'] += (float)$row->qty;
//                        $values[$row->invId]['BOMName'] = $row->invName;
//                    }
//                }
//
//                $bomStr = implode(',', $bomArr);
//                $sql = 'SELECT BOM_ID, Account FROM  t_' . BOM_STOCK . ' WHERE bom_id IN (' . $bomStr . ')';
//                $list = $this->mysql_model->db_sql($sql, 2);
//                foreach ($list as $val) {
//                    if (isset($values[$val['BOM_ID']])) {
//                        var_dump($values[$val['BOM_ID']]['Account']);
//                        if ($values[$val['BOM_ID']]['Account'] > $val['Account']) {  //如果出库数量大于库存，则出库失败
//                            die('{"status":-1,"msg":"' . $values[$val['BOM_ID']]['BOM_ID'] . '库存不足"}');
//                        }else {
//                            $values[$val['BOM_ID']]['Account'] = (float)$val['Account'] - $values[$val['BOM_ID']]['Account'];
//                            $updateArr=$values;
//                            var_dump($updateArr);
//                        }
//                    }
//                }
//
//                if(count($values) > 0){//出库的商品里有库存表没有数据记录的，则出库失败
//                    $missStr = implode(',', $this->searchMultiArray($values,'BOMName','key'));//库存表没有数据记录的商品名
//                    die('{"status":-1,"msg":"'. $missStr .'没有库存记录"}');
//                }
//                if (count($updateArr) > 0) {
//                    $this->mysql_model->db_upd(BOM_STOCK, $updateArr, 'BOM_ID');
//                }else{
//                        $this->data_model->logs('新增其他出库 单据编号：' . $info['billno']);
//                        die('{"status":200,"msg":"success","data":{"id":' . intval($invoiid) . '}}');
//                    }
//                }else {
//                    $data['billno'] = str_no('QTCK');
//                    $this->load->view('invoi/out', $data);
//            }
//        }
//    }



    /**
     * showdoc
     * @catalog 开发文档/仓库
     * @title 入库列表
     * @description 入库列表的接口
     * @method get
     * @url https://www.2midcm.com/invoi/inlist
     * @param contactno 必选 string 供应商编号
     * @param contactid 可选 int 供应商ID
     * @param contactname 可选 string 供应商名称
     * @param billno 必选 string 单据编号
     * @param billdate 必选 int 单据日期
     * @return {"status":200,"msg":"success","data":{"id":'.$id.',"transType":"$type"}}
     * @remark 这里是备注信息
     * @number 3
     */
    public function inlist() {
        $this->purview_model->checkpurview(14);
        $v = '';
        $data['status'] = 200;
        $data['msg']    = 'success';
        $page = max(intval($this->input->get_post('page',TRUE)),1);
        $rows = max(intval($this->input->get_post('rows',TRUE)),100);
        $key  = str_enhtml($this->input->get_post('matchCon',TRUE));
        $stt  = str_enhtml($this->input->get_post('beginDate',TRUE));
        $ett  = str_enhtml($this->input->get_post('endDate',TRUE));
        $where = 'Type IN (0,1,4,6)';
        if ($key) {
            $where .= ' and (PK_BOM_SO_ID like "%'.$key.'%")';
        }
        if ($stt) {
            $where .= ' and a.Create_Date>="'.$stt.'"';
        }
        if ($ett) {
            $where .= ' and a.Create_Date<="'.$ett.' 23:59:59"' ;
        }
        $offset = $rows*($page-1);
        $data['data']['page']      = $page;
        $data['data']['records']   = 1000;//$this->cache_model->load_total(BOM_STOCK_ORDER,$where);     //总条数
        $data['data']['total']     = ceil($data['data']['records']/$rows);                             //总分页数
        $list = $this->data_model->otherInList($where,' order by PK_BOM_SO_ID desc limit '.$offset.','.$rows.'');
        $cacheData = $this->cache->get('inventory.dataLock');
        foreach ($list as $arr=>$row) {
            $v[$arr]['PK_BOM_SO_ID']       = $row['PK_BOM_SO_ID'];
            $v[$arr]['Stock']           = intval($row['Stock']);
            $v[$arr]['Type']    = intval($row['Type']);;
            $v[$arr]['Status']     = intval($row['Status']);
            $v[$arr]['Creator']       = $row['Creator'];
            $v[$arr]['Create_Date']     = $row['Create_Date'];
            $v[$arr]['Stock_ID']     = $row['Stock'];
            $v[$arr]['type']     = $row['Type'];
            $v[$arr]['typeName']     = $row['Type'] == 4 ? '盘盈' : ($row['Type'] == 1?'采购':($row['Type'] == 6?'调仓':'其他入库'));
            $v[$arr]['state'] = $row['Status'] == 9 ? 1 : (($cacheData['lock'] == 1 && $row['Status'] ==5) ? 2 : 3);//1:完成，2待入库，3：需要手动入库
        }
        $data['data']['rows']        = is_array($v) ? $v : '';
        die(json_encode($data));
    }


//    public function inlist() {
//        $this->purview_model->checkpurview(14);
//        $v = '';
//        $data['status'] = 200;
//        $data['msg']    = 'success';
//        $page = max(intval($this->input->get_post('page',TRUE)),1);
//        $rows = max(intval($this->input->get_post('rows',TRUE)),100);
//        $key  = str_enhtml($this->input->get_post('matchCon',TRUE));
//        $stt  = str_enhtml($this->input->get_post('beginDate',TRUE));
//        $ett  = str_enhtml($this->input->get_post('endDate',TRUE));
//        $where = '';
//        if ($key) {
//            $where .= ' and (pk_bom_stock_id like "%'.$key.'%" or bom_id like "%'.$key.'%" or stock_id like "%'.$key.'%")';
//        }
//        if ($stt) {
//            $where .= ' and create_date>="'.$stt.'"';
//        }
//        if ($ett) {
//            $where .= ' and create_date<="'.$ett.' 23:59:59"' ;
//        }
//        $offset = $rows*($page-1);
//        $data['data']['page']      = $page;
//        $data['data']['records']   = $this->cache_model->load_total(BOM_STOCK,'(billtype=1) '.$where);     //总条数
//        $data['data']['total']     = ceil($data['data']['records']/$rows);                             //总分页数
//        $list = $this->cache_model->load_data(BOM_STOCK,'(1=1) and billtype=1 '.$where.' order by pk_bom_stock_id desc limit '.$offset.','.$rows.'');
//        foreach ($list as $arr=>$row) {
//            $v[$arr]['pk_bom_stock_id']    = (float)abs($row['pk_bom_stock_id']);
//            $v[$arr]['stock_id']           = intval($row['stock_id']);
//            $v[$arr]['bom_id']    = intval($row['bom_id']);;
//            $v[$arr]['number']     = intval($row['number']);;
//            $v[$arr]['cost']  = $row['cost'];
//            $v[$arr]['costType']  = $row['costType'];
//            $v[$arr]['creator_id']       = $row['creator_id'];
//            $v[$arr]['create_date']     = $row['create_date'];
//            $v[$arr]['modify_id']     = $row['modify_id'];
//            $v[$arr]['modify_date']= $row['modify_date'];
//        }
//        $data['data']['rows']        = is_array($v) ? $v : '';
//        die(json_encode($data));
//    }

    /**
     * showdoc
     * @catalog 开发文档/仓库
     * @title 出库列表
     * @description 出库列表的接口
     * @method get
     * @url https://www.2midcm.com/invoi/outlist
     * @param contactno 必选 string 客户编号
     * @param contactid 可选 int 客户ID
     * @param contactname 可选 string 客户名称
     * @param billno 必选 string 单据编号
     * @param billdate 必选 int 单据日期
     * @return {"status":200,"msg":"success","data":{"id":'.$id.'，"transType":"$type"}}
     * @remark 这里是备注信息
     * @number 3
     */
    public function outlist() {
        $v = '';
        $data['status'] = 200;
        $data['msg']    = 'success';
        $page = max(intval($this->input->get_post('page',TRUE)),1);
        $rows = max(intval($this->input->get_post('rows',TRUE)),100);
        $key  = str_enhtml($this->input->get_post('matchCon',TRUE));
        $stt  = str_enhtml($this->input->get_post('beginDate',TRUE));
        $ett  = str_enhtml($this->input->get_post('endDate',TRUE));
        $where = 'Type IN (2,3,5,7)';
        if ($key) {
            $where .= ' and (PK_BOM_SO_ID like "%'.$key.'%")';
        }
        if ($stt) {
            $where .= ' and a.Create_Date>="'.$stt.'"';
        }
        if ($ett) {
            $where .= ' and a.Create_Date<="'.$ett.' 23:59:59"' ;
        }
        $offset = $rows*($page-1);
        $data['data']['page']      = $page;
        $data['data']['records']   = 1000;//$this->cache_model->load_total(BOM_STOCK_ORDER,$where);     //总条数
        $data['data']['total']     = ceil($data['data']['records']/$rows);                             //总分页数
        $list = $this->data_model->otherInList($where,' order by Create_Date desc limit '.$offset.','.$rows.'');
        $cacheData = $this->cache->get('inventory.dataLock');
        foreach ($list as $arr=>$row) {
            $v[$arr]['PK_BOM_SO_ID']       = $row['PK_BOM_SO_ID'];
            $v[$arr]['Stock_ID']           = $row['Stock'];
            $v[$arr]['Type']    = intval($row['Type']);;
            $v[$arr]['Status']     = intval($row['Status']);
            $v[$arr]['Creator']       = $row['Creator'];
            $v[$arr]['Create_Date']     = $row['Create_Date'];
            $v[$arr]['type']     = $row['Type'];
            $v[$arr]['typeName']     = $row['Type'] == 2 ? '领用' : ($row['Type'] == 3?'销售':($row['Type'] == 7?'调仓':'盘亏'));
            $v[$arr]['state'] = $row['Status'] == 9 ? 1 : (($cacheData['lock'] == 1 && $row['Status'] ==5) ? 2 : 3);//1:完成，2待入库，3：需要手动入库
        }
        $data['data']['rows']        = is_array($v) ? $v : '';
        die(json_encode($data));
    }


//    public function outlist() {
//        $this->purview_model->checkpurview(18);
//        $v = '';
//        $data['status'] = 200;
//        $data['msg']    = 'success';
//        $page = max(intval($this->input->get_post('page',TRUE)),1);
//        $rows = max(intval($this->input->get_post('rows',TRUE)),100);
//        $key  = str_enhtml($this->input->get_post('matchCon',TRUE));
//        $stt  = str_enhtml($this->input->get_post('beginDate',TRUE));
//        $ett  = str_enhtml($this->input->get_post('endDate',TRUE));
//        $where = '';
//        if ($key) {
//            $where .= ' and (pk_bom_stock_id like "%'.$key.'%" or bom_id like "%'.$key.'%" or stock_id like "%'.$key.'%")';
//        }
//        if ($stt) {
//            $where .= ' and create_date>="'.$stt.'"';
//        }
//        if ($ett) {
//            $where .= ' and create_date<="'.$ett.' 23:59:59"';
//        }
//        $offset = $rows*($page-1);
//        $data['data']['page']      = $page;
//        $data['data']['records']   = $this->cache_model->load_total(BOM_STOCK_ORDER,'(type=3) '.$where.'');   //总条数
//        $data['data']['total']     = ceil($data['data']['records']/$rows);    //总分页数
//        $list = $this->cache_model->load_data(BOM_STOCK_ORDER,'(1=1)  and type=3 '.$where.' order by create_date desc limit '.$offset.','.$rows.'');
//        foreach ($list as $arr=>$row) {
//            $info['pk_bom_stock_id']     = $data['pk_bom_stock_id'];//str_no('QTRK');
//            $info['stock_id']   = intval($data['stock_id']);
//            $info['bom_id'] =  $data['bom_id']    ;//is_array($contact) ? $contact['number'].' '.$contact['name'] : '';
//            $info['account']   = $data['account'];
//            $info['minAccount']   = intval($data['minAccount']);
//            $info['cost']    = $data['cost'];
//            $info['costType'] = $data['costType'];
//            $info['creator_id'] = $data['creator_id'];
//            $info['create_date']    = $data['create_date'];
//            $info['modify_id']    = $data['modify_id'];
//            $info['modify_date']   = $data['modify_date'] ;
//        }
//        $data['data']['rows']        = is_array($v) ? $v : '';
//        die(json_encode($data));
//    }

    /**
     * showdoc
     * @catalog 开发文档/仓库
     * @title 出入库类型
     * @description 出入库类型的接口
     * @method get
     * @url https://www.2midcm.com/invoi/type
     * @param name 必选 string 名称
     * @param inout 可选 int 1 入库  -1出库
     * @return {"status":200,"msg":"success","data":{"id":'.$id.'}}
     * @remark 这里是备注信息
     * @number 3
     */
    public function type(){
        $type   = str_enhtml($this->input->get_post('type',TRUE));
        if (strlen($type)>0) {
            $v = '';
            $data['status'] = 200;
            $data['msg']    = 'success';
            $list = $this->cache_model->load_data(INVOI,'(type="'.$type.'") order by id');
            foreach ($list as $arr=>$row) {
                $v[$arr]['acctId']        = 0;
                $v[$arr]['calCost']       = 1;
                $v[$arr]['commission']    = false;
                $v[$arr]['direction']     = 1;
                $v[$arr]['free']          = false;
                $v[$arr]['id']            = intval($row['id']);
//                $v[$arr]['inOut']         = (float)$row['inout'];;
//                $v[$arr]['name']          = $row['name'];
                $v[$arr]['process']       = false;
                $v[$arr]['sysDefault']    = true;
                $v[$arr]['sysDelete']     = false;
                $v[$arr]['tableName']     = "t_scm_inventryoi";
                $v[$arr]['typeId']        = intval($row['id']);
                $v[$arr]['voucher']       = true;
            }
            $data['data']['items']        = is_array($v) ? $v : '';
            $data['data']['totalsize']    = $this->cache_model->load_total(BOM_STOCK,'(type="'.$type.'")');
            die(json_encode($data));
        }
    }

    public function info(){
        $orderId   = $this->input->get_post('id',TRUE);
        if (strlen($orderId) > 0) {
            $list = $this->data_model->invoi_info(' and (a.PK_OSt_ID="'.$orderId.'")','');
            $v = array();
            foreach ($list as $arr=>$row) {
                $v[$arr]['goods'] = $row['BOMName'];
                $v[$arr]['bomModel'] = $row['BOMModel'];
                $v[$arr]['mainUnit'] = $row['unitName'];
                $v[$arr]['qty'] = $row['Amount'];
                $v[$arr]['price'] = $row['Cost'];
            	$info['data']['id']       = 3;
            	$info['data']['userName']       = $row['userName'];
            }
            $info['data']['entries']     = is_array($v) ? $v : '';
            $info['data']['accId']       = 0;
            $info['data']['billNo'] = $list[0]['PK_OSt_ID'];
            $info['data']['date'] = $list[0]['Create_Date'];
            if(in_array(intval($this->input->get_post('type',TRUE)),array(0,4))){
                $info['data']['type'] = intval($this->input->get_post('type',TRUE)) == 4 ? '盘盈' : '其他入库';
            }
            if(in_array(intval($this->input->get_post('type',TRUE)),array(1,3))){
                $info['data']['type'] = intval($this->input->get_post('type',TRUE)) == 1 ? '采购' : '销售';
            }

            if(in_array(intval($this->input->get_post('type',TRUE)),array(2,5))){
                $info['data']['type'] = intval($this->input->get_post('type',TRUE)) == 5 ? '盘亏' : '领用';
            }
if(in_array(intval($this->input->get_post('type',TRUE)),array(6,7))){
                $info['data']['type'] = intval($this->input->get_post('type',TRUE)) == 6 ? '调仓' : '调仓';
            }

            $info['status']       = 200;
            die(json_encode($info));
        } else {
            alert('参数错误');
        }
    }


    /**
     * showdoc
     * @catalog 开发文档/仓库
     * @title 出入库删除
     * @description 出入库删除的接口
     * @method get
     * @url https://www.2midcm.com/invoi/del
     * @param name 必选 string 名称
     * @param inout 可选 int 1 入库  -1出库
     * @return {"status":200,"msg":"success","data":{"id":'.$id.'}}
     * * @return_param status int 1：'200'删除成功;2："-1"删除失败
     * @remark 这里是备注信息
     * @number 3
     */
    public function del(){
        $this->purview_model->checkpurview(17);
        $id   = $this->input->get('id',TRUE);
        $data = $this->mysql_model->db_one(BOM_STOCK_ORDER,'(PK_BOM_SO_ID="'.$id.'")');

        if (count($data)>0) {
            $this->db->trans_begin();
            $this->mysql_model->db_del(BOM_STOCK_ORDER,'(PK_BOM_SO_ID="'.$id.'")');
            $this->mysql_model->db_del(STOORDER_DETAIL,'(PK_OSt_ID="'.$id.'")');
            if ($this->db->trans_status() === FALSE) {
                $this->db->trans_rollback();
                die('{"status":-1,"msg":"删除失败"}');
            } else {
                $this->db->trans_commit();

                if($data['Status'] == 5){//入库数据在缓存的时候
                    $cacheData = $this->cache->get('inventory.dataLock');
                    if($cacheData['lock'] == 1){
                        if(isset($cacheData['data']) && count($cacheData['data']) > 0){
                            $dataList = $cacheData['data']['in'];
                            foreach ($dataList as $key => $vals){
                                if($vals['orderId'] == $id){
                                    unset($dataList[$key]);
                                    break;
                                }
                            }
                            $cacheData['data']['in'] = $dataList;
                            $this->cache->save('inventory.datalock',$cacheData,86400);
                        }
                    }
                }

                $this->cache_model->delsome(BOM_STOCK_ORDER);
                $this->cache_model->delsome(STOORDER_DETAIL);
                $this->data_model->logs('删除其他入库 单据编号：'.$id);
                die('{"status":200,"msg":"success"}');
            }
        }
        die('{"status":-1,"msg":"删除失败"}');
    }

    /**
     * showdoc
     * @catalog 开发文档/仓库
     * @title 购货单入库
     * @description 购货单入库的接口
     * @method get
     * @url https://www.2midcm.com/invoi/orderIn
     * @return {"status":200,"msg":"success"}
     * @return_param status int 1：'200'入库成功;2："-1"入库失败
     * @number 3
     */
    /*public function orderIn()
    {
        $orderId = $this->input->get_post('id', TRUE);
        //查询订单信息+采购商品是否存在，是否已审核通过状态，接着把东西存进去；
        //注意采购订单可对应多条商品信
        //采购成功就将订单置为已入入库状态3
        if ($orderId) {
            $order = $this->mysql_model->db_select(ORDERPUR, 'PK_OP_ID = "' . $orderId . '"');
            $BOM = $this->mysql_model->db_select(BOM_STOCK, 'BOM_ID = "' . $order[0]['BOM_ID'] . '"');
            if (count($order) < 1 || intval($order[0]['Status']) != 2) {
                die('{"status":-1,"msg":"采购单（' . $orderId . '）状态有误"}');
            }

            $dataList = $this->mysql_model->db_select(ORDERPUR_DETAIL, 'OP_ID = "' . $orderId . '"');
            if(count($dataList) < 1){
                die('{"status":-1,"msg":"采购单（"' . $orderId . '"）数据有误"}');
            }

                        $info['Amount'] = $order[0]['PurOrder_Total']+$BOM[0]['Amount'];
                        $info['BOM_ID'] = intval($order[0]['BOM_ID']);
                        $info['Cost'] = $order[0]['Pur_Price'];
                        $info['Stock_ID'] = 139;
                        $this->db->trans_begin();
                        $invoiid = $this->mysql_model->db_inst(BOM_STOCK, $info);
                        $v = array();
                            foreach ($dataList as $arr => $row) {
                                $v[$arr]['PK_OSt_ID'] = $row['OP_ID'];
                                $v[$arr]['Ost_De'] = $row['OP_De'];
                                $v[$arr]['BOM_ID'] = $info['BOM_ID'];
                                $v[$arr]['cost'] = $info['Pur_Price'];
                                $v[$arr]['SO_SubTotal'] = $info['Pur_SubTotal'];
                                //$v[$arr]['billtype'] = $info['billtype'];
                                //$v[$arr]['typename'] = $info['typename'];
                                //$v[$arr]['goodsid'] = $row['goodsid'];
                                //$v[$arr]['goodsno'] = $row['goodsno'];
                                //$v[$arr]['qty'] = (float)$row['qty'];
                                $v[$arr]['amount'] = (float)$row['amount'];
                                //$v[$arr]['price'] = (float)$row['price'];
                                //$v[$arr]['description'] = $row->description;
                                //$v[$arr]['billdate'] = $info['billdate']; //入库时间
                            }

                        $this->mysql_model->db_inst(OST_DETAIL, $v);

            $values = array();
            $bomArr = array();
            foreach ($dataList as  $val){
                if(!isset($values[$val['BOM_ID']])) {
                    $bomArr[] = $val['BOM_ID'];
                    $values[$val['BOM_ID']]['BOM_ID'] = $val['BOM_ID'];
                    $values[$val['BOM_ID']]['Amount'] = (float)$val['Amount'];
                }else{
                    $values[$val['BOM_ID']]['Amount'] += (float)$val['Amount'];
                }
            };
            $cacheData = $this->cache->get('inventory.dataLock');
            if($cacheData['lock'] == 1){//处于盘点状态
                $cacheData['data']['in'][] = array('orderId' => $orderId, 'value' => $values);
                if($this->cache->save('inventory.dataLock',$cacheData,86400)){
                    die('{"status":200,"msg":"正在盘点...此次数据将在盘点完成后自动导入..."}');
                }
            }else {//不处于盘点状态

                $bomStr = implode(',', $bomArr);
                $list = $this->mysql_model->db_select(BOM_STOCK,'BOM_ID IN (' . $bomStr . ')');
                /*                $sql = 'SELECT BOM_ID, Account FROM ' . BOM_STOCK . ' WHERE BOM_ID IN (' . $bomStr . ')';
                                $list = $this->mysql_model->db_sql($sql, 2);*/
                /*$updateArr = array();
                $modifyDate = date('Y-m-d H:i:s',time());
                foreach ($list as $val) {
                    if (isset($values[$val['BOM_ID']])) {
                        $values[$val['BOM_ID']]['Amount'] += (float)$val['Amount'];
//                        $values[$val['BOM_ID']]['Modify_Date'] = $modifyDate;
//                        $values[$val['BOM_ID']]['Modify_ID'] = $this->uid;
                        $updateArr[] = $values[$val['BOM_ID']];
                        unset($values[$val['BOM_ID']]);
                    }
                }

                $this->db->trans_begin();
                if (count($updateArr) > 0) {
                    $t1 = $this->mysql_model->db_upd(BOM_STOCK, $updateArr, 'BOM_ID');
                    $t/his->mysql_model->db_inst(BOM_STOCK_ORDER,array('PK_BOM_SO_ID' => str_no('SO'), 'Order_ID' => $orderId,Stock_ID=>139
                        'Type' => 1, 'Status' => 9, 'Creator_ID' => $this->uid));

                    $this->mysql_model->db_upd(ORDERPUR, array('Status' => 9), 'PK_OP_ID = "' . $orderId  .'"');
                }
                /*                if (count($values) > 0) {
                                    $this->mysql_model->db_inst(BOM_STOCK, array_values($values));
                                }*/ //正常来说 应该是库存里面有对应的数据了，因此就不把不存在数据插入进去了

       /*         if ($this->db->trans_status() === FALSE) {
                    $this->db->trans_rollback();
                    die();
                } else {
                    $this->db->trans_commit();
                    $this->cache_model->delsome(BOM_STOCK);
                    $this->cache_model->delsome(BOM_STOCK_ORDER);
                    $this->cache_model->delsome(ORDERPUR);
                    $this->data_model->logs('新增采购单入库 单据编号：' . $orderId . '操作人：'. $this->name);
                    die('{"status":200,"msg":"采购单' . $orderId . '入库成功"}');
                }
            }
        }
    }*/

    public function orderIn()
    {
            $cacheData = $this->cache->get('inventory.dataLock');
            if($cacheData['lock'] == 1) {//处于盘点状态
                die('{"status":-1,"msg":"库存盘点中，请盘点完成后再进行入库操作..."}');//若是很多人都在盘点的时候执行出库，库存数据得不到及时更新，最后处理缓存数据的时候很可能出库数>库存数，导致谁都出库不了
            }
        $orderId = $this->input->get_post('id', TRUE);
        $STOCK_ID = $this->input->get_post('storehouse_id', TRUE);
        //查询订单信息+采购商品是否存在，是否已审核通过状态，接着把东西存进去；
        //注意采购订单可对应多条商品信
        //采购成功就将订单置为已入入库状态3
        if ($orderId) {
            $order = $this->mysql_model->db_select(ORDERPUR, 'PK_OP_ID = "' . $orderId . '"');
            if (count($order) < 1 || intval($order[0]['Status']) != 2) {
                die('{"status":-1,"msg":"采购单（' . $orderId . '）状态有误"}');
            }

            $dataList = $this->mysql_model->db_select(ORDERPUR_DETAIL, 'OP_ID = "' . $orderId . '"');
            if(count($dataList) < 1){
                die('{"status":-1,"msg":"采购单（"' . $orderId . '"）数据有误"}');
            }

                        $this->db->trans_begin();
			$SO_ID =  str_no('SO');
                        $v = array();
                        $info = array();
                        $info1 = array();
                            foreach ($dataList as $arr => $row) {
$BOM_ID = $row['BOM_ID'];
	            $BOM = $this->mysql_model->db_select(BOM_STOCK, 'BOM_ID = "' . $BOM_ID . '" and Stock_ID="'.$STOCK_ID.'"');
			if(count($BOM)<1){
			$info1['Stock_ID'] = $STOCK_ID;
                            $info1['BOM_ID'] = $row['BOM_ID'];
                            $info1['Amount'] = $row['Amount'];
                            $info1['Cost'] = $row['Pur_Price'];
                        $this->mysql_model->db_inst(BOM_STOCK, $info1);
			}else{
                       		$Amount = $row['Amount']+$BOM[0]['Amount'];
				$Cost = ($BOM[0]['Amount']*$BOM[0]['Cost']+$row['Pur_SubTotal'])/$Amount;
                        //$info[$arr]['Cost'] = $row['Pur_Price'];
                                /*$v[$arr]['Stock_ID'] = STOCK_ID;
                                $v[$arr]['BOM_ID'] = $info['BOM_ID'];
                                $v[$arr]['cost'] = $info['Pur_Price'];
                                $v[$arr]['SO_SubTotal'] = $info['Pur_SubTotal'];
                                $v[$arr]['amount'] = (float)$row['amount'];*/
                        	$this->mysql_model->db_upd(BOM_STOCK, array('Amount'=>$Amount,'Cost'=>$Cost),'(Stock_ID="'.$STOCK_ID.'" and BOM_ID='.$BOM_ID.')');
                        	$this->mysql_model->db_upd(BOM_STOCK, array('Cost'=>$Cost),'(BOM_ID='.$BOM_ID.')');
			}    $info[$arr]['PK_OSt_ID'] = $SO_ID;
			    $info[$arr]['Ost_De'] = $row['OP_De'];	
			    $info[$arr]['BOM_ID'] = $row['BOM_ID'];	
			    $info[$arr]['Amount'] = $row['Amount'];	
			    $info[$arr]['Cost'] = $row['Pur_Price'];	
			    $info[$arr]['SO_SubTotal'] = $row['Pur_SubTotal'];	
			}
                    $this->mysql_model->db_inst(BOM_STOCK_ORDER,array('PK_BOM_SO_ID' => $SO_ID, 'Order_ID' => $orderId,'Stock_ID'=>$STOCK_ID,
                        'Type' => 1, 'Status' => 9, 'Creator_ID' => $this->uid));
                        $this->mysql_model->db_inst(STOORDER_DETAIL, $info);
                if ($this->db->trans_status() === FALSE) {
                    $this->db->trans_rollback();
                    die();
                } else {
                    $this->db->trans_commit();
                    $this->mysql_model->db_upd(ORDERPUR, array('Status' => 9,'Stock_ID'=>$STOCK_ID), 'PK_OP_ID = "' . $orderId  .'"');
                    $this->cache_model->delsome(BOM_STOCK);
                    $this->cache_model->delsome(BOM_STOCK_ORDER);
                    $this->cache_model->delsome(ORDERPUR);
                    $this->data_model->logs('新增采购单入库 单据编号：' . $orderId);
                    die('{"status":200,"msg":"采购单' . $orderId . '入库成功"}');
                }
	}
    }
    /**
     * showdoc
     * @catalog 开发文档/仓库
     * @title 销货单出库（盘点时不允许出库）
     * @description 销货单出库的接口
     * @method get
     * @url https://www.2midcm.com/invoi/orderOut
     * @return {"status":200,"msg":"success"}
     * @return_param status int 1：'200'出库成功;2："-1"出库失败
     * @number 3
     */
    public function orderOut()
    {
        $orderId = $this->input->get_post('id', TRUE);
        $STOCK_ID = $this->input->get_post('storehouse_id', TRUE);
        if ($orderId) {
            $order = $this->mysql_model->db_select(SALEORDER, 'PK_OS_ID ="' . $orderId .'"');
            if (count($order) < 1 || intval($order[0]['Status']) != 6) {
                die('{"status":-1,"msg":"销货单（' . $orderId . '）状态有误"}');
            }
            $cacheData = $this->cache->get('inventory.dataLock');
            if($cacheData['lock'] == 1) {//处于盘点状态
                die('{"status":-1,"msg":"库存盘点中，请盘点完成后再进行出库操作..."}');//若是很多人都在盘点的时候执行出库，库存数据得不到及时更新，最后处理缓存数据的时候很可能出库数>库存数，导致谁都出库不了
            }


            // $dataList = $this->mysql_model->db_select(INVSA_INFO, 'invsaid = ' . $orderId);
            $dataList = $this->data_model->invsa_info(' and (a.OS_ID="'.$orderId.'")','');
            if(count($dataList) < 1){
                die('{"status":-1,"msg":"销货单（' . $orderId . '）销售数据有误"}');
            }
            $values = array();
            $bomArr = array();
$SO = str_no('SO');
            foreach ($dataList as  $val){
                if(!isset($values[$val['BOM_ID']])) {//销售单数据
            $a = $this->mysql_model->db_inst(STOORDER_DETAIL,array('PK_OSt_ID' => $SO, 'Ost_De' => $val['OS_De'],'BOM_ID' => $val['BOM_ID'],'Amount' => $val['Amount'],'Cost' => $val['Sale_Price'],'SO_SubTotal' => $val['Sale_SubTotal']));
                    $bomArr[] = $val['BOM_ID'];
                    $values[$val['BOM_ID']]['BOM_ID'] = $val['BOM_ID'];
                    $values[$val['BOM_ID']]['Amount'] = (float)$val['Amount'];
                    $values[$val['BOM_ID']]['BOMName'] = $val['BOMName'];
                }else{
                    $values[$val['BOM_ID']]['Amount'] += (float)$val['Amount'];
                    $values[$val['BOM_ID']]['BOMName'] = $val['BOMName'];
                }
            };

            $bomStr = implode(',', $bomArr);
            $list = $this->mysql_model->db_select(BOM_STOCK,'BOM_ID IN (' . $bomStr . ') and Stock_ID='.$STOCK_ID.'');
            $updateArr = array();
            $modifyDate = date('Y-m-d H:i:s',time());
            foreach ($list as $val) {
                if (isset($values[$val['BOM_ID']])) {
                    if($values[$val['BOM_ID']]['Amount'] > $val['Amount']){  //如果出库数量大于库存，则出库失败
                        die('{"status":-1,"msg":"'. $values[$val['BOM_ID']]['BOMName'] .'库存不足"}');
                    }
                    $values[$val['BOM_ID']]['Amount'] = (float)$val['Amount'] - $values[$val['BOM_ID']]['Amount'];
                    unset($values[$val['BOM_ID']]['BOMName']);//if donnot unset here,it will have a mistake when update bom_stock
//                    $values[$val['BOM_ID']]['Modify_Date'] = $modifyDate;
//                    $values[$val['BOM_ID']]['Modify_ID'] = $this->uid;
                    $updateArr[] = $values[$val['BOM_ID']];
			$sql = 'update t_'.BOM_STOCK.' set Amount='.$values[$val['BOM_ID']]['Amount'].' where BOM_ID='.$val['BOM_ID'].' and Stock_ID='.$STOCK_ID.'';
			$this->db->query($sql);
                    unset($values[$val['BOM_ID']]);
                }
            }
            if(count($values) > 0){//出库的商品里有库存表没有数据记录的，则出库失败
                $missStr = implode(',', $this->searchMultiArray($values,'BOMName','key'));//库存表没有数据记录的商品名
                die('{"status":-1,"msg":"'. $missStr .'没有库存记录"}');
            }

            $this->db->trans_begin();

            //$this->mysql_model->db_upd(BOM_STOCK, $updateArr, 'BOM_ID and Stock_ID='.$STOCK_ID.'');

            $this->mysql_model->db_inst(BOM_STOCK_ORDER,array('PK_BOM_SO_ID' => $SO, 'Order_ID' => $orderId,'Stock_ID' => $STOCK_ID,
                'Type' => 3, 'Status' => 9, 'Creator_ID' => $this->uid));

            $this->mysql_model->db_upd(SALEORDER, array('Status' => 9,'Stock_ID'=>$STOCK_ID), 'PK_OS_ID = "' . $orderId . '"');

            if ($this->db->trans_status() === FALSE) {
                $this->db->trans_rollback();
                die();
            } else {
                $this->db->trans_commit();
                $this->cache_model->delsome(BOM_STOCK);
                $this->cache_model->delsome(STOORDER_DETAIL);
                $this->cache_model->delsome(BOM_STOCK_ORDER);
                $this->cache_model->delsome(SALEORDER);
                $this->data_model->logs('新增销售单出库 单据编号：' . $orderId);
                die('{"status":200,"msg":"销售单' . $orderId . '出库成功"}');
            }
        }
    }

    //获取一维或多维数组某个特定键(数组下标)的所有值
    function searchMultiArray(array $array, $search, $mode = 'key') {
        $res = array();
        foreach (new RecursiveIteratorIterator(new RecursiveArrayIterator($array)) as $key => $value) {
            if ($search === ${${"mode"}}){
                if($mode == 'key'){
                    $res[] = $value;
                }else{
                    $res[] = $key;
                }
            }
        }
        return $res;
    }

    //导出其他出库/入库
    public function export(){
        $this->purview_model->checkpurview(5);
        $type = $_GET['type'];
        if(in_array($type,array('in','out'))){
            if($type == 'in'){
                $data['type'] = '入库';
                sys_xls('其他入库记录.xls');
            }
            if($type == 'out'){
                $data['type'] = '出库';
                sys_xls('其他出库记录.xls');
            }
            $id  = str_enhtml($this->input->get_post('id',TRUE));
            if (strlen($id)>0) {
                $data['list1'] = $this->cache_model->load_data(INVOI,'(id in('.$id.'))');
                $data['list2'] = $this->data_model->invoi_info(' and (a.invoiid in('.$id.'))');
                $this->data_model->logs('导出报价单记录');
                $this->load->view('invoi/export',$data);
            }
        }

    }

    //手动入库
    public function manualImport(){
        $orderId = $this->input->get_post('id', TRUE);

        $dataList = $this->mysql_model->db_select(STOORDER_DETAIL, 'PK_BOM_SO_ID = "' . $orderId . '"');

        $values = array();
        $bomArr = array();
        foreach ($dataList as  $val){
            if(!isset($values[$val['BOM_ID']])) {
                $bomArr[] = $val['BOM_ID'];
                $values[$val['BOM_ID']]['BOM_ID'] = $val['BOM_ID'];
                $values[$val['BOM_ID']]['Account'] = (float)$val['BOM_Account'];
            }else{
                $values[$val['BOM_ID']]['Account'] += (float)$val['BOM_Account'];
            }
        };

        $bomStr = implode(',', $bomArr);
        $list = $this->mysql_model->db_select(BOM_STOCK,'BOM_ID IN (' . $bomStr . ')');
        /*                $sql = 'SELECT BOM_ID, Account FROM ' . BOM_STOCK . ' WHERE BOM_ID IN (' . $bomStr . ')';
                        $list = $this->mysql_model->db_sql($sql, 2);*/
        $updateArr = array();
        $modifyDate = date('Y-m-d H:i:s',time());
        foreach ($list as $val) {
            if (isset($values[$val['BOM_ID']])) {
                $values[$val['BOM_ID']]['Account'] += (float)$val['Account'];
                $values[$val['BOM_ID']]['Modify_Date'] = $modifyDate;
                $values[$val['BOM_ID']]['Modify_ID'] = $this->uid;
                $updateArr[] = $values[$val['BOM_ID']];
                unset($values[$val['BOM_ID']]);
            }
        }

        $this->db->trans_begin();
        if (count($updateArr) > 0) {
            $this->mysql_model->db_upd(BOM_STOCK, $updateArr, 'BOM_ID');

            $this->mysql_model->db_upd(BOM_STOCK_ORDER, array('Status' => 9), 'PK_BOM_SO_ID = "' . $orderId  .'"');
        }
        /*                if (count($values) > 0) {
                            $this->mysql_model->db_inst(BOM_STOCK, array_values($values));
                        }*/ //正常来说 应该是库存里面有对应的数据了，因此就不把不存在数据插入进去了

        if ($this->db->trans_status() === FALSE) {
            $this->db->trans_rollback();
            die();
        } else {
            $this->db->trans_commit();
            $this->cache_model->delsome(BOM_STOCK);
            $this->cache_model->delsome(BOM_STOCK_ORDER);
            $this->data_model->logs('手动入库 单据编号：' . $orderId );
            die('{"status":200,"msg":"' . $orderId . '手动入库成功"}');
        }
    }


}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */
