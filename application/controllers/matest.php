<?php if(!defined('BASEPATH')) exit('No direct script access allowed');

//bom设计
class MatEst extends CI_Controller {

    public function __construct(){
        parent::__construct();
        $this->purview_model->checkpurview(136);
        $this->load->model('data_model');
        $this->uid = $this->session->userdata('uid');
        $this->name = $this->session->userdata('name');
    }

    public function index(){
        $this->load->view('matEst/index');
    }

    //bom设计列表
    public function lists(){
        $v = '';
        $data['status'] = 200;
        $data['msg']    = 'success';
        $page = max(intval($this->input->get_post('page',TRUE)),1);
        $rows = max(intval($this->input->get_post('rows',TRUE)),100);
        $key  = str_enhtml($this->input->get_post('matchCon',TRUE));
        $where = '';
        if (strlen($key)>0) {
            $where .= 'where t.BOMName like "%'.$key.'%" ';
        }

        $offset = $rows * ($page-1);
        $data['data']['page']      = $page;
        $result = $this->data_model->MatEstList($where,'');
        foreach ($result as $m=>$arr) {
            $v[$m]['Date']   = $arr['Date'];
            $v[$m]['BOMName']    = $arr['BOMName'];
            $v[$m]['AmOfDem']  = $arr['AmOfDem'];
            $v[$m]['AmOfSto']  = $arr['AmOfSto'];
            $v[$m]['AmOfPro']  = intval($arr['AmOfPro']);
            $v[$m]['AmOfPur']       = $arr['AmOfPur'];
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
        $this->purview_model->checkpurview(137);
        $data = $this->input->post('postData', TRUE);
	$name = '';
        if (strlen($data) > 0) {
            $data = (array)json_decode($data);
            if (is_array($data['entries'])) {
                foreach ($data['entries'] as $arr => $row) {
                    $v[$arr]['Date'] = $row->Date;
                    $v[$arr]['AmOfDem'] = $row->AmOfDem;
                    $v[$arr]['AmOfSto'] = intval($row->AmOfSto);
                    $v[$arr]['BOM_ID'] = intval($row->up_bom_id);
                    $v[$arr]['AmOfPro'] = intval($row->AmOfPro);
                    $v[$arr]['AmOfSto'] = (float)$row->AmOfSto;
                    $v[$arr]['AmOfPur'] = $row->AmOfPur;
$Name = $this->mysql_model->db_select(BOM_BASE,'(PK_BOM_ID='.intval($row->up_bom_id).')','Name');
$name.=$Name[0];
                }
                $designId = $this->mysql_model->db_inst(MATEST, $v);

                if ($this->db->trans_status() === FALSE) {
                    $this->db->trans_rollback();
                    die();
                } else {
                    $this->db->trans_commit();
                    $this->cache_model->delsome(MATEST);
                    $this->data_model->logs('新增物料生产预估：'. $name);
                    die('{"status":200,"msg":"success"}');
                }
            }
        }else {
            $this->load->view('matEst/add', $data);
        }
    }

    //修改BOM设计
    public function edit(){
        $this->purview_model->checkpurview(138);
        $date   = $this->input->get('id',TRUE);
        $data = $this->input->post('postData',TRUE);
        if ($data) {
            $data = (array)json_decode($data);
                $arr = object_array($data["entries"][0]);
                $BOM_ID = $arr["up_bom_id"];
                $AmOfDem = $arr['AmOfDem'];
                $AmOfSto = $arr['AmOfSto'];
                $AmOfPro = $arr['AmOfPro'];
                $AmOfPur = $arr['AmOfPur'];
                $date = $data["id"];
                if($BOM_ID=="")
            $sql = "update t_MatEst a set a.AmOfDem=$AmOfDem,a.AmOfSto=$AmOfSto,a.AmOfPro=$AmOfPro,a.AmOfPur=$AmOfPur where a.Date=\"$date\"";
            else
                $sql = "update t_MatEst a set a.BOM_ID=$BOM_ID,a.AmOfDem=$AmOfDem,a.AmOfSto=$AmOfSto,a.AmOfPro=$AmOfPro,a.AmOfPur=$AmOfPur where a.Date=\"$date\"";
            $result = $this->db->query($sql);
                $this->cache_model->delsome(MATEST);
                $this->data_model->logs('修改了物料生产预估：'.$data['id']);
                die('{"status":200,"msg":"success","data":{"id":"\"$date\""}}');
        } else {
                $this->load->view('matEst/edit');
        }
    }

    //BOM设计信息
    public function info(){
        $date  = $this->input->get_post('id',TRUE);
        $where = " and a.PK_BOM_Desi_ID = $date";
        $v = array();
        $sql = "select t.* from (select a.*,b.Name as BOMName from t_MatEst a left join t_BOM_Base b on a.BOM_ID=b.PK_BOM_ID)t where t.Date=\"$date\"";

        $result = $this->db->query($sql);
        $m = 0;
        foreach ($result->result() as $row) {
            $arr = object_array($row);
            $v[$m]['Date']   = $arr['Date'];
            $v[$m]['up_bom_name']    = $arr['BOMName'];
            $v[$m]['AmOfDem']  = $arr['AmOfDem'];
            $v[$m]['AmOfSto']  = $arr['AmOfSto'];
            $v[$m]['AmOfPro']  = intval($arr['AmOfPro']);
            $v[$m]['AmOfPur']       = $arr['AmOfPur'];
            $m++;
        }
            $info['status'] = 200;
            $info['msg']    = 'success';
            $info['data']['rows']  = $v;
            $info['data']['entries']     = $v;
            $info['data']['id'] = $v[0]['Date'];
            die(json_encode($info));
    }

    //删除BOM设计
    public function del() {
        $this->purview_model->checkpurview(139);
        $id   = $this->input->get('id',TRUE);
        if ($id) {
            $sql = "delete from t_MatEst where Date=\"$id\"";
            $result = $this->db->query($sql);
               $this->cache_model->delsome(MATEST);
                $this->data_model->logs('删除物料生产预估：'.$id);
                die('{"status":200,"msg":"success","id":["'.$id.'"]}');
        }
    }
}
