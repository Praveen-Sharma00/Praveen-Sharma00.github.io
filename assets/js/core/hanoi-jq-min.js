let DiskID=-1;let TableRowCount=0;let UndoCount=0;let toh;class Disk
{constructor(Width="280")
{DiskID++;this.Color=this.GetRandomColor();this.Width=Width;this.ID=DiskID}
GetRandomColor=function()
{let letters='0123456789ABCDEF';let color='#';for(let i=0;i<6;i++)
{color+=letters[Math.floor(Math.random()*16)]}
return color}}
class ActionRecord
{SourceRecordArray=new Array();DestinationRecordArray=new Array();a;b;RecordMove=function(a,b)
{this.a=a;this.b=b;this.SourceRecordArray.push(this.a);this.DestinationRecordArray.push(this.b);this.UpdateMoveTable()}
UpdateMoveTable=function()
{TableRowCount++;let MoveSoFar=document.getElementById("MovesTable");MoveSoFar.innerHTML=MoveSoFar.innerHTML+"<tr><th>"+TableRowCount+"</th><td>"+this.a+"</td><td>"+this.b+"</tr>"}}
let ActionObject=new ActionRecord();class Tower
{TowerID;TowerStack=new Array();constructor(TowerID)
{this.TowerID=TowerID}
UpdateTower=function()
{for(let i=0;i<this.TowerStack.length;i++)
{var s=$("#tower-"+this.TowerID);$(s).append("<li id='"+this.TowerStack[i].id+"'><button class='btn btn-round disk'\
             style='background-color:"+this.TowerStack[i].color+";width:"+this.TowerStack[i].width+"px;'></button></li> ")}}}
class TOH
{GivenSourceIndex;GivenDestinationIndex;RemovedDiskRecord;constructor(No_Of_Disk)
{this.No_Of_Disk=No_Of_Disk}
DiskStack=new Array();A=new Tower(1);B=new Tower(2);C=new Tower(3);InitialStack=new Array();TowerObjectSet=[this.A,this.B,this.C];CreateDisks=function()
{for(let i=0;i<this.No_Of_Disk;i++)
{let CurrentDisk=new Disk();let CurrentDiskWidth=CurrentDisk.Width-(25*i);this.DiskStack.push({id:parseInt(CurrentDisk.ID),color:CurrentDisk.Color,width:CurrentDiskWidth})}
this.InitialStack=Array.from(this.DiskStack)}
GetSourceDestinationStack=function(from,to)
{switch(from){case "a":this.GivenSourceIndex=0;break;case "b":this.GivenSourceIndex=1;break;case "c":this.GivenSourceIndex=2;break}
switch(to){case "a":this.GivenDestinationIndex=0;break;case "b":this.GivenDestinationIndex=1;break;case "c":this.GivenDestinationIndex=2;break}}
isValidMove=function(from,to,UndoStatus)
{if(from===to)
{alert("Source & Destination Can't be Same")}
this.GetSourceDestinationStack(from,to);this.SourceTowerStack=this.TowerObjectSet[this.GivenSourceIndex].TowerStack;this.DestinationTowerStack=this.TowerObjectSet[this.GivenDestinationIndex].TowerStack;let e_Source=(this.TowerObjectSet[this.GivenSourceIndex].TowerStack);let DiskID_List_A=e_Source.map(function(el){return el.id});let e_Destination=(this.TowerObjectSet[this.GivenDestinationIndex].TowerStack);var DiskID_List_B=e_Destination.map(function(el){return el.id});if(this.SourceTowerStack.length==0)
{alert("Nothing to move from Tower '"+from+"' to Tower '"+to+"' !");return!1}
else if(UndoStatus==-1&&(parseInt(DiskID_List_A[DiskID_List_A.length-1]))<(parseInt(DiskID_List_B[DiskID_List_B.length-1])))
{alert("Invalid Move !");return!1}
return!0}
IsWin=function(){if(JSON.stringify(this.B.TowerStack)==JSON.stringify(this.InitialStack)||JSON.stringify(this.C.TowerStack)==JSON.stringify(this.InitialStack)){return!0}
return!1}
MoveDisk=function(from,to,UndoStatus)
{if(this.isValidMove(from,to,UndoStatus))
{this.RemovedDiskRecord=this.TowerObjectSet[this.GivenSourceIndex].TowerStack.pop();$("#tower-"+(this.GivenSourceIndex+1)).empty();this.TowerObjectSet[this.GivenSourceIndex].UpdateTower();this.TowerObjectSet[this.GivenDestinationIndex].TowerStack.push(this.RemovedDiskRecord);$("#tower-"+(this.GivenDestinationIndex+1)).empty();let e=(this.TowerObjectSet[this.GivenDestinationIndex].TowerStack);this.TowerObjectSet[this.GivenDestinationIndex].UpdateTower();if(UndoStatus==-1){ActionObject.RecordMove(from,to)}
if(this.IsWin())
{$("#MovesForm").empty();$("#MovesForm").html("<h3>You Did it in "+TableRowCount+" Moves With "+UndoCount+" Undo(s) !</h3>")}}
else{}}
RemoveRecord=function()
{$("#MovesTable tr:last").remove()}
UndoMove=function(src,des)
{this.MoveDisk(src,des,1);this.RemoveRecord()}}
$("#create-btn").click(function(){let n=parseInt($("#no_of_disks").val());if(n>10)
{alert("As of now limit is for 10 Disks !")}
else{toh=new TOH(n);toh.CreateDisks();toh.TowerObjectSet[0].TowerStack=Array.from(toh.DiskStack);toh.TowerObjectSet[0].UpdateTower();$("#no_of_disks").attr("disabled","true");$("#create-btn").attr("disabled","true")}
$("#restart").click(function(){window.location.reload()});return!1});$("#Move").click(function(){let source=(String($("#from").val()).toLowerCase());let destination=(String($("#to").val()).toLowerCase());if(source===""||destination==="")
{alert("You can't proceed without providing \nSource & Destination")}
else{toh.MoveDisk(source,destination,-1)}
return!1});$("#Undo").click(function(){UndoCount++;let UndoDestination=ActionObject.SourceRecordArray[ActionObject.SourceRecordArray.length-1];let UndoSource=ActionObject.DestinationRecordArray[ActionObject.DestinationRecordArray.length-1];toh.UndoMove(UndoSource,UndoDestination);ActionObject.SourceRecordArray.pop();ActionObject.DestinationRecordArray.pop();TableRowCount--})