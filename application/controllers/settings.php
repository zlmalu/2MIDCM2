<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Settings extends CI_Controller {

    public function __construct(){
        parent::__construct();
		$this->load->model('config_model');
		$this->purview_model->checkpurview();
    }
	
	//系统参数
	public function parameter() {
	    $this->purview_model->checkpurview(81);
		$data = str_enhtml($this->input->post(NULL,TRUE));
		$info = array();
		if (is_array($data) && count($data)>0) {
            $this->load->model('data_model');

		    foreach ($data as $prarm => $val){
                $info[] = array('ParaName' =>$prarm, 'Value' => $val);
            }
            $sql = $this->mysql_model->db_upd(SYSTEM,$info,'ParaName');
            if($sql){//var_dump(pathinfo('/data'));exit();
                $config = file_get_contents("./config.php");
                foreach ($data as $prarm => $val){
                    $info = preg_replace("#define\(\"{$prarm}\",\".*?\"\)#","define(\"{$prarm}\",\"{$val}\")",$config);
                }
                file_put_contents("config.php",$info);
                $this->data_model->logs('修改了系统参数：'. json_encode($data,JSON_UNESCAPED_UNICODE));
                $this->cache_model->delsome(SYSTEM);
                die('{"status":200,"msg":"添加成功"}');
            }else{
                die('{"status":-1,"msg":"添加失败"}');
            }
		} else {
            $this->load->model('cache_model');
		    $data['list'] = $this->cache_model->load_data(SYSTEM,'(1=1) ');
		    $this->load->view('settings/parameter',$data);	
		}
	}
	
	//皮肤切换
	public function skins() {
		$skin = $this->input->get_post('skin',TRUE);
		$skin = $skin ? $skin : 'green';
		set_cookie('skin',$skin,120000);
		die('{"status":200,"msg":"success"}');
	}

	
	//供应商分类
	public function vendor_cate_manage() {
		$this->load->view('settings/vendor_cate_manage');	
	}
	
	//客户分类
	public function customer_cate_manage() {
		$this->load->view('settings/customer_cate_manage');	
	}
	
	//批量选择供应商 
	public function vendor_batch() {
		$this->load->view('settings/vendor_batch');	
	}

	//批量选择往来单位
    public function betweenUnit(){
        $this->load->view('settings/betweenUnit_batch');
    }

    //批量选择订单
    public function order(){
        $this->load->view('settings/order_batch');
    }
	
	//批量选择客户
	public function customer_batch() {
		$this->load->view('settings/customer_batch');	
	}
	
	//批量选择商品 
	public function goods_batch() {
		$this->load->view('settings/goods_batch');	
	}
    public function goods_templ_batch() {
        $this->load->view('settings/goods_templ_batch');
    }
    public function wptem_design_batch() {
        $this->load->view('settings/wptem_design_batch');
    }
	//物料管理
	public function goods_manage() {
        $data['type'] = $_GET['type'];
        $data['attrCount'] = 1;
        if($data['type'] == 'edit'){
            $attrStr = $_GET['attr'];
            $v = array();
            if (strlen($attrStr) > 0){
                $attrArr = json_decode(str_replace('_','"',$attrStr),true);
                foreach ($attrArr as $key => $val){
                    $v[] = array('attr' => $key, 'val' => $val);
                }
            }
            $data['attr'] = $v;
            $data['attrCount'] = count($v);
        }
		$this->load->view('settings/goods_manage',$data);
	}
	
	//结算方式选择
	public function settlement_manage() {
		$this->load->view('settings/settlement_manage');	
	}
	
	//供应商选择
	public function vendor_manage() {
		$this->load->view('settings/vendor_manage');	
	}
	
	//客户选择
	public function customer_manage() {
		$this->load->view('settings/customer_manage');	
	}

    public function bom_templ_manage() {
        $this->load->view('settings/bom_templ_manage');
    }
    public function matTem_Design_manage() {
        $this->load->view('settings/matTem_Design_manage');
    }
    public function wPCat_manage() {
        $this->load->view('settings/wPCat_manage');
    }

    public function matEst_manage() {
        $this->load->view('settings/matEst_manage');
    }
	//单位
	public function unit_manage() {
		$this->load->view('settings/unit_manage');	
	}

    //人员
    public function user_manage() {
        $this->load->view('settings/user_manage');
    }
	
	//高级查询
	public function other_search() {
		$this->load->view('settings/other_search');	
	}
	
	//单个库存查询
	public function inventory() {
		$this->load->view('settings/inventory');	
	}
	
	//选择客户
	public function select_customer() {
		$this->load->view('settings/select_customer');	
	}
	
	//选择供应商
	public function select_vendor() {
		$this->load->view('settings/select_vendor');	
	}

    //选择物流公司
    public function select_logistics() {
        $this->load->view('settings/select_logistics');
    }

    //选择销售单据列表
    public function invsa_batch() {
        $this->load->view('invsa/invsa_batch');
    }

    //查看销售单据的具体信息
    public function invsa_info() {
/*        $id = str_enhtml($this->input->get('id',TRUE));
        $this->load->model('data_model');
        $list = $this->data_model->invsa_info(' and (a.invsaid='.$id.')','order by id desc');
        foreach ($list as $arr=>$row) {
            $v[$arr]['invSpec']           = $row['spec'];
            $v[$arr]['taxRate']           = intval($row['id']);
            $v[$arr]['srcOrderEntryId']   = 0;
            $v[$arr]['srcOrderNo']        = NULL;
            $v[$arr]['locationId']        = 0;
            $v[$arr]['goods']             = $row['goodsno'].' '.$row['goodsname'].' '.$row['spec'];
            $v[$arr]['invName']           = $row['goodsname'];
            $v[$arr]['qty']               = (float)abs($row['qty']);
            $v[$arr]['locationName']      = '';
            $v[$arr]['amount']            = (float)abs($row['amount']);
            $v[$arr]['taxAmount']         = (float)abs($row['amount']);
            $v[$arr]['price']             = (float)$row['price'];
            $v[$arr]['tax']               = 0;
            $v[$arr]['mainUnit']          = $row['unitname'];
            $v[$arr]['deduction']         = (float)$row['deduction'];
            $v[$arr]['invId']             = intval($row['goodsid']);
            $v[$arr]['invNumber']         = $row['number'];
            $v[$arr]['discountRate']      = (float)$row['discountrate'];
            $v[$arr]['description']       = $row['description'];
            $v[$arr]['unitId']            = intval($row['unitid']);
            $v[$arr]['srcOrderId']        = 0;
        }*/
        $this->load->view('invsa/invsa_info');
    }

    //查看某个采购计划的信息
    public function purchasePlan_info(){
/*        $id = str_enhtml($this->input->get('id',TRUE));
        $this->load->model('data_model');
        $list = $this->data_model->purchasePlanInfo(' and (a.planId='.$id.')','order by a.id desc');
        foreach ($list as $arr=>$row) {
            $v[$arr]['planId']      = $row['planId'];
            $v[$arr]['goodsid']      = $row['goodsid'];
            $v[$arr]['goods_no']      = $row['goods_no'];
            $v[$arr]['create_time']           = $row['create_time'];
            $v[$arr]['qty']               = (float)abs($row['qty']);
            $v[$arr]['goodsName']      = $row['goodsName'];
            $v[$arr]['unitName']      = $row['unitName'];
        }*/
        $this->load->view('invpu/purchasePlan_info');
    }

    //查看购货单据的具体信息
    public function invpu_info(){
        $this->load->view('invpu/invpu_info');
    }

    //查看购货单的具体信息
    public function sheet_info(){
        $this->load->view('sheet/sheet_info');
    }

    //查看商品规格
    public function spec_info(){
        $attrStr = $_GET['attrStr'];
        $data = array();
        if(strlen($attrStr) >0){
            $attrArr = json_decode(str_replace('_','"',$attrStr),true);
            foreach ($attrArr as $key => $val){
                $data[] = array('attr' => $key, 'val' => $val);
            }
        }
        $result['data'] = $data;
        $this->load->view('bom/spec_info',$result);
    }
//查看商品规格
    public function spec_info1(){
        $F0 = str_replace('%2B','+',$_GET['F0']);
        $F1 = str_replace('%2B','+',$_GET['F1']);
        $F2 = str_replace('%2B','+',$_GET['F2']);
        $F3 = str_replace('%2B','+',$_GET['F3']);
        $F4 = str_replace('%2B','+',$_GET['F4']);
        $F5 = str_replace('%2B','+',$_GET['F5']);
        $F6 = str_replace('%2B','+',$_GET['F6']);
        $F7 = str_replace('%2B','+',$_GET['F7']);
        $F8 = str_replace('%2B','+',$_GET['F8']);
        $F9 = str_replace('%2B','+',$_GET['F9']);
        $F10 = str_replace('%2B','+',$_GET['F10']);
        $F11 = str_replace('%2B','+',$_GET['F11']);
        $F12 = str_replace('%2B','+',$_GET['F12']);
        $F13 = str_replace('%2B','+',$_GET['F13']);
        $F14 = str_replace('%2B','+',$_GET['F14']);
        $F15 = str_replace('%2B','+',$_GET['F15']);
        $F16 = str_replace('%2B','+',$_GET['F16']);
        $F17 = str_replace('%2B','+',$_GET['F17']);
        $F18 = str_replace('%2B','+',$_GET['F18']);
        $F19 = str_replace('%2B','+',$_GET['F19']);
        $data = array();
        $data[] = array('attr' => '函数1', 'val' => $F0);
        $data[] = array('attr' => '函数2', 'val' => $F1);
        $data[] = array('attr' => '函数3', 'val' => $F2);
        $data[] = array('attr' => '函数4', 'val' => $F3);
        $data[] = array('attr' => '函数5', 'val' => $F4);
        $data[] = array('attr' => '函数6', 'val' => $F5);
        $data[] = array('attr' => '函数7', 'val' => $F6);
        $data[] = array('attr' => '函数8', 'val' => $F7);
        $data[] = array('attr' => '函数9', 'val' => $F8);
        $data[] = array('attr' => '函数10', 'val' => $F9);
        $data[] = array('attr' => '函数11', 'val' => $F10);
        $data[] = array('attr' => '函数12', 'val' => $F11);
        $data[] = array('attr' => '函数13', 'val' => $F12);
        $data[] = array('attr' => '函数14', 'val' => $F13);
        $data[] = array('attr' => '函数15', 'val' => $F14);
        $data[] = array('attr' => '函数16', 'val' => $F15);
        $data[] = array('attr' => '函数17', 'val' => $F16);
        $data[] = array('attr' => '函数18', 'val' => $F17);
        $data[] = array('attr' => '函数19', 'val' => $F18);
        $data[] = array('attr' => '函数20', 'val' => $F19);
        $result['data'] = $data;
        $this->load->view('bom/spec_info',$result);
    }
    //查看商品规格
    public function spec_info2(){
        $F0 = $_GET['F0'];
        $F1 = $_GET['F1'];
        $F2 = $_GET['F2'];
        $F3 = $_GET['F3'];
        $F4 = $_GET['F4'];
        $F5 = $_GET['F5'];
        $F6 = $_GET['F6'];
        $F7 = $_GET['F7'];
        $F8 = $_GET['F8'];
        $F9 = $_GET['F9'];
        $F10 = $_GET['F10'];
        $Coef = $_GET['Coef'];
        $data = array();
        $data[] = array('attr' => '因子描述', 'val' => $Coef);
        $data[] = array('attr' => '因子1', 'val' => $F0);
        $data[] = array('attr' => '因子2', 'val' => $F1);
        $data[] = array('attr' => '因子3', 'val' => $F2);
        $data[] = array('attr' => '因子4', 'val' => $F3);
        $data[] = array('attr' => '因子5', 'val' => $F4);
        $data[] = array('attr' => '因子6', 'val' => $F5);
        $data[] = array('attr' => '因子7', 'val' => $F6);
        $data[] = array('attr' => '因子8', 'val' => $F7);
        $data[] = array('attr' => '因子9', 'val' => $F8);
        $data[] = array('attr' => '因子10', 'val' => $F9);
        $data[] = array('attr' => '因子11', 'val' => $F10);
        $result['data'] = $data;
        $this->load->view('bom/spec_info',$result);
    }
    //往来单位类别
    public function category_manage() {
        $this->load->view('settings/category_manage');
    }

    //工作中心
    public function workcenter_manage() {
        $this->load->view('settings/workcenter_manage');
    }

    //地区分类
    public function area_manage() {
        $this->load->view('settings/area_manage');
    }

    //部门
    public function department_manage() {
        $this->load->view('settings/department_manage');
    }

    //仓库
    public function stock_manage() {
        $this->load->view('settings/stock_manage');
    }

}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */
