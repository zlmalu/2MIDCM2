<?php if(!defined('BASEPATH')) exit('No direct script access allowed');

class department extends CI_Controller {


    public function __construct(){
        parent::__construct();
        $this->purview_model->checkpurview(120);
        $this->uid   = $this->session->userdata('uid');
        $this->load->model('data_model');
    }

    public function index(){
    /*        $this->load->model('mysql_model');
            $this->mysql_model->countQty();
            exit;*/
       $this->load->view('department/index');
}
    public function add(){

        $this->load->view('department/add');
    }

    /**
     * showdoc
     * @catalog 开发文档
     * @title 部门管理
     * @description 部门管理的接口
     * @method get
     * @url https://www.2midcm.com/workcenter/add
     * @param pk_dept_id 必选 string 部门编号
     * @param wc_name 必选 string 工作中心名称
     * @param desc 可选 string 描述
     * @param  head_id 必选 string 负责人
     * @param  creator_id 必选  创建人
     * @return {"status":200,"msg":"success,"share":"true","userid":1,"name":"小阳","username":"admin"}
     * @return_param status static 1：'200'注册成功;2："-1"注册失败
     * @remark 这里是备注信息
     * @number 1
     */
    public function initDepartment()
    {
        $sql = "select PK_Dept_ID, Name from t_Department";
        $result = $this->db->query($sql);

        $name= array();
        $id= array();
        foreach ($result->result() as $row)
        {
            $arr = object_array($row);
            array_push($name,$arr["Name"]);
            array_push($id,$arr["PK_Dept_ID"]);
        }

        $data=array("name"=>$name,"id"=>$id);
        die(json_encode($data));
    }

    public function save(){
        $act  = str_enhtml($this->input->get('act',TRUE));
        $id   = intval($this->input->post('id',TRUE));
        $data['Name'] = str_enhtml($this->input->post('name',TRUE));
        $data['Desc'] = str_enhtml($this->input->post('desc',TRUE));
        $data['Head_ID'] = intval(str_enhtml($this->input->post('head_id',TRUE)));
        $data['UpDept_ID'] = intval(str_enhtml($this->input->post('UpDept_ID',TRUE)));
        $data['Status'] = intval(str_enhtml($this->input->post('status',TRUE)));
        if ($act=='add') {
            $this->purview_model->checkpurview(121);
            strlen($data['Name']) < 1 && die('{"status":-1,"msg":"名称不能为空"}');
            $this->mysql_model->db_count(DEPARTMENT,'(Name="'.$data['Name'].'")') > 0 && die('{"status":-1,"msg":"已存在该部门"}');
            $data['id'] = $this->mysql_model->db_inst(DEPARTMENT,$data);
            $data['headName'] = str_enhtml($this->input->post('head_name',TRUE));
            $data['StatusName'] = $data['Status'] == 0 ? '不正常' : '正常';
            if ($data['id']) {
                $this->data_model->logs('新增部门:'.$data['Name']);
                $this->cache_model->delsome(DEPARTMENT);
        $data['upName'] = str_enhtml($this->input->post('upName',TRUE));
                die('{"status":200,"msg":"success","data":'.json_encode($data).'}');
            } else {
                die('{"status":-1,"msg":"添加失败"}');
            }
        } elseif ($act=='update') {
            $this->purview_model->checkpurview(122);
            strlen($data['Name']) < 1 && die('{"status":-1,"msg":"名称不能为空"}');
            $this->mysql_model->db_count(DEPARTMENT,'(PK_Dept_ID<>'.$id.') and (Name="'.$data['Name'].'")') > 0 && die('{"status":-1,"msg":"已存在该部门"}');
            //$data['Modify_ID'] = $this->uid;
            //$data['Modify_Date'] = date('Y-m-d H:i:s',time());
            $sql = $this->mysql_model->db_upd(DEPARTMENT,$data,'(PK_Dept_ID='.$id.')');
            if ($sql) {
                $data['id'] = $id;
                $data['StatusName'] = $data['Status'] == 0 ? '不正常' : '正常';
                $data['headName'] = str_enhtml($this->input->post('head_name',TRUE));
                $this->data_model->logs('修改工作中心:'.$data['Name']);
                $this->cache_model->delsome(DEPARTMENT);
                die('{"status":200,"msg":"success","data":'.json_encode($data).'}');
            } else {
                die('{"status":-1,"msg":"修改失败"}');
            }
        }
    }


//部门列表
    public function lists() {
        $v = '';
        $data['status'] = 200;
        $data['msg']    = 'success';

        $page = max(intval($this->input->get_post('page',TRUE)),1);
        $rows = max(intval($this->input->get_post('rows',TRUE)),100);
        $key  = str_enhtml($this->input->get_post('matchCon',TRUE));
        $stt  = str_enhtml($this->input->get_post('beginDate',TRUE));
        $ett  = str_enhtml($this->input->get_post('endDate',TRUE));
        $where = '';
        if (strlen($key)>0) {
            $where .= ' and (a.PK_Dept_ID like "%'.$key.'%" or a.Head_ID like "%' . $key .'%" )';
        }
        if (strlen($stt)>0) {
            $where .= ' and Create_Date>="'.$stt.'"';
        }
        if (strlen($ett)>0) {
            $where .= ' and Create_Date<="'.$ett.' 23:59:59"';
        }


        $offset = $rows * ($page-1);
        $data['data']['page']      = $page;                                                      //当前页
        $data['data']['records']   = $this->cache_model->load_total(DEPARTMENT,'(1=1) '.$where.'');     //总条数
        $data['data']['total']     = ceil($data['data']['records']/$rows);                       //总分页数

        $list = $this->data_model->departmentList($where, ' order by PK_Dept_ID desc limit '.$offset.','.$rows.'');
        // $list = $this->cache_model->load_data(WORK_CENTER,'(Status=1) '.$where.' order by PK_WC_ID desc limit '.$offset.','.$rows.'');
        foreach ($list as $arr=>$row) {
            $v[$arr]['id']           = intval($row['PK_Dept_ID']);
            $v[$arr]['Name']         = $row['Name'];
            $v[$arr]['Desc']       = $row['Desc'];
            $v[$arr]['headName']       = $row['headName'];
            $v[$arr]['upName']       = $row['upName'];
            $v[$arr]['UpDept_ID']       = $row['UpDept_ID'];
            $v[$arr]['Head_ID']       = $row['Head_ID'];
            $v[$arr]['StatusName']       = $row['Status'] == 0 ? '不正常' : '正常';
            $v[$arr]['Status']       = $row['Status'];
        }
        $data['data']['items']   = is_array($v) ? $v : '';
        $data['data']['totalsize']  = count($list);//$this->cache_model->load_total(WORK_CENTER,'(Status=1) '.$where.' order by PK_WC_ID de
        die(json_encode($data));
    }



    //删除
    public function del(){
        $this->purview_model->checkpurview(123);
        $id = intval($this->input->post('id',TRUE));
        $data = $this->mysql_model->db_one(DEPARTMENT,'(PK_Dept_ID='.$id.')');
        if (count($data) > 0) {
            $this->mysql_model->db_count(USER,'(Part_ID='.$id.')')>0 && die('{"status":-1,"msg":"已发生业务不可删除"}');
            $sql = $this->mysql_model->db_del(DEPARTMENT,'(PK_Dept_ID='.$id.')');
            if ($sql) {
                $this->data_model->logs('删除部门:ID='.$id.' 名称：'.$data['Name']);
                $this->cache_model->delsome(DEPARTMENT);
                die('{"status":200,"msg":"success"}');
            } else {
                die('{"status":-1,"msg":"修改失败"}');
            }
        }
    }



}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */
