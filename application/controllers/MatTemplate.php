<?php if(!defined('BASEPATH')) exit('No direct script access allowed');

class MatTemplate extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->purview_model->checkpurview(148);
        $this->load->model('data_model');
        $this->uid = $this->session->userdata('uid');
    }

    public function index()
    {
        $result = $this->mysql_model->db_select(BOM_CATEGORY2,'(level=1)');
        $name= array();
        $Cat_ID2= array();
        foreach ($result as $row=>$arr)
        {
            array_push($name,$arr["Name"]);
            array_push($Cat_ID2,$arr["PK_BOMCat_ID2"]);
        }

        $data=array("name"=>$name,"Cat_ID2"=>$Cat_ID2);
        $this->load->view('MatTemplate/index',$data);
    }
    public function initUnitClass()
    {
        $result = $this->mysql_model->db_select(UNIT);

        $name= array();
        $id= array();
        foreach ($result as $row=>$arr)
        {
            array_push($name,$arr["name"]);
            array_push($id,$arr["id"]);
        }

        $data=array("name"=>$name,"id"=>$id);
        die(json_encode($data));
    }
    public function init()
    {
/*
        $result = $this->mysql_model->db_select(BOM_CATEGORY2,'(level=1)');
        $name= array();
        $Cat_ID2= array();
        foreach ($result as $row=>$arr)
        {
            array_push($name,$arr["Name"]);
            array_push($Cat_ID2,$arr["PK_BOMCat_ID2"]);
        }

        $data=array("name"=>$name,"Cat_ID2"=>$Cat_ID2);
        die(json_encode($data));
*/
 $v = '';
        $data['status'] = 200;
        $data['msg']    = 'success';
        // $list = $this->data_model->workcenterList($where, ' order by PK_WC_ID desc limit '.$offset.','.$rows.'');

        $list = $this->data_model->bomCategoryList('and a.level=1', ' order by PK_BOMCat_ID2 desc');
        foreach ($list as $arr=>$row) {
            $v[$arr]['default'] = false;
            $v[$arr]['id']      = intval($row['PK_BOMCat_ID2']);
            $v[$arr]['pId']      = intval($row['Up_Cat2']);
            $v[$arr]['name']    = $row['Name'];
            $v[$arr]['upareaName']    = $row['upareaName'];
            $v[$arr]['level']    = $row['Level'];
        }
        $data['data']['items']   = is_array($v) ? $v : '';
        $data['data']['totalsize']  = $this->cache_model->load_total(BOM_CATEGORY2);
        die(json_encode($data));
    }
    public function level1Change()
    {
        $Cat_ID2 = $_POST['Cat_ID2'];
        $result = $this->mysql_model->db_select(BOM_CATEGORY2,'(level=2 and Up_Cat2='.$Cat_ID2.')');
        $name= array();
        $Cat_ID2= array();
        foreach ($result as $row=>$arr)
        {
            array_push($name,$arr["Name"]);
            array_push($Cat_ID2,$arr["PK_BOMCat_ID2"]);
        }

        $data=array("name"=>$name,"Cat_ID2"=>$Cat_ID2);
        echo json_encode($data);
    }

 public function initNextLevel()
    {
//        $result = $this->mysql_model->db_select(BOM_CATEGORY2,'(level=1)');
//        $name= array();
//        $Cat_ID2= array();
//        foreach ($result as $row=>$arr)
//        {
//            array_push($name,$arr["Name"]);
//            array_push($Cat_ID2,$arr["PK_BOMCat_ID2"]);
//        }
//
//        $data=array("name"=>$name,"id"=>$Cat_ID2);
//        die(json_encode($data));
        $Up_Cat2  = str_enhtml($this->input->get('Up_Cat2',TRUE));
        $v = '';
        $data['status'] = 200;
        $data['msg']    = 'success';
        // $list = $this->data_model->workcenterList($where, ' order by PK_WC_ID desc limit '.$offset.','.$rows.'');

        $list = $this->data_model->bomCategoryList("and a.Up_Cat2=$Up_Cat2", ' order by PK_BOMCat_ID2 desc');
        foreach ($list as $arr=>$row) {
            $v[$arr]['default'] = false;
            $v[$arr]['id']      = intval($row['PK_BOMCat_ID2']);
            $v[$arr]['pId']      = intval($row['Up_Cat2']);
            $v[$arr]['name']    = $row['Name'];
            $v[$arr]['upareaName']    = $row['upareaName'];
            $v[$arr]['level']    = $row['Level'];
        }
        $data['data']['items']   = is_array($v) ? $v : '';
        $data['data']['totalsize']  = $this->cache_model->load_total(BOM_CATEGORY2);
        die(json_encode($data));
    }
    public function findVal()
    {
        $data['val'] = 3;
        echo json_encode($data);
    }
public function getBOMCat_ID1(){
        $name = str_enhtml($this->input->post('name',TRUE));
                        $Area_ID = $this->mysql_model->db_select(BOM_CATEGORY2,'(Name="'.$name.'")','PK_BOMCat_ID2');
        echo (json_encode(array("data"=>$Area_ID)));
    }
public function getBOMCat_ID2(){
        $name = str_enhtml($this->input->post('name',TRUE));
                        $Area_ID = $this->mysql_model->db_select(BOM_CATEGORY2,'(Name="'.$name.'")','PK_BOMCat_ID2');
        echo (json_encode(array("data"=>$Area_ID)));
    }

    public function save()
    {
        $act  = str_enhtml($this->input->get('act',TRUE));
        $id = intval($this->input->post('id',TRUE));
        $data = array();
        $data['Name']      = str_enhtml($this->input->post('name',TRUE));
        strlen($data['Name']) < 1 && die('{"status":-1,"msg":"名称不能为空"}');
        $data['Desc']      = str_enhtml($this->input->post('desc',TRUE));
        $data['UnitClass_ID']      = str_enhtml($this->input->post('unitClass_ID',TRUE));
        $data['BOMCat_ID2']      = str_enhtml($this->input->post('BOMCat_ID2',TRUE));
        $attrNum  = str_enhtml($this->input->post('attrNum',TRUE));
        $data['Attr0']      = str_enhtml($this->input->post('Attr0',TRUE));
        $data['Attr1']      = str_enhtml($this->input->post('Attr1',TRUE));
        $data['Attr2']      = str_enhtml($this->input->post('Attr2',TRUE));
        $data['Attr3']      = str_enhtml($this->input->post('Attr3',TRUE));
        $data['Attr4']      = str_enhtml($this->input->post('Attr4',TRUE));
        $data['Attr5']      = str_enhtml($this->input->post('Attr5',TRUE));
        $data['Attr6']      = str_enhtml($this->input->post('Attr6',TRUE));
        $data['Attr7']      = str_enhtml($this->input->post('Attr7',TRUE));
        $data['Attr8']      = str_enhtml($this->input->post('Attr8',TRUE));
        $data['Attr9']      = str_enhtml($this->input->post('Attr9',TRUE));
        $data['Attr10']      = str_enhtml($this->input->post('Attr10',TRUE));
        $data['Attr11']      = str_enhtml($this->input->post('Attr11',TRUE));
        $data['Attr12']      = str_enhtml($this->input->post('Attr12',TRUE));
        $data['Attr13']      = str_enhtml($this->input->post('Attr13',TRUE));
        $data['Attr14']      = str_enhtml($this->input->post('Attr14',TRUE));
        $data['Attr15']      = str_enhtml($this->input->post('Attr15',TRUE));
        $data['Attr16']      = str_enhtml($this->input->post('Attr16',TRUE));
        $data['Attr17']      = str_enhtml($this->input->post('Attr17',TRUE));
        $data['Attr18']      = str_enhtml($this->input->post('Attr18',TRUE));
        $data['Attr19']      = str_enhtml($this->input->post('Attr19',TRUE));
        $data['Attr'] = $attrNum;
        for($i=0;$i<20&&$data["Attr$i"]!=null;$i++)
        {
            $data['Attr'] = $data['Attr'].'|'.$data["Attr$i"];
        }
        if ($act=='add') {
            $this->purview_model->checkpurview(149);
            $this->mysql_model->db_count(BETWEENUNIT,'(Name="'.$data['Name'].'")') > 0 && die('{"status":-1,"msg":"已存在该往来单位名称"}');
            $name = $data['Name'];
            $id = $this->mysql_model->db_inst(MATTEMPLATE, $data);
            $this->cache_model->delsome(MATTEMPLATE);
            $this->data_model->logs('新增物料模板:PK_MT_ID=' . $id . ' 名称:'.$name);
            $data['Level1']   = str_enhtml($this->input->post('Level1',TRUE));
            $data['Level2']   = str_enhtml($this->input->post('Level2',TRUE));
            $data['id']   = $id;
            $data['UnitClass']   = str_enhtml($this->input->post('unitClass',TRUE));
        $data['BOMCat_ID1']      = str_enhtml($this->input->post('BOMCat_ID1',TRUE));

            die('{"status":200,"msg":"success","data":'.json_encode($data).'}');
        } elseif ($act=='update') {
            $this->purview_model->checkpurview(150);
           $sql = $this->mysql_model->db_upd(MATTEMPLATE,$data,'(PK_MT_ID='.$id.')');
            if ($sql) {
                $this->cache_model->delsome(MATTEMPLATE);
            $this->data_model->logs('更新物料模板:PK_MT_ID=' . $id . ' 名称:'.$data['Name']);
$data['id']   = $id;
            $data['UnitClass']   = str_enhtml($this->input->post('unitClass',TRUE));
                die('{"status":200,"msg":"success","data":'.json_encode($data).'}');
}
            } else {
                die('{"status":-1,"msg":"修改失败"}');
            }
        }

    public function del(){
        $this->purview_model->checkpurview(151);
        $id = str_enhtml($this->input->post('id',TRUE));

                    $this->mysql_model->db_count(MATTEM_DESIGN,'(UpMT_ID in('.$id.'))')>0 && die('{"status":-1,"msg":"其中有物料模板已发生业务不可删除"}');
            $this->mysql_model->db_count(MATTEM_DESIGN,'(DownMT_ID in('.$id.'))')>0 && die('{"status":-1,"msg":"其中有物料模板已发生业务不可删除"}');

            $name = $this->mysql_model->db_select(MATTEMPLATE,'(PK_MT_ID in('.$id.'))','name');
            if (count($name)>0) {
                $name = join(',',$name);
            }
            $sql = $this->mysql_model->db_del(MATTEMPLATE,'(PK_MT_ID in('.$id.'))');
            if ($sql) {
                $this->cache_model->delsome(MATTEMPLATE);
                $this->data_model->logs('删除物料模板:PK_MT_ID='.$id.' 名称:'.$name);
                die('{"status":200,"msg":"success","data":{"msg":"","id":['.$id.']}}');
            } else {
                die('{"status":-1,"msg":"删除失败"}');
           }
        }
    }

