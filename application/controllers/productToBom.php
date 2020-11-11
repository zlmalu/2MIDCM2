<?php if(!defined('BASEPATH')) exit('No direct script access allowed');

class ProductToBom extends CI_Controller
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
        $this->load->view('productToBom/index');
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

function object_array($array) {
    if(is_object($array)) {
        $array = (array)$array;
    } if(is_array($array)) {
        foreach($array as $key=>$value) {
            $array[$key] = object_array($value);
        }
    }
    return $array;
}
