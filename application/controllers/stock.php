<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Stock extends CI_Controller {

    public function __construct(){
        parent::__construct();
        $this->purview_model->checkpurview(124);
        $this->load->model('data_model');
        $this->load->model('mysql_model');
        $this->uid   = $this->session->userdata('uid');
    }

    public function index(){
        $this->load->view('stock/index');
    }

    public function add(){
        $this->load->view('stock/add');
    }

    /**
     * showdoc
     * @catalog 开发文档/仓库
     * @title 商品管理新增修改
     * @description 商品添加修改的接口
     * @method get
     * @url https://www.2midcm.com/goods/save
     * @param categoryName 必选 string 商品类别
     * @param unitName 必选 string 计量单位
     * @param name 可选 string 商品名称
     * @param number 可选 string 编号
     * @param quantity 可选 string 库存数量
     * @param remark 可选 string 备注
     * @param salePrice 可选 string 销售价格
     * @return {"status":200,"msg":"success"}
     * @return_param status string 1："200"新增或修改成功,2:"-1"新增或修改失败
     * @remark 这里是备注信息
     * @number 3
     */
    public function info(){
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
               // $v[$arr]['bomModel']           = $row['BOMModel'];
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

    public function save(){
        $act  = str_enhtml($this->input->get('act',TRUE));
        $id   = intval($this->input->post('id',TRUE));
        $data['Stock_Name'] = str_enhtml($this->input->post('name',TRUE));
        $data['Desc'] = str_enhtml($this->input->post('desc',TRUE));
        $data['Head_ID'] = intval(str_enhtml($this->input->post('head_id',TRUE)));
        if ($act=='add') {
            $this->purview_model->checkpurview(125);
            strlen($data['Stock_Name']) < 1 && die('{"status":-1,"msg":"名称不能为空"}');
            $this->mysql_model->db_count(STOCK,'(Stock_Name="'.$data['Stock_Name'].'")') > 0 && die('{"status":-1,"msg":"已存在该工作中心"}');
            $data['id'] = $this->mysql_model->db_inst(STOCK,$data);
            $data['headName'] = str_enhtml($this->input->post('head_name',TRUE));
            if ($data['id']) {
                $this->data_model->logs('新增仓库:'.$data['Stock_Name']);
                $this->cache_model->delsome(STOCK);
                die('{"status":200,"msg":"success","data":'.json_encode($data).'}');
            } else {
                die('{"status":-1,"msg":"添加失败"}');
            }
        } elseif ($act=='update') {
            $this->purview_model->checkpurview(126);
            strlen($data['Stock_Name']) < 1 && die('{"status":-1,"msg":"名称不能为空"}');
            $this->mysql_model->db_count(STOCK,'(PK_Stock_ID<>'.$id.') and (Stock_Name="'.$data['Stock_Name'].'")') > 0 && die('{"status":-1,"msg":"已存在该仓库"}');
            //$data['Modify_ID'] = $this->uid;
            //$data['Modify_Date'] = date('Y-m-d H:i:s',time());
            $sql = $this->mysql_model->db_upd(STOCK,$data,'(PK_Stock_ID='.$id.')');
            if ($sql) {
                $data['id'] = $id;
                $data['headName'] = str_enhtml($this->input->post('head_name',TRUE));
                $this->data_model->logs('修改仓库:'.$data['Stock_Name']);
                $this->cache_model->delsome(STOCK);
                die('{"status":200,"msg":"success","data":'.json_encode($data).'}');
            } else {
                die('{"status":-1,"msg":"修改失败"}');
            }
        }
    }

    public function lists() {
        $v = '';
        $data['status'] = 200;
        $data['msg']    = 'success';
        $skey   = str_enhtml($this->input->get('skey',TRUE));
        $page = max(intval($this->input->get_post('page',TRUE)),1);
        $rows = max(intval($this->input->get_post('rows',TRUE)),100);
        $where  = '';
        /*        if ($skey) {
                    $where .= ' and (PK_WC_ID like "%'.$skey.'%"' . ' or WC_Name like "%'.$skey.'%"' . ')';
                }*/

        $offset = $rows * ($page-1);
        $data['data']['page']      = $page;                                                      //当前页
        $data['data']['records']   = $this->cache_model->load_total(STOCK,'(1=1) '.$where.'');     //总条数
        $data['data']['total']     = ceil($data['data']['records']/$rows);                       //总分页数
        $list = $this->data_model->stockList($where, ' order by PK_Stock_ID desc limit '.$offset.','.$rows.'');
        // $list = $this->cache_model->load_data(WORK_CENTER,'(Status=1) '.$where.' order by PK_WC_ID desc limit '.$offset.','.$rows.'');
        foreach ($list as $arr=>$row) {
            $v[$arr]['id']           = intval($row['PK_Stock_ID']);
            $v[$arr]['Stock_Name']         = $row['Stock_Name'];
            $v[$arr]['Desc']       = $row['Desc'];
            $v[$arr]['headName']       = $row['headName'];
            $v[$arr]['Head_ID']       = $row['Head_ID'];
        }
        $data['data']['items']   = is_array($v) ? $v : '';
        $data['data']['totalsize']  = $this->cache_model->load_total(STOCK,'(1=1) '.$where.' order by PK_Stock_ID desc');
        die(json_encode($data));
    }



    //删除
    public function del(){
        $this->purview_model->checkpurview(127);
        $id = intval($this->input->post('id',TRUE));
        $data = $this->mysql_model->db_one(STOCK,'(PK_Stock_ID='.$id.')');
        if (count($data) > 0) {
            $this->mysql_model->db_count(BOM_STOCK,'(Stock_ID='.$id.')')>0 && die('{"status":-1,"msg":"发生业务不可删除"}');
            $sql = $this->mysql_model->db_del(STOCK,'(PK_Stock_ID='.$id.')');
            if ($sql) {
                $this->data_model->logs('删除仓库:ID='.$id.' 名称：'.$data['Stock_Name']);
                $this->cache_model->delsome(STOCK);
                die('{"status":200,"msg":"success"}');
            } else {
                die('{"status":-1,"msg":"修改失败"}');
            }
        }
    }

    //给仓库-物料管理用的物料接口
   /* public function bomList(){

        $list  = $this->cache_model->load_data(BOM_BASE,'');
        foreach ($list as $arr=>$row) {
            $v[$arr]['name']        = $row['BOMName'];
            $v[$arr]['id']      = intval($row['PK_BOM_ID']);
        }
        $data['data']['items']      = $v;
        die(json_encode($data));
    }

    public function stock_bomList(){
        $v = '';
        $data['status'] = 200;
        $data['msg']    = 'success';
        // $list = $this->data_model->workcenterList($where, ' order by PK_WC_ID desc limit '.$offset.','.$rows.'');
        $list1 = $this->cache_model->load_data(STOCK, '(1=1) order by PK_Stock_ID desc ');
        $list2 = $this->data_model->stock_bomList('and Stock_ID > 0');
        foreach ($list2 as $arr=>$row) {
            $v[$arr]['default'] = false;
            $v[$arr]['id']      = intval($row['BOM_ID']);
            $v[$arr]['pId']      = intval($row['Stock_ID']) + 10000;//将物料ID和仓库ID区分开
            $v[$arr]['name']    = $row['BOMName'];
            $v[$arr]['MInAccount']    = $row['MInAccount'];
            $v[$arr]['CostType']    = $row['CostType'];
        }

        foreach ($list1 as $row){
            $v[] = array(
                'default' => false,
                'id' => $row['PK_Stock_ID'] + 10000,
                'pId' => 0,
                'name' => $row['Stock_Name']
            );
        }
        $data['data']['items']   = is_array($v) ? $v : '';
        $data['data']['totalsize']  = $this->cache_model->load_total(BOM_STOCK);
        die(json_encode($data));
    }*/
    //新增、修改仓库-物料的关系
    public function bomsave(){
        $data = $this->input->post(NULL,TRUE);
        if($data['act'] == 'add'){
            $info = array('Stock_ID' => intval($data['pId']) - 10000,'MInAccount' => (float)$data['MInAccount'],'CostType' => $data['CostType']);
            $sql = $this->mysql_model->db_upd(BOM_STOCK,$info,'(BOM_ID='.$data['id'].')');
            if ($sql) {
               //$this->data_model->logs('新增物料:'.$data['Name']);
                $this->cache_model->delsome(BOM_STOCK);

                die('{"status":200,"msg":"success","data":'.json_encode($data).'}');
            } else {
                die('{"status":-1,"msg":"添加失败"}');
            }
        }else if($data['act'] == 'update'){
            $info = array('MInAccount' => (float)$data['MInAccount'],'CostType' => $data['CostType']);
            $sql = $this->mysql_model->db_upd(BOM_STOCK,$info,'(BOM_ID='.$data['id'].')');
            if ($sql) {
                //$this->data_model->logs('新增物料:'.$data['Name']);
                $this->cache_model->delsome(BOM_STOCK);

                die('{"status":200,"msg":"success","data":'.json_encode($data).'}');
            } else {
                die('{"status":-1,"msg":"修改失败"}');
            }
        }else if($data['act'] == 'del'){
            $info = array('Stock_ID' => 0);
            $sql = $this->mysql_model->db_upd(BOM_STOCK,$info,'(BOM_ID='.$data['id'].')');
            if ($sql) {
                //$this->data_model->logs('新增物料:'.$data['Name']);
                $this->cache_model->delsome(BOM_STOCK);

                die('{"status":200,"msg":"success"}');
            } else {
                die('{"status":-1,"msg":"添加失败"}');
            }
        }

    }


 public function doset(){

            $stockID = $this->input->get('stockID',TRUE);
            $act = $this->input->get('act',TRUE);
            $flag = $this->mysql_model->db_select(STOCK,'(flag=1)');

            if($act=="add"){
            if (count($flag)==0) {
                $data['flag']=1;
                           $sql = $this->mysql_model->db_upd(STOCK,$data,'(PK_Stock_ID="'.$stockID.'")');
        $data = "<?php if(!defined('BASEPATH')) exit('No direct script access allowed');define('STOCK_ID',$stockID);";
        $numbytes = file_put_contents("data/config/self_config.php", $data);
                $this->cache_model->delsome(STOCK);
                die('{"status":200,"data":{"userName":"'.$stockID.'"},"msg":"success"}');
            }

            }else if($act=="del"){
 $data['flag']=0;
                           $sql = $this->mysql_model->db_upd(STOCK,$data,'(PK_Stock_ID="'.$stockID.'")');
                $this->cache_model->delsome(STOCK);
        $data = "<?php if(!defined('BASEPATH')) exit('No direct script access allowed');define('STOCK_ID',1);";
        $numbytes = file_put_contents("data/config/self_config.php", $data);
                die('{"status":200,"data":{"userName":"'.$stockID.'"},"msg":"success"}');

} else {
                die('{"status":-1,"msg":"操作失败"}');
            }
        }
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */
