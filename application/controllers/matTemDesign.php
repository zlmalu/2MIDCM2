<?php if(!defined('BASEPATH')) exit('No direct script access allowed');

//bom设计
class mattemDesign extends CI_Controller {

    public function __construct(){
        parent::__construct();
        $this->purview_model->checkpurview(140);
        $this->load->model('data_model');
        $this->uid = $this->session->userdata('uid');
        $this->name = $this->session->userdata('name');
    }

    public function index(){
        $this->load->view('mattemDesign/index');
    }
 public function init()
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
        $v = '';
        $data['status'] = 200;
        $data['msg']    = 'success';
        // $list = $this->data_model->workcenterList($where, ' order by PK_WC_ID desc limit '.$offset.','.$rows.'');

        $list = $this->mysql_model->db_select(WPTEM_DESIGN);
        foreach ($list as $arr=>$row) {
            $v[$arr]['default'] = false;
            $v[$arr]['id']      = intval($row['PK_WPTD_ID']);
//            $v[$arr]['pId']      = intval($row['Up_Cat2']);
            $v[$arr]['name']    = $row['Name'];
//            $v[$arr]['upareaName']    = $row['upareaName'];
//            $v[$arr]['level']    = $row['Level'];
        }
        $data['data']['items']   = is_array($v) ? $v : '';
        $data['data']['totalsize']  = $this->cache_model->load_total(BOM_CATEGORY2);
        die(json_encode($data));
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
        $v = '';
        $data['status'] = 200;
        $data['msg']    = 'success';
        // $list = $this->data_model->workcenterList($where, ' order by PK_WC_ID desc limit '.$offset.','.$rows.'');

        $list = $this->mysql_model->db_select(MATTEMPLATE);
        foreach ($list as $arr=>$row) {
            $v[$arr]['default'] = false;
            $v[$arr]['id']      = intval($row['PK_MT_ID']);
//            $v[$arr]['pId']      = intval($row['Up_Cat2']);
            $v[$arr]['name']    = $row['Name'];
//            $v[$arr]['upareaName']    = $row['upareaName'];
//            $v[$arr]['level']    = $row['Level'];
        }
        $data['data']['items']   = is_array($v) ? $v : '';
        $data['data']['totalsize']  = $this->cache_model->load_total(BOM_CATEGORY2);
        die(json_encode($data));
    }
    //bom设计列表
    public function lists(){
        $v = '';
        $data['status'] = 200;
        $data['msg']    = 'success';
        $page = max(intval($this->input->get_post('page',TRUE)),1);
        $rows = max(intval($this->input->get_post('rows',TRUE)),100);
        $key  = str_enhtml($this->input->get_post('skey',TRUE));
        $whereID = '';
        $whereUp = "";
        $where = '';
        if (strlen($key)>0) {
            $whereUp .= ' where Name like "%'.$key.'%" ';
    $where .='where t.PK_MTD_ID like "%'.$key.'%" or t.Name like "%'.$key.'%" or t.UpBOM_Name like "%'.$key.'%" or t.DownBOM_Name like "%'.$key.'%" or t.WC_Name like "%'.$key.'%" or t.Desc like "%'.$key.'%"';
       
        }
        $result = $this->data_model->MatTem_DesignList($where,'');
        $offset = $rows * ($page-1);
        $data['data']['page']      = $page;
	if(count($result)>0)
        foreach ($result as $m=>$arr) {
            $v[$m]['id']   = intval($arr['PK_MTD_ID']);
            $v[$m]['Name']    = $arr['Name'];
            $v[$m]['WC_Name']  = $arr['WC_Name'];
            $v[$m]['UpMT_ID']  = intval($arr['UpMT_ID']);
            $v[$m]['WPTD_ID']  = intval($arr['WPTD_ID']);
            $v[$m]['DownMT_ID']       = $arr['DownMT_ID'];
            $v[$m]['F0']       = $arr['F0'];
            $v[$m]['F1']       = $arr['F1'];
            $v[$m]['F2']       = $arr['F2'];
            $v[$m]['F3']       = $arr['F3'];
            $v[$m]['F4']       = $arr['F4'];
            $v[$m]['F5']       = $arr['F5'];
            $v[$m]['F6']       = $arr['F6'];
            $v[$m]['F7']       = $arr['F7'];
            $v[$m]['F8']       = $arr['F8'];
            $v[$m]['F9']       = $arr['F9'];
            $v[$m]['F10']       = $arr['F10'];
            $v[$m]['F11']       = $arr['F11'];
            $v[$m]['F12']       = $arr['F12'];
            $v[$m]['F13']       = $arr['F13'];
            $v[$m]['F14']       = $arr['F14'];
            $v[$m]['F15']       = $arr['F15'];
            $v[$m]['F16']       = $arr['F16'];
            $v[$m]['F17']       = $arr['F17'];
            $v[$m]['F18']       = $arr['F18'];
            $v[$m]['F19']       = $arr['F19'];
            $v[$m]['Coef']       = $arr['Coef'];
            $v[$m]['C0']       = $arr['C0'];
            $v[$m]['C1']       = $arr['C1'];
            $v[$m]['C2']       = $arr['C2'];
            $v[$m]['C3']       = $arr['C3'];
            $v[$m]['C4']       = $arr['C4'];
            $v[$m]['C5']       = $arr['C5'];
            $v[$m]['C6']       = $arr['C6'];
            $v[$m]['C7']       = $arr['C7'];
            $v[$m]['C8']       = $arr['C8'];
            $v[$m]['C9']       = $arr['C9'];
            $v[$m]['C10']       = $arr['C10'];
            $v[$m]['UpBOM_Name']  = $arr['UpBOM_Name'];
//            $v[$m]['UpBOM_Name']  = "abc";
//            $v[$m]['DownBOM_Name']       = "def";
            $v[$m]['DownBOM_Name']       = $arr['DownBOM_Name'];
            $v[$m]['DownAmount']       = $arr['DownAmount'];
            $v[$m]['Desc']   = $arr['Desc'];
//            $v[$m]['Method']   = $arr['Method'];
//            $v[$m]['Method']   = "qwer";
////            $v[$m]['Formula']  = $arr['Formula'];
//            $v[$m]['Formula']  = "jkl";
////            $v[$m]['Des_Coef']  = $arr['Des_Coef'];
//            $v[$m]['Des_Coef']  = "cvcvcv";
////            $v[$arr]['NorAmount']   = $arr['NorAmount'];
//            $v[$m]['NorAmount']   = 45;
        }
        $data['data']['records']   = count($result);   //总条数
        $data['data']['total']     = ceil($data['data']['records']/$rows);    //总分页数
        $data['data']['rows']      = is_array($v) ? $v : '';
        die(json_encode($data));
    }

    //添加Bom设计
    public function add()
    {
        $this->purview_model->checkpurview(141);
        $data = $this->input->post('postData', TRUE);
        if (strlen($data) > 0) {
            $data = (array)json_decode($data);
            if (is_array($data['entries'])) {
//                foreach ($data['entries'] as $arr => $row) {
                    $arr = object_array($data['entries'][0]);
                    $v[0]['Name'] = $arr["name"];
                    $v[0]['Desc'] = $arr["desc"];
                    $v[0]['F0'] = $arr["F0"];
                    $v[0]['F1'] = $arr["F1"];
                    $v[0]['F2'] = $arr["F2"];
                    $v[0]['F3'] = $arr["F3"];
                    $v[0]['F4'] = $arr["F4"];
                    $v[0]['F5'] = $arr["F5"];
                    $v[0]['Coef'] = $arr["Coef"];
                    $v[0]['C0'] = $arr["C0"];
                    $v[0]['C1'] = $arr["C1"];
                    $v[0]['C2'] = $arr["C2"];
                    $v[0]['C4'] = $arr["C4"];
                    $v[0]['C3'] = $arr["C3"];
                    $v[0]['C5'] = $arr["C5"];
                    $v[0]['WPTD_ID'] = intval($arr["WPTD_ID"]);
                    $v[0]['UpMT_ID'] = intval($arr["up_bom_id"]);
                    $v[0]['DownMT_ID'] = intval($arr["down_bom_id"]);
                    $v[0]['DownAmount'] = sprintf("%.1f",$arr["DownAmount"]);
//                    $sql = "insert into t_WPTem_Design (Name,Desc,WC_ID,UpMT_ID,DownMT_ID) values(\"$row->name\", \"$row->desc\",$row->wc_id ,$row->up_bom_id,$row->down_bom_id);";
//                    $result = $this->db->query($sql);
//                }
                $designId = $this->mysql_model->db_inst(MATTEM_DESIGN, $v);
//                if ($this->db->trans_status() === FALSE) {
//                    $this->db->trans_rollback();
//                    die();
//                } else {
//                    $this->db->trans_commit();
//                    $this->cache_model->delsome(BOM_DESIGN);
                    $this->data_model->logs('操作人：' . $this->name .'新增bom设计：'. $designId);
                    die('{"status":200,"msg":"success"}');
//                }
            }
        }else {
            $this->load->view('mattemDesign/add');
        }
    }
    public function save()
    {
        $act  = str_enhtml($this->input->get('act',TRUE));
        $id = intval($this->input->post('id',TRUE));
        $data = array();
        $data['Name']      = str_enhtml($this->input->post('name',TRUE));
        strlen($data['Name']) < 1 && die('{"status":-1,"msg":"名称不能为空"}');
        $data['Desc']      = str_enhtml($this->input->post('desc',TRUE));
        $data['Coef']      = str_enhtml($this->input->post('coef',TRUE));
        $data['DownAmount']      = str_enhtml($this->input->post('Amount',TRUE));
        $data['UpMT_ID']      = str_enhtml($this->input->post('BOMCat_ID2',TRUE));
        $data['WPTD_ID']      = str_enhtml($this->input->post('BOMCat_ID1',TRUE));
        $data['DownMT_ID']      = str_enhtml($this->input->post('BOMCat_ID3',TRUE));
        $attrNum  = str_enhtml($this->input->post('attrNum',TRUE));
        $attrNum1  = str_enhtml($this->input->post('attrNum1',TRUE));
        $data['F0']      = htmlspecialchars_decode(str_enhtml($this->input->post('Attr0',TRUE)));
        $data['F1']      = htmlspecialchars_decode(str_enhtml($this->input->post('Attr1',TRUE)));
        $data['F2']      = htmlspecialchars_decode(str_enhtml($this->input->post('Attr2',TRUE)));
        $data['F3']      = htmlspecialchars_decode(str_enhtml($this->input->post('Attr3',TRUE)));
        $data['F4']      = htmlspecialchars_decode(str_enhtml($this->input->post('Attr4',TRUE)));
        $data['F5']      = htmlspecialchars_decode(str_enhtml($this->input->post('Attr5',TRUE)));
        $data['F6']      = htmlspecialchars_decode(str_enhtml($this->input->post('Attr6',TRUE)));
        $data['F7']      = htmlspecialchars_decode(str_enhtml($this->input->post('Attr7',TRUE)));
        $data['F8']      = htmlspecialchars_decode(str_enhtml($this->input->post('Attr8',TRUE)));
        $data['F9']      = htmlspecialchars_decode(str_enhtml($this->input->post('Attr9',TRUE)));
        $data['F10']      = htmlspecialchars_decode(str_enhtml($this->input->post('Attr10',TRUE)));
        $data['F11']      = htmlspecialchars_decode(str_enhtml($this->input->post('Attr11',TRUE)));
        $data['F12']      = htmlspecialchars_decode(str_enhtml($this->input->post('Attr12',TRUE)));
        $data['F13']      = htmlspecialchars_decode(str_enhtml($this->input->post('Attr13',TRUE)));
        $data['F14']      = htmlspecialchars_decode(str_enhtml($this->input->post('Attr14',TRUE)));
        $data['F15']      = htmlspecialchars_decode(str_enhtml($this->input->post('Attr15',TRUE)));
        $data['F16']      = htmlspecialchars_decode(str_enhtml($this->input->post('Attr16',TRUE)));
        $data['F17']      = htmlspecialchars_decode(str_enhtml($this->input->post('Attr17',TRUE)));
        $data['F18']      = htmlspecialchars_decode(str_enhtml($this->input->post('Attr18',TRUE)));
        $data['F19']      = htmlspecialchars_decode(str_enhtml($this->input->post('Attr19',TRUE)));
        $data['C0']      = htmlspecialchars_decode(str_enhtml($this->input->post('Attr20',TRUE)));
        $data['C1']      = str_enhtml($this->input->post('Attr21',TRUE));
        $data['C2']      = str_enhtml($this->input->post('Attr22',TRUE));
        $data['C3']      = str_enhtml($this->input->post('Attr23',TRUE));
        $data['C4']      = str_enhtml($this->input->post('Attr24',TRUE));
        $data['C5']      = str_enhtml($this->input->post('Attr25',TRUE));
        $data['C6']      = str_enhtml($this->input->post('Attr26',TRUE));
        $data['C7']      = str_enhtml($this->input->post('Attr27',TRUE));
        $data['C8']      = str_enhtml($this->input->post('Attr28',TRUE));
        $data['C9']      = str_enhtml($this->input->post('Attr29',TRUE));
        $data['C10']      = str_enhtml($this->input->post('Attr210',TRUE));
//        $data['Attr'] = $attrNum;
//        $data['Attr1'] = $attrNum1;
//        for($i=0;$i<20&&$data["Attr$i"]!=null;$i++)
//        {
//            $data['Attr'] = $data['Attr'].'|'.$data["Attr$i"];
//        }
        if ($act=='add') {
            $this->purview_model->checkpurview(149);
            $this->mysql_model->db_count(MATTEM_DESIGN,'(Name="'.$data['Name'].'")') > 0 && die('{"status":-1,"msg":"已存在该名称"}');
            $name = $data['Name'];
            $id = $this->mysql_model->db_inst(MATTEM_DESIGN, $data);
            $this->cache_model->delsome(MATTEM_DESIGN);
            $this->data_model->logs('新增物料模板:PK_MT_ID=' . $id . ' 名称:'.$name);
            $data['Level1']   = str_enhtml($this->input->post('Level1',TRUE));
            $data['Level2']   = str_enhtml($this->input->post('Level2',TRUE));
            $data['id']   = $id;
$data['WC_Name'] = $this->mysql_model->db_select(WPTEM_DESIGN,'(PK_WPTD_ID='.$data['WPTD_ID'].')','Name');
            $data['UpBOM_Name'] = $this->mysql_model->db_select(MATTEMPLATE,'(PK_MT_ID='.$data['UpMT_ID'].')','Name');
            $data['DownBOM_Name'] = $this->mysql_model->db_select(MATTEMPLATE,'(PK_MT_ID='.$data['DownMT_ID'].')','Name');
            $data['UnitClass']   = str_enhtml($this->input->post('unitClass',TRUE));

            die('{"status":200,"msg":"success","data":'.json_encode($data).'}');
        } elseif ($act=='update') {
            $this->purview_model->checkpurview(150);
            $sql = $this->mysql_model->db_upd(MATTEM_DESIGN,$data,'(PK_MTD_ID='.$id.')');
            if ($sql) {
                $this->cache_model->delsome(MATTEM_DESIGN);
                $this->data_model->logs('更新物料模板:PK_MTD_ID=' . $id . ' 名称:'.$data['Name']);
                $data['id']   = $id;
                $data['UnitClass']   = str_enhtml($this->input->post('unitClass',TRUE));
                die('{"status":200,"msg":"success","data":'.json_encode($data).'}');
            }
        } else {
            die('{"status":-1,"msg":"修改失败"}');
        }
    }
    //修改BOM设计
    /* public function edit(){
        $this->purview_model->checkpurview(142);
        $id   = intval($this->input->get('id',TRUE));
        $data = $this->input->post('postData',TRUE);
        if (strlen($data)>0) {
            $data = (array)json_decode($data);
            !isset($data['id']) && die('{"status":-1,"msg":"参数错误"}');
//            $bomData = $this->mysql_model->db_select(BOM_DESIGN,'(PK_BOM_Desi_ID='.$data['id'].')');
//
//            if(count($bomData) < 1) die('{"status":-1,"msg":"不存在该BOM设计"}');

            $v = array();
//            $this->db->trans_begin();

//            if (is_array($data['entries'])) {
//                foreach ($data['entries'] as $arr=>$row) {
//                    $v[$arr]['PK_BOM_Desi_ID']= intval($data['id']);
//                    $v[$arr]['Name'] = $row->name;
//                    $v[$arr]['Desc'] = $row->desc;
//                    $v[$arr]['WC_ID'] = $row->wc_id;
//                    $v[$arr]['UpBOM_ID'] = intval($row->up_bom_id);
//                    $v[$arr]['DownBOM_ID'] = intval($row->down_bom_id);
//                    $v[$arr]['NorAmount'] = (float)$row->down_bom_number;
//                    $v[$arr]['Method'] = $row->Method;
//                    $v[$arr]['Formula'] = $row->Formula;
//                    $v[$arr]['Des_Coef'] = (float)$row->Des_Coef > 0 ? (float)$row->Des_Coef : 1;
//                    $data['Modify_ID'] = $this->uid;
//                    $data['Modify_Date'] = date('Y-m-d H:i:s',time());
//                }
//            }
//            $this->mysql_model->db_upd(BOM_DESIGN, $v, 'PK_BOM_Desi_ID');
//            if ($this->db->trans_status() === FALSE) {
//                $this->db->trans_rollback();
//                die('');
//            } else {
//                $this->db->trans_commit();
//                $this->cache_model->delsome(BOM_DESIGN);
                $arr = object_array($data["entries"]);
                $name = $arr[0]['name'];
                $DownAmount = $arr[0]['DownAmount'];
                $descq = $arr[0]['Desc'];
                $desc = $arr[0]['Desc'];
                $Coef = $arr[0]['Coef'];
                $F0 = $arr[0]['F0'];
                $F1 = $arr[0]['F1'];
                $F2 = $arr[0]['F2'];
                $F3 = $arr[0]['F3'];
                $F4 = $arr[0]['F4'];
                $F5 = $arr[0]['F5'];
                $C0 = $arr[0]['C0'];
                $C1 = $arr[0]['C1'];
                $C2 = $arr[0]['C2'];
                $C3 = $arr[0]['C3'];
                $C4 = $arr[0]['C4'];
                $C5 = $arr[0]['C5'];
                $id = $data['id'];
                $up_bom_id = $arr[0]['UpMT_ID'];
                $up_bom_idq = $arr[0]['UpMT_ID'];
                $down_bom_id = $arr[0]['DownMT_ID'];
                $down_bom_idq = $arr[0]['DownMT_ID'];
                global $str;
                if($descq!="" && $up_bom_idq==""&& $down_bom_idq=="")
                    $str = "update t_MatTem_Design t set t.Name=\"$name\",t.DownAmount=\"$DownAmount\",t.Coef=\"$Coef\",t.Desc=\"$desc\"";
                if($descq=="" && $up_bom_idq!=""&& $down_bom_idq!="")
                    $str = "update t_MatTem_Design t set t.Name=\"$name\",t.DownAmount=\"$DownAmount\",t.Coef=\"$Coef\",t.UpMT_ID=$up_bom_id ,t.DownMT_ID=$down_bom_id";
                if($up_bom_idq==""&& $desc!=""&& $down_bom_idq!="")
                    $str = "update t_MatTem_Design t set t.Name=\"$name\",t.DownAmount=\"$DownAmount\",t.Coef=\"$Coef\",t.Desc=$desc ,t.DownMT_ID=$down_bom_id
                 ";
                if($down_bom_idq==""&& $up_bom_idq!=""&& $descq!="")
                    $str = "update t_MatTem_Design t set t.Name=\"$name\",t.DownAmount=\"$DownAmount\",t.Coef=\"$Coef\",t.Desc=$desc ,t.UpMT_ID=$up_bom_id
                 ";
            if($down_bom_idq!=""&& $up_bom_idq!=""&& $descq!="")
                 $str = "update t_MatTem_Design t set t.Name=\"$name\",t.Desc=\"$desc\" ,t.UpMT_ID=$up_bom_id ,t.DownMT_ID=$down_bom_id
                 ";
            if($down_bom_idq==""&& $up_bom_idq==""&& $descq=="")
                 $str = "update t_MatTem_Design t set t.Name=\"$name\"";
                $str1 = ",               t.F0=\"$F0\",t.F1=\"$F1\",t.F2=\"$F2\",t.F3=\"$F3\",t.F4=\"$F4\",t.F5=\"$F5\",t.C0=\"$C0\",t.C1=\"$C1\",t.C2=\"$C2\",t.C3=\"$C3\",t.C4=\"$C4\",t.C5=\"$C5\" where PK_MTD_ID=$id";
                $sql = $str.$str1;
            $result = $this->db->query($sql);
                $this->data_model->logs('修改了BOM设计：'.$data['id']);
                die('{"status":200,"msg":"success","data":{"id":'.$data['id'].'}}');
//            }
        } else {
            $data = $this->mysql_model->db_one(MATTEM_DESIGN,'(PK_MTD_ID='.$id.')');
            if (count($data)>0) {
                $this->load->view('mattemDesign/edit',$data);
            }
        }
    }
*/
    //BOM设计信息
    public function info(){
        $id   = intval($this->input->get_post('id',TRUE));
        $where = " and a.PK_BOM_Desi_ID = $id";
//        $data = $this->data_model->designList($where);
        $v = array();
        $sql = 'select * from (select e.*,f.Name as DownBOM_Name from (select c.*,d.Name as UpBOM_Name from (select a.*,b.Name as WC_Name from t_MatTem_Design a LEFT JOIN  t_WPTem_Design b on a.WPTD_ID=b.PK_WPTD_ID)c 
left join t_'.MATTEMPLATE.' d on c.UpMT_ID=d.PK_MT_ID)e LEFT join t_'.MATTEMPLATE.' f on e.DownMT_ID=f.PK_MT_ID) t where t.PK_MTD_ID='.$id.'';
        $result = $this->db->query($sql);

        if (true) {
            $m = 0;
            foreach ($result->result() as $row) {
                $arr = object_array($row);
                $v[$m]['id']   = $id;
                $v[$m]['Name']    = $arr['Name'];
                $v[$m]['C4']  = $arr['C4'];
                $v[$m]['C3']  = $arr['C3'];
                $v[$m]['UpMT_ID']  = intval($arr['UpMT_ID']);
                $v[$m]['DownMT_ID']       = $arr['DownMT_ID'];
                $v[$m]['up_bom_name']  = $arr['UpBOM_Name'];
//            $v[$m]['UpBOM_Name']  = "abc";
//            $v[$m]['DownBOM_Name']       = "def";
                $v[$m]['down_bom_name']       = $arr['DownBOM_Name'];
                $v[$m]['Desc']   = $arr['Desc'];
            $v[$m]['DownAmount']   = $arr['DownAmount'];
//                $v[$m]['Method']   = "qwer";
            $v[$m]['F0']  = $arr['F0'];
            $v[$m]['F1']  = $arr['F1'];
            $v[$m]['F2']  = $arr['F2'];
            $v[$m]['F3']  = $arr['F3'];
            $v[$m]['F4']  = $arr['F4'];
            $v[$m]['F5']  = $arr['F5'];
            $v[$m]['C1']  = $arr['C1'];
            $v[$m]['C2']  = $arr['C2'];
            $v[$m]['C5']  = $arr['C5'];
            $v[$m]['C0']  = $arr['C0'];
            $v[$m]['Coef']  = $arr['Coef'];
//                $v[$m]['Formula']  = "jkl";
//            $v[$m]['Des_Coef']  = $arr['Des_Coef'];
//                $v[$m]['Des_Coef']  = "cvcvcv";
//            $v[$arr]['NorAmount']   = $arr['NorAmount'];
//                $v[$m]['NorAmount']   = 45;
//                $m++;
            }
//            foreach ($data as $arr=>$row){
//                $v[$arr]['id']   = intval($row['PK_BOM_Desi_ID']);
//                $v[$arr]['name']    = $row['Name'];
//                $v[$arr]['WC_ID']  = $row['WC_ID'];
//                $v[$arr]['WC_Name']  = $row['WC_Name'];
//                $v[$arr]['up_bom_id']  = intval($row['UpBOM_ID']);
//                $v[$arr]['down_bom_id']       = $row['DownBOM_ID'];
//                $v[$arr]['up_bom_name']  = $row['UpBOM_Name'];
//                $v[$arr]['down_bom_name']       = $row['DownBOM_Name'];
//                $v[$arr]['down_bom_number']   = $row['NorAmount'];
//                $v[$arr]['desc']   = $row['Desc'];
//                $v[$arr]['Method']   = $row['Method'];
//                $v[$arr]['Method_Name']   = $row['Method'] == 0 ? '简单数字' : '计算公式';
//                $v[$arr]['Formula']  = $row['Formula'];
//                $v[$arr]['Des_Coef']  = $row['Des_Coef'];
//            }
            $info['status'] = 200;
            $info['msg']    = 'success';
            $info['data']['rows']  = $v;
            $info['data']['entries']     = $v;
            $info['data']['id'] = $v[0]['id'];
            die(json_encode($info));
        } else {
            alert('参数错误');
        }
    }

    //删除BOM设计
    public function del(){
        $this->purview_model->checkpurview(151);
        $id = str_enhtml($this->input->post('id',TRUE));
        $name = $this->mysql_model->db_select(MATTEM_DESIGN,'(PK_MTD_ID in('.$id.'))','Name');
        if (count($name)>0) {
            $name = join(',',$name);
        }
        $sql = $this->mysql_model->db_del(MATTEM_DESIGN,'(PK_MTD_ID in('.$id.'))');
        if ($sql) {
            $this->cache_model->delsome(MATTEM_DESIGN);
            $this->data_model->logs('删除物料模板:PK_MT_ID='.$id.' 名称:'.$name);
            die('{"status":200,"msg":"success","data":{"msg":"","id":['.$id.']}}');
        } else {
            die('{"status":-1,"msg":"删除失败"}');
        }
    }

}
