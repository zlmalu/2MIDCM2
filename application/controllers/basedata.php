<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Basedata extends CI_Controller {

    public function __construct(){
        parent::__construct();
		$this->purview_model->checkpurview();
		$this->load->model('data_model');
    }
	
	//main 统计
	public function main_data() {
	    $list = $this->data_model->inventory('','order by a.id desc');  
	    $qty = 0;  //库存数量
		$sum = 0;  //库存成本
		foreach($list as $arr=>$row) {
			$qty += $row['qty'];
			$sum += $row['puamount'];
		}
		
		$list1 = $this->data_model->customer_arrears('and month(billdate)='.date('m').'',' order by a.id');
		$list2 = $this->data_model->vendor_arrears('and month(billdate)='.date('m').'',' order by a.id');
		$arrears1  = 0;  //客户欠款
		$arrears2  = 0;  //供应商欠款
		foreach($list1 as $arr=>$row){
		    $arrears1   += $row['arrears'];
		}
		foreach($list2 as $arr=>$row){
		    $arrears2   += $row['arrears'];
		}
		
		$cost = 0;     //购货成本总额
		$list3 = $this->data_model->invsa_rate('and month(billdate)='.date('m').'','and month(a.billdate)='.date('m').'');
		foreach($list3 as $arr=>$row) {
			$cost += $row['pu_qty']*$row['price'];   //销售数量*采购单价=成购成本
		}
		
		
		$goodsnum = $this->data_model->goodsnum();   //采购商品种类数量
		$invpu    = $this->cache_model->load_sum(INVPU,'(1=1) and month(billdate)='.date('m').'',array('amount','arrears'));    
	    $invsa    = $this->cache_model->load_sum(INVSA,'(1=1) and month(billdate)='.date('m').'',array('amount','arrears'));   
		$puamount = $invpu ? $invpu['amount'] : 0;
		$saamount = $invsa ? $invsa['amount'] : 0;
		$pusarate = $saamount - $cost;
		
	    $data['status'] = 200;
		$data['msg']    = 'success';
		$data['data']['items']   = array(
										array('mod'=>'inventory','total1'=>str_money($qty),'total2'=>str_money($sum)),
										array('mod'=>'fund','total1'=>0,'total2'=>100),
										array('mod'=>'contact','total1'=>str_money($arrears1),'total2'=>str_money($arrears2)),
										array('mod'=>'sales','total1'=>str_money($saamount),'total2'=>str_money($pusarate)),
										array('mod'=>'purchase','total1'=>str_money($puamount),'total2'=>$goodsnum)
								);
		$data['data']['totalsize']     = 4;                       
		die(json_encode($data));
	}
    public function getAttr(){
	$id = $this->input->get_post('id',TRUE);
	$data = $this->mysql_model->db_one(MATTEMPLATE,'(PK_MT_ID="'.$id.'")');
	echo (json_encode(array("data"=>$data['Attr'])));
    }
    //物料接口
    public function goods() {
        $v = array();
        $data['status'] = 200;
        $data['msg']    = 'success';
        $page = max(intval($this->input->get_post('page',TRUE)),1);
        $rows = max(intval($this->input->get_post('rows',TRUE)),100);
        $skey = str_enhtml($this->input->get('skey',TRUE));
        $where = '';
        if ($skey) {
            $where .= ' and ( t.PK_BOM_ID like "%'.$skey.'%"' . ' or t.MTName like "%'.$skey.'%"' . ' or t.cat1Name like "%'.$skey.'%"' . ' or t.Name like "%'.$skey.'%"'. ' or t.cat2Name like "%'.$skey.'%" )';
        }
        $offset = $rows*($page-1);
        $data['data']['page']      = $page;                                                      //当前页
        $list = $this->data_model->bomBaseList($where, ' order by PK_BOM_ID desc limit '.$offset.','.$rows.'');
        foreach ($list as $key => &$val){
            $val['id'] = $val['PK_BOM_ID'];
            $val['attrStr'] = '';
            if(strlen($val['Attr']) > 0){
                $attr = explode('|',$val['Attr']);
                $attrArr = array();
                foreach ($attr as $k => $v){
                    $attrArr[$v] = $val['Attr'.$k];
                }
                if(count($attrArr) > 0){
                    $val['attrStr'] = str_replace('"','_',json_encode($attrArr,JSON_UNESCAPED_UNICODE));//双引号去到前端页面会出错，因此替换成下划线
                }
            }
        }

        $data['data']['records']   = count($list);//$this->cache_model->load_total(BOM_BASE,'(1=1)' . $where. '');   //总条数
        $data['data']['total']     = ceil($data['data']['records']/$rows);                       //总分页数
 
        $data['data']['rows']   = $list;
        die(json_encode($data));
    }

    //物料接口
    public function goodsTempl() {
        $v = array();
        $data['status'] = 200;
        $data['msg']    = 'success';
        $page = max(intval($this->input->get_post('page',TRUE)),1);
        $rows = max(intval($this->input->get_post('rows',TRUE)),100);
        $skey = str_enhtml($this->input->get('skey',TRUE));
        $categoryid   = intval($this->input->get('assistId',TRUE));
        $where = '';
        if ($skey) {
            $where .= ' where t.PK_BOM_ID like "%'.$skey.'%"' . ' or t.BOMModel like "%'.$skey.'%"' . ' or t.BOMName like "%'.$skey.'%" ';
        }
        if ($categoryid > 0) {
            $table = BOM_CATEGORY2;
            $key = 'PK_BOMCat_ID2';

            if($categoryid > 10000){ //category1
                $categoryid = $categoryid - 10000;
                $table = BOM_CATEGORY1;
                $key = 'PK_BOMCat_ID1';
            }

            $cid = $this->cache_model->load_data($table,'(1=1) and '.$key .'=' .$categoryid );
            if (count($cid)>0) {
                $key = $key == 'PK_BOMCat_ID1'? 'BOMCat_ID1' : 'BOMCat_ID2';
                $where .= ' and '. $key .'='.$categoryid;
            }
        }
        $offset = $rows*($page-1);
        $data['data']['page']      = $page;                                                      //当前页
        /*		$list = $this->cache_model->load_data(BOM_BASE,$where.' order by PK_BOM_ID desc limit '.$offset.','.$rows.'');*/
//        $list = $this->data_model->bomBaseList($where, ' order by PK_BOM_ID desc limit '.$offset.','.$rows.'');
           $list = array();
        $sql = 'select * from (select a.PK_MT_ID as PK_BOM_ID, a.Name as BOMName,a.Attr as BOMModel from t_'.MATTEMPLATE.' a)t '.$where.' ';
        $result = $this->db->query($sql);
//        foreach ($list as $key => &$val){
//            $val['id'] = $val['PK_BOM_ID'];
//            $val['attrStr'] = '';
//            if(strlen($val['BOMAttr']) > 0){
//                $attr = explode('|',$val['BOMAttr']);
//                $attrArr = array();
//                foreach ($attr as $k => $v){
//                    $attrArr[$v] = $val['BOMAttr'.$k];
//                }
//                if(count($attrArr) > 0){
//                    $val['attrStr'] = str_replace('"','_',json_encode($attrArr,JSON_UNESCAPED_UNICODE));//双引号去到前端页面会出错，因此替换成下划线
//                }
//            }
//        }
        foreach ($result->result() as $row){
            $arr = object_array($row);
            array_push($list,$arr);
//            $val['id'] = $arr['PK_WPTD_ID'];
//            $val['attrStr'] = '';
//            if(strlen($val['BOMAttr']) > 0){
//                $attr = explode('|',$val['BOMAttr']);
//                $attrArr = array();
//                foreach ($attr as $k => $v){
//                    $attrArr[$v] = $val['BOMAttr'.$k];
//                }
//                if(count($attrArr) > 0){
//                    $val['attrStr'] = str_replace('"','_',json_encode($attrArr,JSON_UNESCAPED_UNICODE));//双引号去到前端页面会出错，因此替换成下划线
//                }
//            }
        }
        $data['data']['records']   = count($list);//$this->cache_model->load_total(BOM_BASE,'(1=1)' . $where. '');   //总条数
        $data['data']['total']     = ceil($data['data']['records']/$rows);                       //总分页数

        $data['data']['rows']   = $list;
        die(json_encode($data));
    }
    public function wptemDesign() {
        $v = array();
        $data['status'] = 200;
        $data['msg']    = 'success';
        $page = max(intval($this->input->get_post('page',TRUE)),1);
        $rows = max(intval($this->input->get_post('rows',TRUE)),100);
        $skey = str_enhtml($this->input->get('skey',TRUE));
        $categoryid   = intval($this->input->get('assistId',TRUE));
        $where = '';
        if ($skey) {
            $where .= ' and ( PK_BOM_ID like "%'.$skey.'%"' . ' or BOMModel like "%'.$skey.'%"' . ' or BOMAttr like "%'.$skey.'%"' . ' or BOMName like "%'.$skey.'%" )';
        }
        if ($categoryid > 0) {
            $table = BOM_CATEGORY2;
            $key = 'PK_BOMCat_ID2';

            if($categoryid > 10000){ //category1
                $categoryid = $categoryid - 10000;
                $table = BOM_CATEGORY1;
                $key = 'PK_BOMCat_ID1';
            }

            $cid = $this->cache_model->load_data($table,'(1=1) and '.$key .'=' .$categoryid );
            if (count($cid)>0) {
                $key = $key == 'PK_BOMCat_ID1'? 'BOMCat_ID1' : 'BOMCat_ID2';
                $where .= ' and '. $key .'='.$categoryid;
            }
        }
        $offset = $rows*($page-1);
        $data['data']['page']      = $page;                                                      //当前页
        /*		$list = $this->cache_model->load_data(BOM_BASE,$where.' order by PK_BOM_ID desc limit '.$offset.','.$rows.'');*/
//        $list = $this->data_model->bomBaseList($where, ' order by PK_BOM_ID desc limit '.$offset.','.$rows.'');
        $list = array();
        $sql = "select a.PK_WPTD_ID as PK_BOM_ID, a.Name as BOMName,a.Desc as BOMModel from t_WPTem_Design a";
        $result = $this->db->query($sql);
//        foreach ($list as $key => &$val){
//            $val['id'] = $val['PK_BOM_ID'];
//            $val['attrStr'] = '';
//            if(strlen($val['BOMAttr']) > 0){
//                $attr = explode('|',$val['BOMAttr']);
//                $attrArr = array();
//                foreach ($attr as $k => $v){
//                    $attrArr[$v] = $val['BOMAttr'.$k];
//                }
//                if(count($attrArr) > 0){
//                    $val['attrStr'] = str_replace('"','_',json_encode($attrArr,JSON_UNESCAPED_UNICODE));//双引号去到前端页面会出错，因此替换成下划线
//                }
//            }
//        }
        foreach ($result->result() as $row){
            $arr = object_array($row);
            array_push($list,$arr);
//            $val['id'] = $arr['PK_WPTD_ID'];
//            $val['attrStr'] = '';
//            if(strlen($val['BOMAttr']) > 0){
//                $attr = explode('|',$val['BOMAttr']);
//                $attrArr = array();
//                foreach ($attr as $k => $v){
//                    $attrArr[$v] = $val['BOMAttr'.$k];
//                }
//                if(count($attrArr) > 0){
//                    $val['attrStr'] = str_replace('"','_',json_encode($attrArr,JSON_UNESCAPED_UNICODE));//双引号去到前端页面会出错，因此替换成下划线
//                }
//            }
        }
        $data['data']['records']   = count($list);//$this->cache_model->load_total(BOM_BASE,'(1=1)' . $where. '');   //总条数
        $data['data']['total']     = ceil($data['data']['records']/$rows);                       //总分页数

        $data['data']['rows']   = $list;
        die(json_encode($data));
    }
	//商品名称重复检验接口
	public function goods_checkname() {
	    $name = str_enhtml($this->input->post('bomName',TRUE));
	    $this->cache_model->load_total(BOM_BASE,'(BOMName="'.$name.'")') > 0 && die('{"status":-1,"msg":"商品名称重复"}');
	    die('{"status":200,"msg":"success"}');
	}
	
	//商品编号检验接口
	public function goods_getnextno() {
	    $skey = str_enhtml($this->input->post('skey',TRUE));
	    $this->cache_model->load_total(BOM_BASE,'(PK_BOM_ID="'.$skey.'")') > 0 && die('{"status":-1,"msg":"商品编号重复"}');
		die('{"status":200,"msg":"success","data":{"number":""}}');
	}
	
	//商品ID查询接口
	public function goods_query() {
	    $id = intval($this->input->post('id',TRUE));
	    $data = $this->cache_model->load_one(GOODS,'(id='.$id.')');
		if (count($data)>0) {
			$info['id']          = intval($data['id']);
			$info['count']       = 0;
			$info['name']        = $data['name'];
			$info['spec1']        = $data['spec1'] = '规格111';
            $info['spec2']        = $data['spec2'] = '规格222';
            $info['spec3']        = $data['spec3'] = '规格333';
            $info['spec4']        = $data['spec4'] = '规格444';
            $info['spec5']        = $data['spec5'] = '规格555';
            $info['spec6']        = $data['spec6'] = '规格666';
            $info['spec7']        = $data['spec7'] = '规格777';
            $info['spec8']        = $data['spec8'] = '规格888';
            $info['spec9']        = $data['spec9'] = '规格999';
            $info['spec10']        = $data['spec10'] = '规格000';
			$info['number']      = $data['number'];
			$info['salePrice']   = $data['saleprice'];
			$info['purPrice']    = $data['purprice'];
			$info['unitTypeId']  = 0;
			$info['baseUnitId']     = intval($data['unitid']);
			$info['assistIds']      = 0;
			$info['assistName']     = 0;
			$info['assistUnit']     = 0;
			$info['remark']         =  $data['remark'];
			$info['categoryName']   =  $data['categoryname'];
			$info['categoryId']     = intval($data['categoryid']);
			$info['unitId']       = intval($data['unitid']);
			$info['quantity']     = (float)$data['quantity'];
			$info['unitCost']     = (float)$data['unitcost'];
			$info['amount']       = (float)$data['amount'];
			die('{"status":200,"msg":"success","data":'.json_encode($info).'}');
		}
	}
	
	//分类接口（提供给采购、报价、销售弹框用）
	public function category() {
	    $data['status'] = 200;
		$data['msg']    = 'success';
		//$where = 'PK_BOMCat_ID1 in (0,1)';
		//$cat1  = $this->cache_model->load_data(BOM_CATEGORY1,$where);
		$cat2 = $this->cache_model->load_data(BOM_CATEGORY2,'','*');
        $v = array();
        /*foreach ($cat1 as $arr=>$row) {
            $v[$arr]['coId']     = 0;
            $v[$arr]['detail']   = false;
            $v[$arr]['id']       = intval($row['PK_BOMCat_ID1']) + 10000;//避免和下面cat2的id冲突，因此加10000
            $v[$arr]['level']    = 1;
            $v[$arr]['name']     = $row['Name'];
            $v[$arr]['parentId'] = 0;
            $v[$arr]['remark']   = '';
            $v[$arr]['sortIndex'] = 0;
            $v[$arr]['status'] = 0;
            $v[$arr]['uuid'] = '';
        }*/
        $size = count($v);
		foreach ($cat2 as $arr=>$row) {
		    $key = $size + $arr;
		    $v[$key]['coId']     = 0;
			$v[$key]['detail']   = true;
			$v[$key]['id']       = intval($row['PK_BOMCat_ID2']);
			$v[$key]['level']    = 2;
			$v[$key]['name']     = $row['Name'];
		//	$v[$key]['parentId'] = intval($row['PK_BOMCat_ID1']) + 10000;
			$v[$key]['remark']   = '';
			$v[$key]['sortIndex'] = 0;
			$v[$key]['status'] = 0;
			$v[$key]['uuid'] = '';
		}
		$data['data']['items']      = is_array($v) ? $v : '';//echo json_encode($data);exit;
		die(json_encode(array("msg"=>"success")));
		//die(json_encode($data));
	}

    public function category1() {
        $data['status'] = 200;
        $data['msg']    = 'success';
        $where = '';
        $v=array();
        $pid  = $this->cache_model->load_data(BOM_CATEGORY1,'(status=1) '.$where.' order by PK_BOMCat_ID1','pid');
        $list = $this->cache_model->load_data(BOM_CATEGORY1,'(status=1)'.$where.' order by path');
        foreach ($list as $arr=>$row) {
            $v[$arr]['coId']     = 0;
            $v[$arr]['detail']   = in_array($row['PK_BOMCat_ID1'],$pid) ? false : true;
            $v[$arr]['id']       = intval($row['PK_BOMCat_ID1']);
            $v[$arr]['level']    = $row['depth'];
            $v[$arr]['Name']     = $row['Name'];
            $v[$arr]['bom_id']     = $row['bom_id'];
            $v[$arr]['parentId'] = intval($row['pid']);
            $v[$arr]['remark']   = '';
            $v[$arr]['sortIndex'] = 0;
            $v[$arr]['status'] = 0;
//            $v[$arr]['typeNumber'] = $row['type'];
            $v[$arr]['uuid'] = '';
        }
        $data['data']['items']      = is_array($v) ? $v : '';
        $data['data']['totalsize']  = $this->cache_model->load_total(BOM_CATEGORY1,'(1=1) '.$where.'');
        die(json_encode($data));
    }




	
	//类别3种接口
	public function category_type() {
	    $list = $this->cache_model->load_data(CATEGORY_TYPE,'(1=1) order by id'); 
		$v = array(); 
		$data['status'] = 200;
		$data['msg']    = 'success'; 
		foreach ($list as $arr=>$row) {
		    $v[$arr]['id']      = intval($row['id']);
			$v[$arr]['name']    = $row['name'];
			$v[$arr]['number']  = $row['number'];
		}
		$data['data']['items']      = is_array($v) ? $v : '';
		$data['data']['totalsize']  = $this->cache_model->load_total(CATEGORY_TYPE);
	    die(json_encode($data));
	}
	
    //单位接口
	public function unit() {
	    $v = '';
	    $data['status'] = 200;
		$data['msg']    = 'success'; 
		$list = $this->cache_model->load_data(UNIT,'(status=1) order by id desc');  
		foreach ($list as $arr=>$row) {
		    $v[$arr]['default'] = false;
			$v[$arr]['guid']    = false;
			$v[$arr]['id']      = intval($row['id']);
			$v[$arr]['name']    = $row['name'];
			$v[$arr]['rate']    = 0;
			$v[$arr]['isdelete']   = 0;
			$v[$arr]['unitTypeId'] = 0;
		}
		$data['data']['items']   = is_array($v) ? $v : '';
		$data['data']['totalsize']  = $this->cache_model->load_total(UNIT);
		die(json_encode($data));
	}

//仓库接口
    public function storehouse() {
        $v = '';
        $data['status'] = 200;
        $data['msg']    = 'success';
        $list = $this->cache_model->load_data(STOCK,'');
        foreach ($list as $arr=>$row) {
            $v[$arr]['default'] = false;
            $v[$arr]['guid']    = false;
            $v[$arr]['id']      = intval($row['PK_Stock_ID']);
            $v[$arr]['name']    = $row['Stock_Name'];
            $v[$arr]['rate']    = 0;
            $v[$arr]['isdelete']   = 0;
            $v[$arr]['unitTypeId'] = 0;
        }
        $data['data']['items']   = is_array($v) ? $v : '';
        $data['data']['totalsize']  = $this->cache_model->load_total(UNIT);
        die(json_encode($data));
    }

    //人员接口
    public function user() {
        $v = '';
        $where='';
        $data['status'] = 200;
        $data['msg']    = 'success';
        $list = $this->data_model->userList($where,'order by PK_User_ID desc');
        foreach ($list as $arr=>$row) {
            $v[$arr]['default'] = false;
            $v[$arr]['guid']    = false;
            $v[$arr]['PK_User_ID']      = intval($row['PK_User_ID']);
            $v[$arr]['Username']    = $row['Username'];
            $v[$arr]['Status']    = $row['Status'];
            $v[$arr]['StatusName']    = $row['Status'] == 1 ? '正常' : '不正常';
            $v[$arr]['deptName']    = $row['deptName'];
//            $v[$arr]['User']    = $row['Username'];
            $v[$arr]['rate']    = 0;
            $v[$arr]['isdelete']   = 0;
            $v[$arr]['unitTypeId'] = 0;
        }
        $data['data']['items']   = is_array($v) ? $v : '';
        $data['data']['totalsize']  = $this->cache_model->load_total(USER);
        die(json_encode($data));
    }
	
	//客户、供应商接口
	public function contact() {
	    $v = '';
	    $data['status'] = 200;
		$data['msg']    = 'success'; 
		$type   = intval($this->input->get('type',TRUE));
		$skey   = str_enhtml($this->input->get('skey',TRUE));
		$page = max(intval($this->input->get_post('page',TRUE)),1);
		$rows = max(intval($this->input->get_post('rows',TRUE)),100);
		$where  = '';
		if ($skey) {
			$where .= ' and (Linkmans like "%'.$skey.'%"' . ' or a.Name like "%'.$skey.'%"' . ' or PK_BU_ID like "%'.$skey.'%"' . ')';
		}
		if ($type) {
		    if($type == 4){
                $where .= ' and BU_Cat = 4 and Status = 1';
            }else{
                $where .= ' and BU_Cat IN ('.$type.',3) and Status = 1';//有type证明是选择供应商/客户，此时不展示不正常数据
            }
		}
		$offset = $rows * ($page-1);
		$data['data']['page']      = $page;                                                      //当前页

		//$list = $this->cache_model->load_data(BETWEENUNIT,'(Status=1) '.$where.' order by PK_BU_ID desc limit '.$offset.','.$rows.'');
        $list = $this->data_model->betweenunitList($where, ' order by PK_BU_ID desc limit '.$offset.','.$rows.'');
        $data['data']['records']   = count($list);//$this->cache_model->load_total(BETWEENUNIT,'(1=1) '.$where.'');     //总条数
        $data['data']['total']     = ceil($data['data']['records']/$rows);                       //总分页数
		foreach ($list as $arr=>$row) {
		    $v[$arr]['id']           = intval($row['PK_BU_ID']);
			$v[$arr]['name']         = $row['Name'];
			$v[$arr]['beginDate']    = 1409500800000;
			$v[$arr]['remark']       = $row['Desc'];
			$v[$arr]['links'] = '';
			$v[$arr]['Taxrate'] = (float)$row['Taxrate'] * 100;//对外展示百分数，因此*100
            $v[$arr]['Industry'] = $row['industry'];
			$v[$arr]['Area'] = $row['area'];
            $v[$arr]['Industry_ID'] = $row['Industry_ID'];
            $v[$arr]['Area_ID'] = $row['Area_ID'];
			$v[$arr]['BU_Cat_Name'] = $row['BU_Cat'] == 1 ? '客户' : ($row['BU_Cat'] == 2 ? '厂家' : ($row['BU_Cat'] == 3 ? '客户兼厂家' : '第三方'));
            $v[$arr]['BU_Cat'] = $row['BU_Cat'];
			$v[$arr]['StatusName'] = $row['Status'] == 0 ? '不正常' : '正常';
            $v[$arr]['Status'] = $row['Status'];

			if (strlen($row['Linkmans'])>0) {                             //获取首个联系人
                $list = (array)json_decode($row['Linkmans']);
                if (count($list) > 0){
                    foreach ($list as $arr1 => $row1) {
                            $v[$arr]['telephone'] = $row1->linkPhone;
                    }
            }
		    }
		}
		$data['data']['rows']   = is_array($v) ? $v : '';
		//$data['data']['totalsize']  = $this->cache_model->load_total(BETWEENUNIT, $where.' order by PK_BU_ID desc');
		die(json_encode($data));
	}

    public function bom_templ_init() {
        $v = '';
        $data['status'] = 200;
        $data['msg']    = 'success';
        $type   = intval($this->input->get('type',TRUE));
        $skey   = str_enhtml($this->input->get('skey',TRUE));
        $page = max(intval($this->input->get_post('page',TRUE)),1);
        $rows = max(intval($this->input->get_post('rows',TRUE)),100);
        $where  = '';
        if ($skey) {
            $where .= ' and (b.Name like "%'.$skey.'%"' . ' or a.Name like "%'.$skey.'%"' .' or c.Name like "%'.$skey.'%"'. ' or PK_MT_ID like "%'.$skey.'%"' . ')';
        }
        if ($type) {
            if($type == 4){
                $where .= ' and BU_Cat = 4 and Status = 1';
            }else{
                $where .= ' and BU_Cat IN ('.$type.',3) and Status = 1';//有type证明是选择供应商/客户，此时不展示不正常数据
            }
        }
        $offset = $rows * ($page-1);
        $data['data']['page']      = $page;                                                      //当前页

        //$list = $this->cache_model->load_data(BETWEENUNIT,'(Status=1) '.$where.' order by PK_BU_ID desc limit '.$offset.','.$rows.'');
        $list = $this->data_model->MatTemplateList($where,'');
        $data['data']['records']   = count($list);//$this->cache_model->load_total(BETWEENUNIT,'(1=1) '.$where.'');     //总条数
        $data['data']['total']     = ceil($data['data']['records']/$rows);                       //总分页数
//        foreach ($list as $arr=>$row) {
//            $v[$arr]['id']           = intval($row['PK_BU_ID']);
//            $v[$arr]['name']         = $row['Name'];
//            $v[$arr]['beginDate']    = 1409500800000;
//            $v[$arr]['remark']       = $row['Desc'];
//            $v[$arr]['links'] = '';
//            $v[$arr]['Taxrate'] = (float)$row['Taxrate'] * 100;//对外展示百分数，因此*100
//            $v[$arr]['Industry'] = $row['industry'];
//            $v[$arr]['Area'] = $row['area'];
//            $v[$arr]['Industry_ID'] = $row['Industry_ID'];
//            $v[$arr]['Area_ID'] = $row['Area_ID'];
//            $v[$arr]['BU_Cat_Name'] = $row['BU_Cat'] == 1 ? '客户' : ($row['BU_Cat'] == 2 ? '厂家' : ($row['BU_Cat'] == 3 ? '客户兼厂家' : '第三方'));
//            $v[$arr]['BU_Cat'] = $row['BU_Cat'];
//            $v[$arr]['StatusName'] = $row['Status'] == 0 ? '不正常' : '正常';
//            $v[$arr]['Status'] = $row['Status'];
//
//            if (strlen($row['Linkmans'])>0) {                             //获取首个联系人
//                $list = (array)json_decode($row['Linkmans']);
//                if (count($list) > 0){
//                    foreach ($list as $arr1 => $row1) {
//                        //  if ($row1->linkFirst == 1) {
//                        // $v[$arr]['contacter'] = $row1->linkName;
//                        //  $v[$arr]['mobile'] = $row1->linkMobile;
//                        $v[$arr]['telephone'] = $row1->linkPhone;
//                        // $v[$arr]['linkIm'] = $row1->linkIm;
//                        //  $v[$arr]['firstLink']['first'] = $row1->linkFirst;
//                        /*                            if ($type == 1) {//客户
//                                                        $v[$arr]['deliveryAddress'] = isset($row1->linkAddress) ? $row1->linkAddress : '';
//                                                    }*/
//                        //   }
//                    }
//                }
//            }
//        }
        $data['data']['rows']   = $list;
        //$data['data']['totalsize']  = $this->cache_model->load_total(BETWEENUNIT, $where.' order by PK_BU_ID desc');
        die(json_encode($data));
    }

    public function wPCAT_init() {
        $v = '';
        $data['status'] = 200;
        $data['msg']    = 'success';
        $type   = intval($this->input->get('type',TRUE));
        $skey   = str_enhtml($this->input->get('skey',TRUE));
        $page = max(intval($this->input->get_post('page',TRUE)),1);
        $rows = max(intval($this->input->get_post('rows',TRUE)),100);
        $where  = '';
        if ($skey) {
            $where .= ' and a.PK_WPCat_ID like "%'.$skey.'%" or a.Name like "%'.$skey.'%"';
        }
        if ($type) {
            if($type == 4){
                $where .= ' and BU_Cat = 4 and Status = 1';
            }else{
                $where .= ' and BU_Cat IN ('.$type.',3) and Status = 1';//有type证明是选择供应商/客户，此时不展示不正常数据
            }
        }
        $offset = $rows * ($page-1);
        $data['data']['page']      = $page;                                                      //当前页

        //$list = $this->cache_model->load_data(BETWEENUNIT,'(Status=1) '.$where.' order by PK_BU_ID desc limit '.$offset.','.$rows.'');
        $list = $this->data_model->wPCatList($where,'');
       // foreach ($result1->result() as $row)
       // {
        //    $arr = object_array($row);
         //   array_push($list,$arr);
        //}
        $data['data']['records']   = count($list);//$this->cache_model->load_total(BETWEENUNIT,'(1=1) '.$where.'');     //总条数
        $data['data']['total']     = ceil($data['data']['records']/$rows);                       //总分页数
//        foreach ($list as $arr=>$row) {
//            $v[$arr]['id']           = intval($row['PK_BU_ID']);
//            $v[$arr]['name']         = $row['Name'];
//            $v[$arr]['beginDate']    = 1409500800000;
//            $v[$arr]['remark']       = $row['Desc'];
//            $v[$arr]['links'] = '';
//            $v[$arr]['Taxrate'] = (float)$row['Taxrate'] * 100;//对外展示百分数，因此*100
//            $v[$arr]['Industry'] = $row['industry'];
//            $v[$arr]['Area'] = $row['area'];
//            $v[$arr]['Industry_ID'] = $row['Industry_ID'];
//            $v[$arr]['Area_ID'] = $row['Area_ID'];
//            $v[$arr]['BU_Cat_Name'] = $row['BU_Cat'] == 1 ? '客户' : ($row['BU_Cat'] == 2 ? '厂家' : ($row['BU_Cat'] == 3 ? '客户兼厂家' : '第三方'));
//            $v[$arr]['BU_Cat'] = $row['BU_Cat'];
//            $v[$arr]['StatusName'] = $row['Status'] == 0 ? '不正常' : '正常';
//            $v[$arr]['Status'] = $row['Status'];
//
//            if (strlen($row['Linkmans'])>0) {                             //获取首个联系人
//                $list = (array)json_decode($row['Linkmans']);
//                if (count($list) > 0){
//                    foreach ($list as $arr1 => $row1) {
//                        //  if ($row1->linkFirst == 1) {
//                        // $v[$arr]['contacter'] = $row1->linkName;
//                        //  $v[$arr]['mobile'] = $row1->linkMobile;
//                        $v[$arr]['telephone'] = $row1->linkPhone;
//                        // $v[$arr]['linkIm'] = $row1->linkIm;
//                        //  $v[$arr]['firstLink']['first'] = $row1->linkFirst;
//                        /*                            if ($type == 1) {//客户
//                                                        $v[$arr]['deliveryAddress'] = isset($row1->linkAddress) ? $row1->linkAddress : '';
//                                                    }*/
//                        //   }
//                    }
//                }
//            }
//        }
        $data['data']['rows']   = $list;
        //$data['data']['totalsize']  = $this->cache_model->load_total(BETWEENUNIT, $where.' order by PK_BU_ID desc');
        die(json_encode($data));
    }

    public function matEst_init() {
        $v = '';
        $data['status'] = 200;
        $data['msg']    = 'success';
        $type   = intval($this->input->get('type',TRUE));
        $skey   = str_enhtml($this->input->get('skey',TRUE));
        $page = max(intval($this->input->get_post('page',TRUE)),1);
        $rows = max(intval($this->input->get_post('rows',TRUE)),100);
        $where  = '';
        if ($skey) {
            $where .= ' where a.PK_WPCat_ID like "%'.$skey.'%" or a.Name like "%'.$skey.'%"';
        }
        if ($type) {
            if($type == 4){
                $where .= ' and BU_Cat = 4 and Status = 1';
            }else{
                $where .= ' and BU_Cat IN ('.$type.',3) and Status = 1';//有type证明是选择供应商/客户，此时不展示不正常数据
            }
        }
        $offset = $rows * ($page-1);
        $data['data']['page']      = $page;                                                      //当前页

        //$list = $this->cache_model->load_data(BETWEENUNIT,'(Status=1) '.$where.' order by PK_BU_ID desc limit '.$offset.','.$rows.'');
        $sql = "select a.Date ,b.BOMName,a.AmOfDem,a.AmOfSto,a.AmOfPro,a.AmOfPur from t_MatEst a left join  t_bom_base b on a.BOM_ID=b.PK_BOM_ID $where ";
        $result1 = $this->db->query($sql);
        $list= array();
        foreach ($result1->result() as $row)
        {
            $arr = object_array($row);
            array_push($list,$arr);
        }
        $data['data']['records']   = count($list);//$this->cache_model->load_total(BETWEENUNIT,'(1=1) '.$where.'');     //总条数
        $data['data']['total']     = ceil($data['data']['records']/$rows);                       //总分页数
//        foreach ($list as $arr=>$row) {
//            $v[$arr]['id']           = intval($row['PK_BU_ID']);
//            $v[$arr]['name']         = $row['Name'];
//            $v[$arr]['beginDate']    = 1409500800000;
//            $v[$arr]['remark']       = $row['Desc'];
//            $v[$arr]['links'] = '';
//            $v[$arr]['Taxrate'] = (float)$row['Taxrate'] * 100;//对外展示百分数，因此*100
//            $v[$arr]['Industry'] = $row['industry'];
//            $v[$arr]['Area'] = $row['area'];
//            $v[$arr]['Industry_ID'] = $row['Industry_ID'];
//            $v[$arr]['Area_ID'] = $row['Area_ID'];
//            $v[$arr]['BU_Cat_Name'] = $row['BU_Cat'] == 1 ? '客户' : ($row['BU_Cat'] == 2 ? '厂家' : ($row['BU_Cat'] == 3 ? '客户兼厂家' : '第三方'));
//            $v[$arr]['BU_Cat'] = $row['BU_Cat'];
//            $v[$arr]['StatusName'] = $row['Status'] == 0 ? '不正常' : '正常';
//            $v[$arr]['Status'] = $row['Status'];
//
//            if (strlen($row['Linkmans'])>0) {                             //获取首个联系人
//                $list = (array)json_decode($row['Linkmans']);
//                if (count($list) > 0){
//                    foreach ($list as $arr1 => $row1) {
//                        //  if ($row1->linkFirst == 1) {
//                        // $v[$arr]['contacter'] = $row1->linkName;
//                        //  $v[$arr]['mobile'] = $row1->linkMobile;
//                        $v[$arr]['telephone'] = $row1->linkPhone;
//                        // $v[$arr]['linkIm'] = $row1->linkIm;
//                        //  $v[$arr]['firstLink']['first'] = $row1->linkFirst;
//                        /*                            if ($type == 1) {//客户
//                                                        $v[$arr]['deliveryAddress'] = isset($row1->linkAddress) ? $row1->linkAddress : '';
//                                                    }*/
//                        //   }
//                    }
//                }
//            }
//        }
        $data['data']['rows']   = $list;
        //$data['data']['totalsize']  = $this->cache_model->load_total(BETWEENUNIT, $where.' order by PK_BU_ID desc');
        die(json_encode($data));
    }

    //客户、供应商ID查询接口
	public function contact_query() {
	    $id   = intval($this->input->post('id',TRUE));
		$type = intval($this->input->get('type',TRUE));
	    $data = $this->cache_model->load_one(BETWEENUNIT,'(PK_BU_ID='.$id.')');
		if (count($data)>0) {
			$info['id']          = intval($data['PK_BU_ID']);
			$info['Industry_ID']   = intval($data['Industry_ID']);
			//$info['number']      = $data['number'];
			$info['name']        = $data['Name'];
			//$info['beginDate']   = $data['beginDate'];
			$info['Area_ID']      = $data['Area_ID'];
			$info['Taxrate'] = (float)$data['Taxrate'];
            $info['BU_Cat'] = (float)$data['BU_Cat'];
			$info['remark']      = $data['Desc'];
			$info['links']['phone'] = '';
		    if (strlen($data['Linkmans'])>0) {                               //获取首个联系人
                $list = (array)json_decode($data['Linkmans']);
                if(count($list) > 0){
                foreach ($list as $arr => $row) {
                    /*					$info['links'][$arr]['name']        = $row->linkName;
                                        $info['links'][$arr]['mobile']      = $row->linkMobile;
                                        $info['links'][$arr]['phone']       = $row->linkPhone;
                                        $info['links'][$arr]['im']          = $row->linkIm;
                                        $info['links'][$arr]['first']       = $row->linkFirst==1 ? true : false;
                                        if ($type==1) {
                                            $info['links'][$arr]['address'] = $row->linkAddress;
                                        }*/
                    $info['links']['phone'] = $row->linkPhone;
                }
            }
		    }
		    unset($data['linkmans']);
			die('{"status":200,"msg":"success","data":'.json_encode($info).'}');
		}
	}
	
    //客户、供应商编号验证接口
	public function contact_getnextno() {
	    $type = intval($this->input->get('type',TRUE));
	    $skey = str_enhtml($this->input->post('skey',TRUE));
		!in_array($type,array(1,2)) && die('{"status":-1,"msg":"参数错误"}'); 
	    $this->cache_model->load_total(CONTACT,'(type='.$type.') and (number="'.$skey.'")') > 0 && die('{"status":-1,"msg":"客户名称重复"}'); 
		die('{"status":200,"msg":"success","data":{"number":""}}');
	}
	
	//客户、供应商名称验证接口
	public function contact_checkname() {
	    $id   = intval($this->input->post('id',TRUE));
		$type = intval($this->input->get('type',TRUE));
	    $name = str_enhtml($this->input->post('name',TRUE));
		//!in_array($type,array(1,2)) && die('{"status":-1,"msg":"参数错误"}');
		if ($id > 0) {
		    $this->cache_model->load_total(BETWEENUNIT,'(PK_BU_ID<>'.$id.') and (Name="'.$name.'")') > 0 && die('{"status":-1,"msg":"客户名称重复"}');
		} else {
		    $this->cache_model->load_total(BETWEENUNIT,'(Name="'.$name.'")') > 0 && die('{"status":-1,"msg":"客户名称重复"}');
		} 
	    die('{"status":200,"msg":"success"}');
	}

    public function logs() {
        $v = array();
        $data['status'] = 200;
        $data['msg']    = 'success';
        $stt  = str_enhtml($this->input->get('fromDate',TRUE));
        $ett  = str_enhtml($this->input->get('toDate',TRUE));
        $page = max(intval($this->input->get_post('page',TRUE)),1);
        $rows = max(intval($this->input->get_post('rows',TRUE)),100);
        $skey   = str_enhtml($this->input->get('skey',TRUE));
        $user   = str_enhtml($this->input->get('user',TRUE));
        $where = '';
            if ($user) {
                 $where .= ' and b.Username like "%'.$user.'%"';
              }
        if ($stt) {
            $where .= ' and Log_Date>="'.$stt.'"';
        }
        if ($ett) {
            $where .= ' and Log_Date<="'.$ett.' 23:59:59"';
        }
        $offset = $rows*($page-1);
        $data['data']['page']      = $page;                                                      //当前页
        $list = $this->data_model->logList($where, ' order by Log_Date desc');
        $data['data']['records']   =count($list);// $this->cache_model->load_total(LOGBOOK,'(1=1) '.$where.'');     //总条数
        $data['data']['total']     = ceil($data['data']['records']/$rows);                       //总分页数
        foreach ($list as $arr=>$row) {
            $v[$arr]['id']              = intval($row['PK_Log_ID']);
            $v[$arr]['name']            = $row['username'];
            $v[$arr]['loginName']       = $row['username'];
            //$v[$arr]['operateTypeName'] = $row['name'];
            $v[$arr]['operateType']     = 255;
            $v[$arr]['userId']          = $row['FK_Operator_ID'];
            $v[$arr]['Action']             = $row['Action'];
            $v[$arr]['Log_Date']      = $row['Log_Date'];
        }
        $data['data']['rows']   = $v;
        die(json_encode($data));
    }
//
//    //操作日志接口
//    public function logs() {
//        $v = array();
//        $data['status'] = 200;
//        $data['msg']    = 'success';
//        $stt  = str_enhtml($this->input->get('fromDate',TRUE));
//        $ett  = str_enhtml($this->input->get('toDate',TRUE));
//        $page = max(intval($this->input->get_post('page',TRUE)),1);
//        $rows = max(intval($this->input->get_post('rows',TRUE)),100);
//        $skey   = str_enhtml($this->input->get('skey',TRUE));
//        $user   = str_enhtml($this->input->get('user',TRUE));
//        $where = '';
//        /*		if ($user) {
//                    $where .= ' and username="'.$user.'"';
//                }*/
//        if ($stt) {
//            $where .= ' and Log_Date>="'.$stt.'"';
//        }
//        if ($ett) {
//            $where .= ' and Log_Date<="'.$ett.' 23:59:59"';
//        }
//        $offset = $rows*($page-1);
//        $data['data']['page']      = $page;                                                      //当前页
//        $data['data']['records']   = $this->cache_model->load_total(LOGBOOK,'(1=1) '.$where.'');     //总条数
//        $data['data']['total']     = ceil($data['data']['records']/$rows);                       //总分页数
//        $list = $this->data_model->logList($where, ' order by Log_Date desc');
//        foreach ($list as $arr=>$row) {
//            $v[$arr]['id']              = intval($row['PK_Log_ID']);
//            $v[$arr]['name']            = $row['username'];
//            $v[$arr]['loginName']       = $row['username'];
//            //$v[$arr]['operateTypeName'] = $row['name'];
//            $v[$arr]['operateType']     = 255;
//            $v[$arr]['userId']          = $row['FK_Operator_ID'];
//            $v[$arr]['log']             = $row['Action'];
//            $v[$arr]['modifyTime']      = $row['Log_Date'];
//        }
//        $data['data']['rows']   = $v;
//        die(json_encode($data));
//    }


    //地区分类
    public function getAreaName(){
	$upNameArr1 = $this->mysql_model->db_select(AREA,'(level = 1)','Name');
	$upNameArr2 = $this->mysql_model->db_select(AREA,'(level = 2)','Name');
	echo json_encode(array("upNameArr1"=>$upNameArr1,"upNameArr2"=>$upNameArr2));
    }

    public function area() {
        $v = '';
        $data['status'] = 200;
        $data['msg']    = 'success';
       // $list = $this->data_model->workcenterList($where, ' order by PK_WC_ID desc limit '.$offset.','.$rows.'');

        $list = $this->data_model->areaList('', ' order by PK_Area_ID desc');
        foreach ($list as $arr=>$row) {
            $v[$arr]['default'] = false;
            $v[$arr]['id']      = intval($row['PK_Area_ID']);
            $v[$arr]['pId']      = intval($row['UpArea_ID']);
            $v[$arr]['name']    = $row['Name'];
            $v[$arr]['upareaName']    = $row['upareaName'];
            $v[$arr]['level']    = $row['Level'];
        }
        $data['data']['items']   = is_array($v) ? $v : '';
        $data['data']['totalsize']  = $this->cache_model->load_total(AREA);
        die(json_encode($data));
    }
    public function area3() {
        $value = $_GET['value'];
        $v = '';
        $data['status'] = 200;
        $data['msg']    = 'success';
        // $list = $this->data_model->workcenterList($where, ' order by PK_WC_ID desc limit '.$offset.','.$rows.'');
        /*$sql = "select PK_Area_ID from t_Area where Name=\"$upName\"";
        $result = $this->db->query($sql);
        $UpArea_ID = null ;
        foreach ($result->result() as $row)
        {
            $arr = object_array($row);
            $UpArea_ID=$arr["PK_Area_ID"];
        }*/
        $list = $this->data_model->areaList("and a.level=3 and a.UpArea_ID=$value", ' order by PK_Area_ID desc');
        foreach ($list as $arr=>$row) {
            $v[$arr]['default'] = false;
            $v[$arr]['id']      = intval($row['PK_Area_ID']);
            $v[$arr]['pId']      = intval($row['UpArea_ID']);
            $v[$arr]['name']    = $row['Name'];
            $v[$arr]['upareaName']    = $row['upareaName'];
            $v[$arr]['level']    = $row['Level'];
        }
        $data['data']['items']   = is_array($v) ? $v : '';
        $data['data']['totalsize']  = $this->cache_model->load_total(AREA);
        die(json_encode($data));
    }
    /*public function area2() {
        $value = $_GET['value'];
        $v = '';
        $data['status'] = 200;
        $data['msg']    = 'success';
        // $list = $this->data_model->workcenterList($where, ' order by PK_WC_ID desc limit '.$offset.','.$rows.'');
	/*$upNameArr1 = $this->mysql_model->db_select(AREA,'(level = 1)','Name');
        $sql = "select PK_Area_ID from t_Area where Name=\"$upName\"";
        $result = $this->db->query($sql);
        $UpArea_ID = null ;
        foreach ($result->result() as $row)
        {
            $arr = object_array($row);
            $UpArea_ID=$arr["PK_Area_ID"];
        }*/
      /*  $list = $this->data_model->areaList("and a.level=2 and a.UpArea_ID=$value", ' order by PK_Area_ID desc');
        foreach ($list as $arr=>$row) {
            $v[$arr]['default'] = false;
            $v[$arr]['id']      = intval($row['PK_Area_ID']);
            $v[$arr]['pId']      = intval($row['UpArea_ID']);
            $v[$arr]['name']    = $row['Name'];
            $v[$arr]['upareaName']    = $row['upareaName'];
            $v[$arr]['level']    = $row['Level'];
        }
        $data['data']['items']   = is_array($v) ? $v : '';
        $data['data']['totalsize']  = $this->cache_model->load_total(AREA);
        die(json_encode($data));
    }*/
    public function area4() {
        $value = $_GET['value'];
        $v = '';
        $data['status'] = 200;
        $data['msg']    = 'success';
        // $list = $this->data_model->workcenterList($where, ' order by PK_WC_ID desc limit '.$offset.','.$rows.'');
        /*$sql = "select PK_Area_ID from t_Area where Name=\"$upName\"";
        $result = $this->db->query($sql);
        $UpArea_ID = null ;
        foreach ($result->result() as $row)
        {
            $arr = object_array($row);
            $UpArea_ID=$arr["PK_Area_ID"];
        }*/
        $list = $this->data_model->areaList("and a.level=4 and a.UpArea_ID=$value", ' order by PK_Area_ID desc');
        foreach ($list as $arr=>$row) {
            $v[$arr]['default'] = false;
            $v[$arr]['id']      = intval($row['PK_Area_ID']);
            $v[$arr]['pId']      = intval($row['UpArea_ID']);
            $v[$arr]['name']    = $row['Name'];
            $v[$arr]['upareaName']    = $row['upareaName'];
            $v[$arr]['level']    = $row['Level'];
        }
        $data['data']['items']   = is_array($v) ? $v : '';
        $data['data']['totalsize']  = $this->cache_model->load_total(AREA);
        die(json_encode($data));
    }
    public function area2() {
        $value = $_GET['value'];
        $v = '';
        $data['status'] = 200;
        $data['msg']    = 'success';
        // $list = $this->data_model->workcenterList($where, ' order by PK_WC_ID desc limit '.$offset.','.$rows.'');
	/*$upNameArr1 = $this->mysql_model->db_select(AREA,'(level = 1)','Name');
        $sql = "select PK_Area_ID from t_Area where Name=\"$upName\"";
        $result = $this->db->query($sql);
        $UpArea_ID = null ;
        foreach ($result->result() as $row)
        {
            $arr = object_array($row);
            $UpArea_ID=$arr["PK_Area_ID"];
        }*/
        $list = $this->data_model->areaList("and a.level=2 and a.UpArea_ID=$value", ' order by PK_Area_ID desc');
        foreach ($list as $arr=>$row) {
            $v[$arr]['default'] = false;
            $v[$arr]['id']      = intval($row['PK_Area_ID']);
            $v[$arr]['pId']      = intval($row['UpArea_ID']);
            $v[$arr]['name']    = $row['Name'];
            $v[$arr]['upareaName']    = $row['upareaName'];
            $v[$arr]['level']    = $row['Level'];
        }
        $data['data']['items']   = is_array($v) ? $v : '';
        $data['data']['totalsize']  = $this->cache_model->load_total(AREA);
        die(json_encode($data));
    }
    public function area1() {
        $v = '';
        $data['status'] = 200;
        $data['msg']    = 'success';
        // $list = $this->data_model->workcenterList($where, ' order by PK_WC_ID desc limit '.$offset.','.$rows.'');

        $list = $this->data_model->areaList('and a.level=1', ' order by PK_Area_ID desc');
        foreach ($list as $arr=>$row) {
            $v[$arr]['default'] = false;
            $v[$arr]['id']      = intval($row['PK_Area_ID']);
            $v[$arr]['pId']      = intval($row['UpArea_ID']);
            $v[$arr]['name']    = $row['Name'];
            $v[$arr]['upareaName']    = $row['upareaName'];
            $v[$arr]['level']    = $row['Level'];
        }
        $data['data']['items']   = is_array($v) ? $v : '';
        $data['data']['totalsize']  = $this->cache_model->load_total(AREA);
        die(json_encode($data));
    }

    //日志用户接口
    public function admin() {
        $v = array();
        $data['status'] = 200;
        $data['msg']    = 'success';
        $list = $this->cache_model->load_data(USER,'(1=1) order by roleid');
        foreach ($list as $arr=>$row) {
            $v[$arr]['name']        = $row['Username'];
            $v[$arr]['userid']      = intval($row['PK_User_ID']);
        }
        $data['data']['items']      = $v;
        $data['data']['totalsize']  = $this->cache_model->load_total(USER);
        die(json_encode($data));
    }
    public function upDepartment() {
        $v = array();
        $data['status'] = 200;
        $data['msg']    = 'success';
        $list = $this->cache_model->load_data(DEPARTMENT,'(1=1) order by PK_Dept_ID');
        foreach ($list as $arr=>$row) {
            $v[$arr]['name']        = $row['Name'];
            $v[$arr]['userid']      = intval($row['PK_Dept_ID']);
        }
        $data['data']['items']      = $v;
        $data['data']['totalsize']  = $this->cache_model->load_total(USER);
        die(json_encode($data));
    }
	
	//用户名检测接口
    public function admin_checkname() {
        $username = str_enhtml($this->input->get('userName',TRUE));
        $this->cache_model->load_total(USER,'(Username="'.$username.'")') > 0 && die('{"status":200,"msg":"success"}');
		die('{"status":502,"msg":"用户名不存在"}');
	}


	//查询用户接口
    public function  getUser(){
      $data[]= array('key'=>'','name'=>'');
      $list = $this->cache_model->load_data(USER,'(1=1) order by PK_User_ID desc');
      foreach ($list as $arr => $row ){
         $data[]= array('key'=>intval($row['PK_User_ID']),'name'=>$row['Username']);
      }
      die(json_encode($data));
    }


    //查询公司接口
    public function  getCompany(){
        $data[]= array('key'=>'','name'=>'');
        $list = $this->cache_model->load_data(BETWEENUNIT,'(1=1) order by PK_BU_ID desc');
        foreach ($list as $arr => $row ){
            $data[]= array('key'=>intval($row['PK_BU_ID']),'name'=>$row['Name']);
        }
//      var_dump($data);
        die(json_encode($data));
    }

    //查询仓库接口
    public function  getStock(){
        $data[]= array('key'=>'','name'=>'');
        $list = $this->cache_model->load_data(STOCK,'(1=1) order by PK_Stock_ID desc');
        foreach ($list as $arr => $row ){
            $data[]= array('key'=>intval($row['PK_Stock_ID']),'name'=>$row['Stock_Name']);
        }
//      var_dump($data);
        die(json_encode($data));
    }


    //查询单位接口
    public function  getUnit(){
        $data[]= array('key'=>'','name'=>'');
        $list = $this->cache_model->load_data(UNIT,'(1=1) order by id desc');
        foreach ($list as $arr => $row ){
            $data[]= array('key'=>intval($row['id']),'name'=>$row['name']);
        }
        die(json_encode($data));
    }

    //查询订单接口
    public function  getOrder()
    {
        $data[] = array('key' => '', 'name' => '');
        $list = $this->cache_model->load_data(SALEORDER, '(1=1) order by Create_Date desc ');
        foreach ($list as $arr => $row) {
            $data[] = array('key' => ($row['PK_OS_ID']), 'name' => $row['Name']);
        }
        die(json_encode($data));
    }

	public function getGroupContractNum(){
        $type = str_enhtml($this->input->get('type',TRUE));
        $data[] = array('key' => '', 'name' => '');
        switch ($type){
            case 'area' :
                $list = $this->data_model->areaList('', ' order by PK_Area_ID desc');
                foreach ($list as $arr=>$row) {
                    $data[] = array('key' => intval($row['PK_Area_ID']), 'name' => $row['Name']);
                }
                break;

            case 'industry' :
                $list = $this->cache_model->load_data(INDUSTRY,'(1=1) order by PK_Industry_ID desc');
                $data[] = array('key' => 0, 'name' => '其他');
                foreach ($list as $arr=>$row) {
                    $data[] = array('key' => intval($row['PK_Industry_ID']), 'name' => $row['Name']);
                }
                break;

            case 'workcenter' :
                $list = $this->cache_model->load_data(WORK_CENTER,'(1=1) order by PK_WC_ID desc');
                foreach ($list as $arr=>$row) {
                    $data[] = array('key' => intval($row['PK_WC_ID']), 'name' => $row['WC_Name']);
                }
                break;
        }

        die(json_encode($data));


    }

    public function cat1List(){
            $where = '(Level = 1)';
        $list  = $this->cache_model->load_data(BOM_CATEGORY2,$where);
        foreach ($list as $arr=>$row) {
            $v[$arr]['name']        = $row['Name'];
            $v[$arr]['id']      = intval($row['PK_BOMCat_ID2']);
        }
        $data['data']['items']      = $v;
        $data['data']['totalsize']  = $this->cache_model->load_total(BOM_CATEGORY1);
        die(json_encode($data));
    }

    public function cat2List(){

        $categoryid   = intval($this->input->get('cat1',TRUE));
        $where = '';
        if(intval($categoryid) > 0){
            //$where .= ' Up_Cat2= '. $categoryid;
 	    $where .= 'and a.Up_Cat2 = '. $categoryid;
        }
        $list  = $this->data_model->bomCategoryList($where);
        //$list  = $this->cache_model->load_data(BOM_CATEGORY2,$where);
        $v = array();
        foreach ($list as $arr=>$row) {
$v[$arr]['name']        = $row['Name'];
            $v[$arr]['id']      = intval($row['PK_BOMCat_ID2']);
        }
        $data     = $v;

        $data['data']['items']      = $v;

        die(json_encode($data));
    }
//仓库接口
    public function mattemplate() {
        $v = '';
        $data['status'] = 200;
        $data['msg']    = 'success';
        $list = $this->data_model->MatTemplateList('','');
        //$list = $this->cache_model->load_data(MATTEMPLATE,'');
        foreach ($list as $arr=>$row) {
            $v[$arr]['id']      = intval($row['id']);
            $v[$arr]['name']    = $row['Name'];
        }
        $data['data']['items']   = is_array($v) ? $v : '';
        die(json_encode($data));
    }
    public function deptList(){
        $type   = $this->input->get('type',TRUE);
        $where = $type == 'add' ? 'Status = 1' : '';
        $list  = $this->cache_model->load_data(DEPARTMENT,$where);
        foreach ($list as $arr=>$row) {
            $v[$arr]['name']        = $row['Name'];
            $v[$arr]['id']      = intval($row['PK_Dept_ID']);
        }
        $data['data']['items']      = $v;
        die(json_encode($data));
    }

}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */
