<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Bom extends CI_Controller {

    public function __construct(){
        parent::__construct();
		$this->purview_model->checkpurview(68);
		$this->load->model('data_model');
    }
	
	public function index(){
		$this->load->view('bom/index');
	}


    public function save() {
        $info['id']=$id  = intval($this->input->post('id',TRUE));
        $act = str_enhtml($this->input->get('act',TRUE));
        $info['Name']       = $data['Name']   = str_enhtml($this->input->post('BOMName',TRUE));
        $info['BOMCat_ID2']=$BOMCat_ID1 = intval($this->input->post('BOMCat_ID1',TRUE));
        $BOMCat_ID2 = $info['BOMCat_ID1']     = $data['BOMCat_ID1'] = intval(str_enhtml($this->input->post('BOMCat_ID2',TRUE)));
        $info['MT_ID']     = $data['MT_ID'] = intval(str_enhtml($this->input->post('mateplateValue',TRUE)));
	$cantactID = $info['MT_ID'];
            $list = $this->data_model->bomBaseList('','order by t.PK_BOM_ID asc');
	$PK_BOMCat_ID2 = $cantactID.'00001';
	if($list)
	foreach($list as $arr => $row){
		if(intval($cantactID)==intval($row['PK_BOM_ID']/100000))
			{
$PK_BOMCat_ID2 = intval($cantactID)*100000+($row['PK_BOM_ID']-(intval($row['PK_BOM_ID']/100000))*100000)+1;
}
	}
	$info['MTName']= str_enhtml($this->input->post('mateplateText',TRUE));
	$info['cat1Name']= str_enhtml($this->input->post('BOMCat_ID1_Name',TRUE));
	$info['cat2Name']= str_enhtml($this->input->post('BOMCat_ID2_Name',TRUE));
	$data['PK_BOM_ID'] = $PK_BOMCat_ID2;
        $info['Desc']  = $data['Desc'] = str_enhtml($this->input->post('Desc',TRUE));
        $attr_key = str_enhtml($this->input->post('attr_key',TRUE));
        $attr_val = str_enhtml($this->input->post('attr_val',TRUE));
        strlen($data['Name']) < 1 && die('{"status":-1,"msg":"名称不能为空"}');
        $key = array();//新属性
        $data['Attr'] = '';
        $attrArr = array();
        if ($act=='add') {
            $this->purview_model->checkpurview(69);
        if(count($attr_key) > 0 && count($attr_val) > 0){
            $i = 0;
            foreach ($attr_key as $k => $v){
                        $key[] = $v;
                        $attrname = 'Attr' . $i;
                        $data[$attrname] = $attr_val[$k];
                        $attrArr[$v] = $attr_val[$k];
                        $i++;
                }
            }
                $info['attrStr'] = $attrArr;
            if (count($key) > 0) $data['Attr'] = implode('|',$key);
            $sql = $this->mysql_model->db_inst(BOM_BASE,$data);
                $this->cache_model->delsome(BOM_BASE);
                $this->cache_model->delsome(BOM_STOCK);
                $this->data_model->logs('新增商品:'.$data['Name']);
                die('{"status":200,"msg":"success","data":'.json_encode($info).'}');
                die('{"status":-1,"msg":"添加失败"}');
        } elseif ($act=='update') {
            $this->purview_model->checkpurview(70);
 $data['Attr'] = implode('|',$attr_key);
  $attrArr = explode("_",$data['Name']);
            $attrArr1 = explode("*",$attrArr[1]);
            foreach ($attrArr1 as $key=>$val)
            {
                $attr = 'Attr'.$key;
                $data[$attr] = $val;
            }
unset($data['PK_BOM_ID']);
$sql = $this->mysql_model->db_upd(BOM_BASE,$data,'(PK_BOM_ID='.$id.')');

            if ($sql) {
                $info['id'] = $id;
                $info['Attr'] = count($attrArr) > 0 ? str_replace('"','_',json_encode($attrArr,JSON_UNESCAPED_UNICODE)) : '';
                $this->cache_model->delsome(BOM_BASE);
                $this->data_model->logs('修改物料:'.$id);
                die('{"status":200,"msg":"success","data":'.json_encode($info).'}');
            } else {
                die('{"status":-1,"msg":"修改失败"}');
            }
        }
    }


    public function del() {
	    $this->purview_model->checkpurview(71);
	    $id = str_enhtml($this->input->post('id',TRUE));
		if (strlen($id) > 0) {
		    $NameArr = $this->mysql_model->db_select(BOM_BASE,'(PK_BOM_ID in('.$id.'))','Name');
$Name = implode(',',$NameArr);
		$sql = $this->mysql_model->db_del(BOM_BASE,'(PK_BOM_ID in('.$id.'))');
		    if ($sql) {
                $sql = $this->mysql_model->db_del(BOM_STOCK,'(BOM_ID in('.$id.'))');
			    $this->cache_model->delsome(BOM_BASE);
                $this->cache_model->delsome(BOM_STOCK);
				$this->data_model->logs('删除物料:'.$Name);
				die ('{"status":200,"msg":"success","data":{"msg":"","id":['.$id.']}}');
			} else {
			    die('{"status":-1,"msg":"删除失败"}');
			}
		}
	}

    /**
     * showdoc
     * @catalog 开发文档/仓库
     * @title 商品导出
     * @description 商品导出的接口
     * @method get
     * @url https://www.2midcm.com/goods/export
     * @param skey 必选 array 商品ID数组
     * @return {"status":200,"msg":"success"}
     * @return_param status string 1："200"导出成功,2:"-1"导出失败
     * @remark 这里是备注信息
     * @number 3
     */
	public function export() {
        $this->purview_model->checkpurview(72);
        sys_xls('商品明细.xls');
        $skey         = str_enhtml($this->input->get('skey',TRUE));
        $categoryid   = intval($this->input->get('assistId',TRUE));
        $where = '';
        if ($skey) {
            $where .= ' and goods like "%'.$skey.'%"';
        }
        if ($categoryid > 0) {
            $cid = $this->cache_model->load_data(CATEGORY,'(1=1) and find_in_set('.$categoryid.',path)','id');
            if (count($cid)>0) {
                $cid = join(',',$cid);
                $where .= ' and categoryid in('.$cid.')';
            }
        }
        $this->data_model->logs('导出商品');

        $data['list'] = $this->cache_model->load_data(GOODS,'(status=1) '.$where.' order by id desc');
		$this->load->view('goods/export',$data);
	}	



}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */
