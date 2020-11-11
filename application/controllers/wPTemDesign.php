<?php if(!defined('BASEPATH')) exit('No direct script access allowed');

//bom设计
class WPTemDesign extends CI_Controller {

    public function __construct(){
        parent::__construct();
        $this->purview_model->checkpurview(144);
        $this->load->model('data_model');
        $this->uid = $this->session->userdata('uid');
        $this->name = $this->session->userdata('name');
    }

    public function index(){
        $this->load->view('wPTemDesign/index');
    }

    //bom设计列表
    public function lists(){
        $v = '';
        $data['status'] = 200;
        $data['msg']    = 'success';
        $page = max(intval($this->input->get_post('page',TRUE)),1);
        $rows = max(intval($this->input->get_post('rows',TRUE)),100);
        $key  = str_enhtml($this->input->get_post('matchCon',TRUE));
        $whereID = '';
        $whereUp = "";
        $where = '';
        if (strlen($key)>0) {
            $whereUp .= ' where Name like "%'.$key.'%" ';
            $where .='where t.PK_WPTD_ID like "%'.$key.'%" or t.Name like "%'.$key.'%" or t.UpBOM_Name like "%'.$key.'%" or t.DownBOM_Name like "%'.$key.'%"';
        }
        $result = $this->data_model->WPTem_DesignList($where,'');
        $offset = $rows * ($page-1);
        $data['data']['page']      = $page;
//        $list = $this->data_model->designList($where,' order by PK_BOM_Desi_ID desc limit '.$offset.','.$rows.'');
//        foreach ($list as $arr=>$row) {
//            $v[$arr]['id']   = intval($row['PK_BOM_Desi_ID']);
//            $v[$arr]['Name']    = $row['Name'];
//            $v[$arr]['WC_ID']  = $row['WC_ID'];
//            $v[$arr]['WC_Name']  = $row['WC_Name'];
//            $v[$arr]['UpBOM_ID']  = intval($row['UpBOM_ID']);
//            $v[$arr]['DownBOM_ID']       = $row['DownBOM_ID'];
//            $v[$arr]['UpBOM_Name']  = $row['UpBOM_Name'];
//            $v[$arr]['DownBOM_Name']       = $row['DownBOM_Name'];
//            $v[$arr]['NorAmount']   = $row['NorAmount'];
//            $v[$arr]['Desc']   = $row['Desc'];
//            $v[$arr]['Method']   = $row['Method'];
//            $v[$arr]['Formula']  = $row['Formula'];
//            $v[$arr]['Des_Coef']  = $row['Des_Coef'];
//        }
        foreach ($result as $m=>$arr) {
            $v[$m]['id']   = intval($arr['PK_WPTD_ID']);
            $v[$m]['Name']    = $arr['Name'];
            $v[$m]['WC_ID']  = $arr['WC_ID'];
            $v[$m]['WC_Name']  = $arr['WC_Name'];
            $v[$m]['UpMT_ID']  = intval($arr['UpMT_ID']);
            $v[$m]['DownMT_ID']       = $arr['DownMT_ID'];
            $v[$m]['UpBOM_Name']  = $arr['UpBOM_Name'];
//            $v[$m]['UpBOM_Name']  = "abc";
//            $v[$m]['DownBOM_Name']       = "def";
            $v[$m]['DownBOM_Name']       = $arr['DownBOM_Name'];
            $v[$m]['Desc']   = $arr['Desc'];
//            $v[$m]['Method']   = $arr['Method'];
            $v[$m]['Method']   = "qwer";
//            $v[$m]['Formula']  = $arr['Formula'];
            $v[$m]['Formula']  = "jkl";
//            $v[$m]['Des_Coef']  = $arr['Des_Coef'];
            $v[$m]['Des_Coef']  = "cvcvcv";
//            $v[$arr]['NorAmount']   = $arr['NorAmount'];
            $v[$m]['NorAmount']   = 45;
            $m++;
        }
        $data['data']['records']   = $m;   //总条数
        $data['data']['total']     = ceil($data['data']['records']/$rows);    //总分页数
        $data['data']['rows']      = is_array($v) ? $v : '';
        die(json_encode($data));
    }

    //添加Bom设计
    public function add()
    {
        $this->purview_model->checkpurview(145);
        $data = $this->input->post('postData', TRUE);
        if (strlen($data) > 0) {
            $data = (array)json_decode($data);
            if (is_array($data['entries'])) {
                foreach ($data['entries'] as $arr => $row) {
                    $v[$arr]['Name'] = $row->name;
                    $v[$arr]['Desc'] = $row->desc;
                    $v[$arr]['WC_ID'] = intval($row->wc_id);
                    $v[$arr]['UpMT_ID'] = intval($row->up_bom_id);
                    $v[$arr]['DownMT_ID'] = intval($row->down_bom_id);

//                    $sql = "insert into t_WPTem_Design (Name,Desc,WC_ID,UpMT_ID,DownMT_ID) values(\"$row->name\", \"$row->desc\",$row->wc_id ,$row->up_bom_id,$row->down_bom_id);";
//                    $result = $this->db->query($sql);
                }
                $designId = $this->mysql_model->db_inst(WPTEM_DESIGN, $v);
//                if ($this->db->trans_status() === FALSE) {
//                    $this->db->trans_rollback();
//                    die();
//                } else {
//                    $this->db->trans_commit();
                    $this->cache_model->delsome(WPTEM_DESIGN);
                    $this->data_model->logs('操作人：' . $this->name .'新增物料模板设计：'. $designId);
                    die('{"status":200,"msg":"success"}');
//                }
            }
        }else {
            $this->load->view('wPTemDesign/add', $data);
        }
    }

    //修改BOM设计
    public function edit(){
        $this->purview_model->checkpurview(146);
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
                $this->cache_model->delsome(WPTEM_DESIGN);
                $arr = object_array($data["entries"]);
                $name = $arr[0]['name'];
                $wc_id = $arr[0]['wc_id'];
                $desc = $arr[0]['desc'];
                $id = $data['id'];
                $up_bom_id = $arr[0]['up_bom_id'];
                $down_bom_id = $arr[0]['down_bom_id'];
                 $sql = "update t_WPTem_Design t set t.Name=\"$name\",t.Desc=\"$desc\" ,t.UpMT_ID=$up_bom_id ,t.DownMT_ID=$down_bom_id
                 ,t.WC_ID=$wc_id where PK_WPTD_ID=$id";
            $result = $this->db->query($sql);
                $this->data_model->logs('修改了BOM设计：'.$data['id']);
                die('{"status":200,"msg":"success","data":{"id":'.$data['id'].'}}');
//            }
        } else {
            $data = $this->mysql_model->db_one(WPTEM_DESIGN,'(PK_WPTD_ID='.$id.')');
            if (count($data)>0) {
                $this->load->view('wPTemDesign/edit',$data);
            }
        }
    }

    //BOM设计信息
    public function info(){
        $id   = intval($this->input->get_post('id',TRUE));
        $where = " and a.PK_BOM_Desi_ID = $id";
//        $data = $this->data_model->designList($where);
        $v = array();
        $sql = 'select g.*, h.Name as DownBOM_Name from  (select e.*,f.Name as UpBOM_Name from (SELECT c.* from (select a.*,b.WC_Name FROM (select * from t_WPTem_Design where PK_WPTD_ID='.$id.') a ,t_Work_Center b WHERE a.WC_ID=b.PK_WC_ID) c LEFT join t_WPTem_Design d
on c.UpMT_ID=d.PK_WPTD_ID)e  LEFT join t_'.MATTEMPLATE.' f on e.UpMT_ID=f.PK_MT_ID)g
left join t_'.MATTEMPLATE.' h on g.DownMT_ID=h.PK_MT_ID';
        $result = $this->db->query($sql);

        if (true) {
            $m = 0;
            foreach ($result->result() as $row) {
                $arr = object_array($row);
                $v[$m]['id']   = intval($arr['PK_WPTD_ID']);
                $v[$m]['Name']    = $arr['Name'];
                $v[$m]['WC_ID']  = $arr['WC_ID'];
                $v[$m]['WC_Name']  = $arr['WC_Name'];
                $v[$m]['up_bom_id']  = intval($arr['UpMT_ID']);
                $v[$m]['down_bom_id']       = $arr['DownMT_ID'];
                $v[$m]['up_bom_name']  = $arr['UpBOM_Name'];
//            $v[$m]['UpBOM_Name']  = "abc";
//            $v[$m]['DownBOM_Name']       = "def";
                $v[$m]['down_bom_name']       = $arr['DownBOM_Name'];
                $v[$m]['Desc']   = $arr['Desc'];
//            $v[$m]['Method']   = $arr['Method'];
                $v[$m]['Method']   = "qwer";
//            $v[$m]['Formula']  = $arr['Formula'];
                $v[$m]['Formula']  = "jkl";
//            $v[$m]['Des_Coef']  = $arr['Des_Coef'];
                $v[$m]['Des_Coef']  = "cvcvcv";
//            $v[$arr]['NorAmount']   = $arr['NorAmount'];
                $v[$m]['NorAmount']   = 45;
                $m++;
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
    public function del() {
        $this->purview_model->checkpurview(147);
        $id   = intval($this->input->get('id',TRUE));
        $data = $this->mysql_model->db_one(WPTEM_DESIGN,'(PK_WPTD_ID='.$id.')');
        if (true) {
            $this->db->trans_begin();
            $this->mysql_model->db_del(WPTEM_DESIGN,'(PK_WPTD_ID='.$id.')');
            if ($this->db->trans_status() === FALSE) {
                $this->db->trans_rollback();
                die('{"status":-1,"msg":"删除失败"}');
            } else {
                $this->db->trans_commit();
                $this->cache_model->delsome(WPTEM_DESIGN);
                $this->data_model->logs('删除BOM设计：'.json_encode($data,JSON_UNESCAPED_UNICODE));
                die('{"status":200,"msg":"success"}');
            }
        }
        die('{"status":-1,"msg":"删除失败"}');
    }

}
