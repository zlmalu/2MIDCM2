<?php if(!defined('BASEPATH')) exit('No direct script access allowed');

class MetPro extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->purview_model->checkpurview(132);
        $this->load->model('data_model');
        $this->uid = $this->session->userdata('uid');
    }

    public function index()
    {
//        $sql = "select PK_BOMCat_ID2,Name from t_bom_category2 where level=1";
//        $result = $this->db->query($sql);
//        $name= array();
//        $Cat_ID2= array();
//        foreach ($result->result() as $row)
//        {
//            $arr = object_array($row);
//            array_push($name,$arr["Name"]);
//            array_push($Cat_ID2,$arr["PK_BOMCat_ID2"]);
//        }
//
//        $data=array("name"=>$name,"Cat_ID2"=>$Cat_ID2);
        $this->load->view('metPro/index');
    }
    public function initUnitClass()
    {
        $sql = "select id, name from t_unit";
        $result = $this->db->query($sql);

        $name= array();
        $id= array();
        foreach ($result->result() as $row)
        {
            $arr = object_array($row);
            array_push($name,$arr["name"]);
            array_push($id,$arr["id"]);
        }

        $data=array("name"=>$name,"id"=>$id);
        die(json_encode($data));
    }
    public function save()
    {
        $act  = str_enhtml($this->input->get('act',TRUE));
        $id = intval($this->input->post('id',TRUE));
        // $data['linkmans']    = $this->input->post('linkMans',TRUE);
        $data = array();
        $data['Name']      = str_enhtml($this->input->post('name',TRUE));
        strlen($data['Name']) < 1 && die('{"status":-1,"msg":"名称不能为空"}');
        $data['Desc']      = str_enhtml($this->input->post('desc',TRUE));
        $data['Formula']      = str_enhtml($this->input->post('formula',TRUE));
        $data['PK_WPCat_ID']      = str_enhtml($this->input->post('BOMCat_ID2',TRUE));
        if ($act=='add') {
            $this->purview_model->checkpurview(59);
            $this->mysql_model->db_count(BETWEENUNIT,'(Name="'.$data['Name'].'")') > 0 && die('{"status":-1,"msg":"已存在该往来单位名称"}');
            $name = $data['Name'];
            $id = $this->mysql_model->db_inst(WP_CAT, $data);
            $this->cache_model->delsome(BETWEENUNIT);
            $this->data_model->logs('操作人：ID_' . $name . '新增物料模板信息');
            //回传数据
//            $data = array('id' => $id,'name' => $data['Name'],'remark' => $data['Desc'],
//                'BU_Cat_Name' => $data['BU_Cat'] == 1 ? '客户' : ($data['BU_Cat'] == 2 ? '厂家' : ($data['BU_Cat'] == 3 ? '客户兼厂家' : '第三方')),
//                'Industry_ID'  => $data['Industry_ID'], 'Area_ID' => $data['Area_ID'],
//                'Industry' => str_enhtml($this->input->post('industryname',TRUE)),'Area' => str_enhtml($this->input->post('areaname',TRUE)),
//                'Taxrate' => $data['Taxrate'] * 100,
//                'telephone' => $phone,'StatusName' =>  $data['Status'] == 0 ? '不正常' : '正常',
//                'Status' => $data['Status'],'BU_Cat' => $data['BU_Cat']);
            $data['Level1']   = str_enhtml($this->input->post('Level1',TRUE));
            $data['Level2']   = str_enhtml($this->input->post('Level2',TRUE));
            $data['id']   = $id;
            $data['UnitClass']   = str_enhtml($this->input->post('unitClass',TRUE));

            die('{"status":200,"msg":"success","data":'.json_encode($data).'}');
        } elseif ($act=='update') {
            $name = $data['Name'];
            $Desc = $data['Desc'];
            $Formula = $data['Formula'];
            $sql = "update t_WPCat t set t.Name=\"$name\" ,t.Desc=\"$Desc\", t.Formula=\"$Formula\"
             where PK_WPCat_ID=$id";
            $result = $this->db->query($sql);
//            $this->purview_model->checkpurview(60);
//            $data['Modify_ID'] = $this->uid;
//            $data['Modify_Date'] = date('Y-m-d H:i:s',time());
//            //$name = $this->mysql_model->db_one(BETWEENUNIT,'(PK_BU_ID='.$id.')','name');
//            //$sql = $this->mysql_model->db_upd(BETWEENUNIT,array_filter($data),'(PK_BU_ID='.$id.')');
//            $sql = $this->mysql_model->db_upd(BETWEENUNIT,$data,'(PK_BU_ID='.$id.')');
//            if ($sql) {
//                $this->cache_model->delsome(ORDERPUR);
//                $this->cache_model->delsome(BETWEENUNIT);
//                $this->cache_model->delsome(SALEORDER);
//                $this->data_model->logs('修改了往来单位:'.$id);
            //回传数据
//                $data = array('id' => $id,'name' => $data['Name'],'remark' => $data['Desc'],
//                    'BU_Cat_Name' => $data['BU_Cat'] == 1 ? '客户' : ($data['BU_Cat'] == 2 ? '厂家' : ($data['BU_Cat'] == 3 ? '客户兼厂家' : '第三方')),
//                    'Industry_ID'  => $data['Industry_ID'], 'Area_ID' => $data['Area_ID'],
//                    'Industry' => str_enhtml($this->input->post('industryname',TRUE)),'Area' => str_enhtml($this->input->post('areaname',TRUE)),
//                    'Taxrate' => $data['Taxrate'] * 100,
//                    'telephone' => $phone,'StatusName' =>  $data['Status'] == 0 ? '不正常' : '正常',
//                    'Status' => $data['Status'],'BU_Cat' => $data['BU_Cat']);
            $data['id']   = $id;
            $data['UnitClass']   = str_enhtml($this->input->post('unitClass',TRUE));
            die('{"status":200,"msg":"success","data":'.json_encode($data).'}');
        } else {
            die('{"status":-1,"msg":"修改失败"}');
        }
    }

    public function init()
    {
        $sql = "select PK_WPCat_ID,Name from t_WPCat";
        $result = $this->db->query($sql);
        $Cat_ID= array();
        $name = array();
        foreach ($result->result() as $row)
        {
            $arr = object_array($row);
            array_push($Cat_ID,$arr["PK_WPCat_ID"]);
            array_push($name,$arr["Name"]);
        }

        $data=array("name"=>$name,"Cat_ID2"=>$Cat_ID);
        die(json_encode($data));
    }
    public function level1Change()
    {
        $Cat_ID2 = $_POST['Cat_ID2'];
        $sql = "select PK_BOMCat_ID2,Name from t_bom_category2 where level=2 and Up_Cat2=$Cat_ID2";
        $result = $this->db->query($sql);
        $name= array();
        $Cat_ID2= array();
        foreach ($result->result() as $row)
        {
            $arr = object_array($row);
            array_push($name,$arr["Name"]);
            array_push($Cat_ID2,$arr["PK_BOMCat_ID2"]);
        }

        $data=array("name"=>$name,"Cat_ID2"=>$Cat_ID2);
        echo json_encode($data);
    }

    public function findVal()
    {
        $data['val'] = 3;
        echo json_encode($data);
    }

    public function del(){
//        $this->purview_model->checkpurview(61);
        $id = str_enhtml($this->input->post('id',TRUE));
//        if (strlen($id) > 0) {
//            $this->mysql_model->db_count(SALEORDER,'(Customer_ID in('.$id.'))')>0 && die('{"status":-1,"msg":"其中有客户已发生业务不可删除"}');
//            $this->mysql_model->db_count(ORDERPUR,'(Supplier_ID in('.$id.'))')>0 && die('{"status":-1,"msg":"其中有客户已发生业务不可删除"}');
        $name = $this->mysql_model->db_select(MATTEMPLATE,'(PK_MT_ID in('.$id.'))','name');
//            if (count($name)>0) {
//                $name = join(',',$name);
//            }
        $sql = $this->mysql_model->db_del(WP_CAT,'(PK_WPCat_ID in('.$id.'))');
        if ($sql) {
            $this->cache_model->delsome(MATTEMPLATE);
//                $this->data_model->logs('删除物料模板:PK_MT_ID='.$id.' 名称:'.$name);
            die('{"status":200,"msg":"success","data":{"msg":"","id":['.$id.']}}');
        } else {
            die('{"status":-1,"msg":"删除失败"}');
        }
//        }
    }
    /**
     * showdoc
     * @catalog 开发文档/用户
     * @title  物料类别
     * @description bom类别保存的接口
     * @method get
     * @url https://www.2midcm.com/bomCategory/add
     * @param PK_BOMCat_ID1 必选 string 类别编码
     * @param Name 必选 string BOM类别名称
     * @param Desc 可选 string 描述
     * @param  head_id 必选 string 负责人
     * @param  creator_id 必选  创建人
     * @return {"status":200,"msg":"success,"share":"true","userid":1,"name":"小阳","username":"admin"}
     * @return_param status static 1：'200'注册成功;2："-1"注册失败
     * @remark 这里是备注信息
     * @number 1
     */
    public function handleProduct()
    {
        $postName = $_POST['name'];
        $postAttribute = $_POST['attribute'];
        $postNumber = $_POST['number'];
        $postId = $_POST['rowid'];
        if($postId!=13){
            $attributeArr  = explode('*',$postAttribute);
            $length = $attributeArr[0];
            $norminalWidth = $attributeArr[1];
            $produceWidth = $attributeArr[2];
            $high = $attributeArr[3];
            $rearPanel300Arr = Array("number"=>intval(($high-150)/300)*$postNumber*2,'attribute'=>Array("length"=>$length,"totalLength"=>(intval(($high-150)/300)*$postNumber*2)*($length+11+6)));
            $rearPanel300 = array("id"=>111,"name"=>"背板300","number"=>$rearPanel300Arr["number"],"attribute"=>$rearPanel300Arr['attribute']['length'].'*'.$rearPanel300Arr['attribute']['totalLength'],"attribute_introduction"=>"长度*总长","_parentId"=>$_POST['rowid']);
            $frontPanelArr = Array("number"=>$postNumber,"attribute"=>Array("length"=>$length,"totalLength"=>$postNumber*($length+22+6)));
            $frontPanel = array("id"=>115,"name"=>"前板","number"=>$frontPanelArr["number"],"attribute"=>$frontPanelArr["attribute"]["length"].'*'.$frontPanelArr["attribute"]["totalLength"],"attribute_introduction"=>"长度*总长","_parentId"=>$_POST['rowid']);
            $rearPanel150Arr = Array("number"=>(($high-150)/300-intval(($high-150)/300))*2*$postNumber*2,'attribute'=>Array("length"=>$length,"totalLength"=>((($high-150)/300-intval(($high-150)/300))*2*$postNumber*2)*($length+11+6)));
            $rearPanel150 = array("id"=>11333,"name"=>"背板150","number"=>$rearPanel150Arr["number"],"attribute"=>$rearPanel150Arr['attribute']['length'].'*'.$rearPanel150Arr['attribute']['totalLength'],"attribute_introduction"=>"长度*总长","_parentId"=>$_POST['rowid']);
            $bootomPanelArr = array("number"=>$postNumber,"attribute"=>array("length"=>$length,"width"=>$produceWidth,"totalLength"=>$postNumber*($length-4+6)));

            $bootomPanel = array("id"=>114,"name"=>"底层板","number"=>$bootomPanelArr["number"],"attribute"=>$bootomPanelArr["attribute"]["length"].'*'.$bootomPanelArr["attribute"]["width"].'*'.$bootomPanelArr["attribute"]["totalLength"],"attribute_introduction"=>"长度*宽度*总长","_parentId"=>$_POST['rowid']);
            $columnBodyArr =  Array("number"=>$postNumber*2,'attribute'=>Array("high"=>$high-30,"width"=>$norminalWidth-98));
            $columnBody = array("id"=>13,"name"=>"立柱体","number"=>$columnBodyArr["number"],"attribute"=>$columnBodyArr["attribute"]["high"].'*'.$columnBodyArr["attribute"]["width"],"attribute_introduction"=>"高度*基脚","specifications_introduction"=>"名义宽度*生产宽度*高度","_parentId"=>$_POST['rowid']);

            $rows = array(0=>$columnBody,1=>$rearPanel300,2=>$rearPanel150,3=>$bootomPanel,4=>$frontPanel);
            echo json_encode($rows);
        }else{
            $postSpecifications = $_POST['specifications'];
            $postSpecificationsArr  = explode('*',$postSpecifications);
            $norminalWidth = $postSpecificationsArr[0];
            $produceWidth = $postSpecificationsArr[1];
            $high = $postSpecificationsArr[2];
            $squareTubeArr = array("attribute"=>array("high"=>$high-30,"totalLength"=>(($high-30)+5)*$postNumber));
            $squareTube = array("id"=>123,"name"=>"方管30*70*2.0","number"=>$postNumber,"attribute"=>$squareTubeArr["attribute"]["high"].'*'.$squareTubeArr["attribute"]["totalLength"],"attribute_introduction"=>"高度*总长","specifications"=>"ok","_parentId"=>$_POST['rowid']);

            $squareTube1Arr = array("attribute"=>array("width"=>$norminalWidth-98,"totalLength"=>(($norminalWidth-98)+5)*$postNumber));
            $squareTube1 = array("id"=>124,"name"=>"方管25*50*1.5","number"=>$postNumber,"attribute"=>$squareTube1Arr["attribute"]["width"].'*'.$squareTube1Arr["attribute"]["totalLength"],"attribute_introduction"=>"基脚横梁*总长","specifications"=>"ok","_parentId"=>$_POST['rowid']);
            $squareTube2 = array("id"=>125,"name"=>"方管10*30*1.2","number"=>$postNumber,"attribute"=>$squareTube1Arr["attribute"]["width"].'*'.$squareTube1Arr["attribute"]["totalLength"],"attribute_introduction"=>"基脚横梁*总长","specifications"=>"ok","_parentId"=>$_POST['rowid']);
            $squareTube3 = array("id"=>127,"name"=>"方管25*50*1.5","number"=>$postNumber,"attribute"=>"95*".$postNumber*100,"attribute_introduction"=>"基脚立柱*总长","specifications"=>"ok","_parentId"=>$_POST['rowid']);

            $adjustingBolt = array("id"=>128,"name"=>"调整螺栓","number"=>$postNumber*2,"attribute"=>"","attribute_introduction"=>"","specifications"=>"ok","_parentId"=>$_POST['rowid']);
            $rows = array(0=>$squareTube,1=>$squareTube1,2=>$squareTube2,3=>$squareTube3,4=>$adjustingBolt);
            echo json_encode($rows);
        }
    }

}
