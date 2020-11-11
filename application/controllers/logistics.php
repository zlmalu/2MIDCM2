<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
/**
 *物流信息控制器
 */
class Logistics extends CI_Controller {

    public function __construct(){
        parent::__construct();
        $this->purview_model->checkpurview(89);
        $this->load->model('data_model');
        $this->uid  = $this->session->userdata('uid');
        $this->name = $this->session->userdata('name');

    }

    public function index(){
        $this->load->view('logistics/index');
    }
    /**
     * showdoc
     * @catalog 开发文档/采购
     * @title 采购新增
     * @description 采购新增的接口
     * @method get
     * @url https://www.2midcm.com/invpu/add
     * @param contactno 必选 string 供应商编号
     * @param contactid 必选 string 供应商ID
     * @param contactname 必选 string 供应商名称
     * @param billno 必选 string 单据编号
     * @param type 必选 string 1采购 2退货
     * @param billdate 必选 string 单据日期
     * @param description 必选 string 备注
     * @param goodsno 必选 string 商品编号
     * @param goodsid 必选 string 商品ID
     * @param price 必选 string 单价
     * @return "{"status":200,"msg":"success","data":'.json_encode($data).'}
     * @return_param status int 1：'200'新增成功;2："-1"新增失败
     * @remark 这里是备注信息
     * @number 1
     */
    public function add(){
        $this->purview_model->checkpurview(90);
        $data = $this->input->post('postData',TRUE);
        if (strlen($data)>0) {
            $data = (array)json_decode($data);
            (!isset($data['buId']) && $data['buId']<1) && die('{"status":-1,"msg":"请选择物流公司"}');
            $contact = $this->mysql_model->db_one(BETWEENUNIT,'(PK_BU_ID='.intval($data['buId']).')');
            count($contact)<1 && die('{"status":-1,"msg":"请选择物流公司"}');
            $info['PK_OL_ID']      = $data['billNo'];//str_no('P');
            $info['Supplier_ID']   = intval($data['buId']);
            $info['Name']   = $data['orderName'];
            $info['Desc']   = $data['Desc'];
            $info['Order_Total']      = (float)$data['totalAmount']; //订单总金额
            $info['Payment'] = $data['paymentType'];
            $info['Creator_ID']         = $this->uid;
            $info['Status']         = 9; //增加物流信息就应该是直接执行完毕吧？
            $this->db->trans_begin();
            $this->mysql_model->db_inst(BOM_LOGORDER,$info);
            $v = array();
            if (is_array($data['entries'])) {

                $repeat = array();
                $tmpArr = array();

                foreach ($data['entries'] as $arr=>$row) {
                    $v[$arr]['OL_ID']       = $info['PK_OL_ID'];
                    $v[$arr]['OL_De']     = str_pad($arr+1,5,"0",STR_PAD_LEFT);
                    $v[$arr]['BOM_ID']       = intval($row->invId);
                    $v[$arr]['Amount']           = (float)$row->qty;
                    $v[$arr]['Log_SubTotal']        = (float)$row->amount;
                    $v[$arr]['Log_Price']         = (float)$row->price;
//                    $v[$arr]['Creator_ID']  = $this->uid;

                    if(isset($tmpArr[intval($row->invId)])){                 //检查是否有重复的bom
                        $repeat[] = $row->invName;
                    }else{
                        $tmpArr[intval($row->invId)] = $row->invName;
                    }
                }
                if (count($repeat) > 0){
                    $this->db->trans_rollback();//回滚数据
                    die('{"status":-1,"msg":"物品：'. implode("，",$repeat).' 重复提交，请筛选处理后再提交"}');
                }
            }
            $this->mysql_model->db_inst(LOGORDER_DETAIL,$v);
            if ($this->db->trans_status() === FALSE) {
                $this->db->trans_rollback();
                die();
            } else {
                $this->db->trans_commit();
                $this->cache_model->delsome(BOM_LOGORDER);
                $this->cache_model->delsome(LOGORDER_DETAIL);
                $this->data_model->logs('新增物流单：'.$info['PK_OL_ID']);
                die('{"status":200,"msg":"success","data":{"id":"'.$info['PK_OL_ID'].'"}}');
            }
        } else {
            $data['billno'] = str_no('L');
            $this->load->view('logistics/add',$data);
        }
    }


    /**
     * showdoc
     * @catalog 开发文档/采购
     * @title 采购修改
     * @description 采购修改的接口
     * @method get
     * @url https://www.2midcm.com/invpu/edit
     * @param contactno 必选 string 供应商编号
     * @param contactid 必选 string 供应商ID
     * @param contactname 必选 string 供应商名称
     * @param billno 必选 string 单据编号
     * @param type 必选 string 1采购 2退货
     * @param billdate 必选 string 单据日期
     * @param description 必选 string 备注
     * @param goodsno 必选 string 商品编号
     * @param goodsid 必选 string 商品ID
     * @param price 必选 string 单价
     * @return "{"status":200,"msg":"success","data":'.json_encode($data).'}
     * @return_param status int 1：'200'修改成功;2："-1"修改失败
     * @remark 这里是备注信息
     * @number 1
     */
    public function edit(){
        $this->purview_model->checkpurview(91);
        $id   = $this->input->get('id',TRUE);
        $data = $this->input->post('postData',TRUE);
        if (strlen($data)>0) {
            $data = (array)json_decode($data);
            !isset($data['id']) && die('{"status":-1,"msg":"参数错误"}');
            $logData = $this->mysql_model->db_select(BOM_LOGORDER,'(PK_OL_ID= "'.$data['id']. '")');

            $info['PK_OL_ID']      = $data['billNo'];
            $info['Supplier_ID']   = intval($data['buId']);
            $info['Name']   = $data['orderName'];
            $info['Order_Total']      = (float)$data['totalAmount']; //订单总金额
            $info['Payment'] = $data['paymentType'];
            $info['Modify_ID']         = $this->uid;
            $info['Desc']   = $data['Desc'];
            $info['Modify_Date']    = date('Y-m-d H:i:s',time());
            $v = array();

            $this->db->trans_begin();

            $this->mysql_model->db_upd(BOM_LOGORDER,$info,'(PK_OL_ID= "'.$info['PK_OL_ID'].'")');

            if (is_array($data['entries'])) {

                $this->mysql_model->db_del(LOGORDER_DETAIL,'(OL_ID= "'.$info['PK_OL_ID'].'")');
                $repeat = array();
                $tmpArr = array();

                foreach ($data['entries'] as $arr=>$row) {
                    $v[$arr]['OL_ID']        = $info['PK_OL_ID'];
                    $v[$arr]['OL_De']     = str_pad($arr+1,5,"0",STR_PAD_LEFT);
                    $v[$arr]['BOM_ID']   = $row->invId;
                    $v[$arr]['Amount']          = $row->qty;
                    $v[$arr]['Log_Price']       = $row->price;
                    $v[$arr]['Log_SubTotal']           = $row->amount;
//                    $v[$arr]['Creator_ID']        = $logData[0]['Creator_ID'];
//                    $v[$arr]['Create_Date']         = $logData[0]['Create_Date'];
//                    $v[$arr]['Modify_ID']  = $info['Modify_ID'] ;
//                    $v[$arr]['Modify_Date']   = $info['Modify_Date'];

                    if(isset($tmpArr[intval($row->invId)])){                 //检查是否有重复的bom
                        $repeat[] = $row->invName;
                    }else{
                        $tmpArr[intval($row->invId)] = $row->invName;
                    }
                }

                if (count($repeat) > 0){
                    $this->db->trans_rollback();//回滚数据
                    die('{"status":-1,"msg":"物品：'. implode("，",$repeat).' 重复提交，请筛选处理后再提交"}');
                }

                $this->mysql_model->db_inst(LOGORDER_DETAIL,$v);
            }
            if ($this->db->trans_status() === FALSE) {
                $this->db->trans_rollback();
                die('');
            } else {
                $this->db->trans_commit();
                $this->cache_model->delsome(BOM_LOGORDER);
                $this->cache_model->delsome(LOGORDER_DETAIL);
                $this->data_model->logs('修改物流单：'.$info['PK_OL_ID']);
                die('{"status":200,"msg":"success","data":{"id":"'.$info['PK_OL_ID'].'"}}');
            }
        } else {
            $data = $this->mysql_model->db_one(BOM_LOGORDER,'(PK_OL_ID= "'.$id.'")');
            if (count($data)>0) {
                $this->load->view('logistics/edit',$data);
            } else {
                $data['billno'] = str_no('L');
                $this->load->view('logistics/add',$data);
            }
        }
    }

    //修改单据数据回显
    public function info(){
        $id   = $this->input->get_post('id',TRUE);
        //$data = $this->mysql_model->db_one(ORDERPUR,'(id='.$id.')');
        $list = $this->data_model->logOrderList('and PK_OL_ID = "' . $id . '"');
        if (count($list)>0) {
            $data = $list[0];
            $v = '';
            $info['status'] = 200;
            $info['msg']    = 'success';
            $info['data']['id']                 = $data['PK_OL_ID'];
            $info['data']['buId']               = intval($data['Supplier_ID']);
            $info['data']['contactName']        = $data['Supplier_Name'];
            $info['data']['date']               = $data['Create_Date'];
            $info['data']['billNo']             = $data['PK_OL_ID'];
            $info['data']['totalAmount']        = (float)abs($data['Order_Total']);
            $info['data']['userName']           = $data['Username'];
            $info['data']['status']             = 'edit';
            $info['data']['PK_BOM_Log_ID']      = $data['PK_OL_ID'];//str_no('P');
            $info['data']['Name']   = $data['Name'];
            $info['data']['Desc']   = $data['Desc'];
            $info['data']['paymentType'] = $data['Payment'];
            $info['data']['Creator_ID']         = $this->uid;
            $list = $this->data_model->logistics_info(' and (a.OL_ID= "'.$id.'")','');
            foreach ($list as $arr=>$row) {
                $v[$arr]['bomModel']           = $row['BOMModel'];
                $v[$arr]['goods']             = $row['BOMName'];
                $v[$arr]['invName']      = $row['BOMName'];
                $v[$arr]['qty']          = (float)abs($row['Amount']);
                $v[$arr]['price']       = (float)abs($row['Log_Price']);
               // $v[$arr]['mainUnit']     = $row['unitName'];
                $v[$arr]['PK_BOM_ID']        = intval($row['PK_BOM_ID']);
                //$v[$arr]['unitId']       = intval($row['FK_UnitClass_ID']);
                $v[$arr]['amount'] = (float)abs($row['Log_SubTotal']);//小计
            }
            $info['data']['entries']     = is_array($v) ? $v : '';
            $info['data']['accId']       = 0;
            $info['data']['accounts']    = array();
            die(json_encode($info));
        } else {
            alert('参数错误');
        }
    }


    //采购单列表
    public function lists() {
        $v = '';
        $data['status'] = 200;
        $data['msg']    = 'success';
        $page = max(intval($this->input->get_post('page',TRUE)),1);
        $rows = max(intval($this->input->get_post('rows',TRUE)),100);
        $key  = str_enhtml($this->input->get_post('matchCon',TRUE));
        $review  = str_enhtml($this->input->get_post('review',TRUE));
        $stt  = str_enhtml($this->input->get_post('beginDate',TRUE));
        $ett  = str_enhtml($this->input->get_post('endDate',TRUE));
        $where = '';
        if (strlen($key)>0) {
            $where .= ' and (a.PK_OP_ID like "%'.$key.'%" or a.Name like "%'.$key.'%" or a.PurOrder_Payment like "%'.$key.'%")';
        }
        if (strlen($stt)>0) {
            $where .= ' and a.Create_Date>="'.$stt.'"';
        }
        if (strlen($ett)>0) {
            $where .= ' and a.Create_Date<="'.$ett.' 23:59:59"';
        }
        if (intval($review) > 0){
            $where .= ' and a.Status = ' .$review;
        }else{
            $where .= ' and a.Status != 0';   //排除掉是采购计划的数据
        }

        $offset = $rows * ($page-1);
        $data['data']['page']      = $page;
        /*		$data['data']['records']   = $this->cache_model->load_total(ORDERPUR,'(1=1) '.$where);   //总条数
                $data['data']['total']     = ceil($data['data']['records']/$rows);    //总分页数*/
        //$list = $this->cache_model->load_data(ORDERPUR,'(1=1) '.$where.' order by id desc limit '.$offset.','.$rows.'');
        $list = $this->data_model->logOrderList($where, ' order by a.Create_Date desc limit '.$offset.','.$rows.'');
        foreach ($list as $arr=>$row) {
            $v[$arr]['id']           = $row['PK_OL_ID'];
            $v[$arr]['PK_BOM_Log_ID'] =  $row['PK_OL_ID'];
            $v[$arr]['Supplier_Name']  = $row['Supplier_Name'];
            $v[$arr]['Name']  = $row['Name'];
            $v[$arr]['Desc']  = $row['Desc'];
            $v[$arr]['PurOrder_Amount']       = (float)abs($row['Order_Total']);
            $v[$arr]['Create_Date']     = $row['Create_Date'];
            $v[$arr]['Username']     = $row['Username'];
            $v[$arr]['PurOrder_Payment'] = $row['Payment'];
        }
        $data['data']['records']   = count($list);  //总条数
        $data['data']['total']     = ceil($data['data']['records']/$rows);    //总分页数
        $data['data']['rows']      = is_array($v) ? $v : '';
        die(json_encode($data));
    }

    /**
     * showdoc
     * @catalog 开发文档/采购
     * @title 采购导出
     * @description 采购导出的接口
     * @method get
     * @url https://www.2midcm.com/invpu/export
     * @param id 必选 int 采购单ID
     * @return "{"status":200,"msg":"success","id":"1"}
     * @return_param status int 1：'200'导出成功;2："-1"导出失败
     * @remark 这里是备注信息
     * @number 1
     */
    public function export() {
        $this->purview_model->checkpurview(5);
        sys_xls('采购记录.xls');
        $id  = str_enhtml($this->input->get_post('id',TRUE));
        if (strlen($id)>0) {
            $data['list1'] = $this->data_model->purOrderList(' and (a.PK_OP_ID in('.str_replace("$",'"',$id).'))');
            $data['list2'] = $this->data_model->invpu_info(' and (a.PurOrder_ID in('.str_replace("$",'"',$id).'))');
            $this->data_model->logs('导出采购记录');
            $this->load->view('invpu/export',$data);
        }
    }

    /**
     * showdoc
     * @catalog 开发文档/采购
     * @title 采购删除
     * @description 采购删除的接口
     * @method get
     * @url https://www.2midcm.com/invpu/del
     * @param id 必选 int 采购单ID
     * @return "{"status":200,"msg":"success","id":"1"}
     * @return_param status int 1：'200'删除成功;2："-1"删除失败
     * @remark 这里是备注信息
     * @number 1
     */
    public function del() {
        $this->purview_model->checkpurview(92);
        $id   = $this->input->get('id',TRUE);
        $data = $this->mysql_model->db_one(BOM_LOGORDER,'(PK_OL_ID= "'.$id.'")');
        if (count($data)>0) {
            $this->db->trans_begin();
            $b = $this->mysql_model->db_del(BOM_LOGORDER,'(PK_OL_ID= "'.$id.'")');
            $a = $this->mysql_model->db_del(LOGORDER_DETAIL,'(OL_ID= "'.$id.'")');
            if ($this->db->trans_status() === FALSE) {
                $this->db->trans_rollback();
                die('{"status":-1,"msg":"删除失败"}');
            } else {
                $this->db->trans_commit();
                $this->cache_model->delsome(BOM_LOGORDER);
                $this->cache_model->delsome(LOGORDER_DETAIL);
                $this->data_model->logs('删除物流订单：'.$data['PK_OL_ID']);
                die('{"status":200,"msg":"success"}');
            }
        }
        die('{"status":-1,"msg":"删除失败"}');
    }

}
