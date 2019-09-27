var list=[1,2,5,3,4,0,6,7,8]
var sound = document.getElementById("myaudio");
function new_game()
{
eight=new eight_puzzle(list);
var x=[];
list=[]
var i=0;
while (i<9)
{
  var v=Math.random();
  v=parseInt(v*9);
  if( !x.includes(v) )
  {
    x.push(v)
    list.push(v)
    i++;
  }
}
}
function solvable()
{
  var count=0;
  for(var k=0;k<8;k++)
  {
  for(var j=1;j<9;j++)
  if (list[j]!=0 && list[k]!=0 && list[j]<list[k])
  count++;
  }

  if (count%2!=0)
  return true;
  else
    return false;

}
function draw_game(l)
{
  for (i=0;i<9;i++)
  {
    var id=document.getElementById("b"+i)
    if (l[i]!=0)
      {
        id.innerHTML=l[i];
        if(id.classList.contains("null"))
            id.classList.replace("null","not_null");
      }
    else
    {
      id.innerHTML='';
      if(id.classList.contains("not_null"))
          id.classList.replace("not_null","null");
    }
  }
}
class node
{
  constructor (state,action,parent,cost)
  {
    this.state=state
    this.action=action
    this.cost=cost
    this.parent=parent
  }
}
class eight_puzzle
{
  constructor (initial_state)
  {
    this.initial_state=initial_state;
    this.closed=[];
  }
  static goal_test(state)
  {
      if(state[0]==0 && state[1]==1 && state[2]==2 && state[3]==3 && state[4]==4 && state[5]==5 && state[6]==6 && state[7]==7 && state[8]==8)
        return true;
      return false;
  }
  static search(state,x)
  {
    for (var i=0;i<9;i++)
        if(state[i]==x)
            return i;
  }
  closed_test (closed,state)
  {
    for (var i=0;i<closed.length;i++)
    {
      console.log("closed test "+closed[i]);
      if(closed[i][0]==state[0] && closed[i][1]==state[1] && closed[i][2]==state[2] && closed[i][3]==state[3] && closed[i][4]==state[4] && closed[i][5]==state[5] && closed[i][6]==state[6] && closed[i][7]==state[7] && closed[i][8]==state[8])
        return true
    }
    return false
  }
  copy(state)
  {
    var s=[]
    for (i=0;i<state.length;i++)
      s[i]=state[i]
    return s;
  }
  create_child(n)
  {
    var childnode = []
    var x=eight_puzzle.search(n.state,0);
    var state,n1;
    if (x>=0 && x<=5)
    {
      //document.write("down")
      state=this.copy(n.state)
      state[x]=state[x+3]
      state[x+3]=0
      n1=new node(state,40,n,n.cost+1)
      childnode.push(n1)
    }
    if (x>=3 && x<=8)
    {
      //document.write("up")
      state=this.copy(n.state)
      state[x]=state[x-3]
      state[x-3]=0
      n1=new node(state,38,n,n.cost+1)
      childnode.push(n1)
    }
    if (x==1 || x==2 || x==4 || x==5 || x==7 || x==8)
    {
      //document.write("left")
       state=this.copy(n.state)
       state[x]=state[x-1]
       state[x-1]=0
       n1=new node(state,37,n,n.cost+1)
       childnode.push(n1)
    }
    if (x==1 || x==0 || x==4 || x==3 || x==7 || x==6)
    {
      //document.write("right")
      state=this.copy(n.state)
      state[x]=state[x+1]
      state[x+1]=0
      n1=new node(state,39,n,n.cost+1)
      childnode.push(n1)
    }
    return childnode
  }
  path(node)
  {
    var p=[];
    while (node!=null)
    {
      p.push(node);
      node=node.parent;
    }

    return p.reverse()
  }
  heuristic(current_state)
  {
    var map={'0':[0,0],'1':[0,1],'2':[0,2],'3':[1,0],'4':[1,1],'5':[1,2],'6':[2,0],'7':[2,1],'8':[2,2]};
    var goal_state=[0,1,2,3,4,5,6,7,8];
    var h=0;
    for (var i=0;i<9;i++)
    {
      var a=eight_puzzle.search(goal_state,i);
      var b=eight_puzzle.search(current_state,i);
      a=map[a.toString()];
      b=map[b.toString()];
      h+=Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);
    }
  return h;
  }
  A_star()
  {
    var closed=[];
    var fringe=[];
    var n=new node(this.initial_state,0,null,0);
    var h=this.heuristic(n.state);
    fringe.push([n,h]);
    while (fringe.length>0)
    {
       fringe.sort();
       fringe.reverse();
       for(var z=0;z<fringe.length;z++)
            console.log(fringe[z][0].state+",,,,,,"+fringe[z][1]);
            console.log("****************************");
        var n=fringe.pop();
        if (eight_puzzle.goal_test(n[0].state))
        {
          return this.path(n[0]);
        }
        else if (! this.closed_test(closed,n[0].state))
        {
          closed.push(n[0].state);
          var f=this.create_child(n[0]);
          for (var j=0;j<f.length;j++)
          {
            var h=this.heuristic(f[j].state);
            fringe.push([f[j],h]);
          }
        }
    }
  }
  Next(list)
  {
    var n=new node(list,0,null,0);
    var f=this.create_child(n);
    var fringe=[];
    for (var j=0;j<f.length;j++)
    {
      var h=this.heuristic(f[j].state);
      fringe.push([f[j],h]);
    }
    fringe.sort();
    fringe.reverse();
    var p=fringe.pop();
    while(this.closed_test(this.closed,p[0].state))
      p=fringe.pop()
    this.closed.push(p[0].state)
    console.log(this.closed.length+",,,,"+p[0].state);
    return p[0].state
  }
}
var eight=new eight_puzzle(list);
//new_game()
draw_game(list)
$(document).keydown(function(event)
{
  var action=event.keyCode;
  var loc_zero=eight_puzzle.search(list,0);
  var sleep=0;
  //right D,d
  if (action==39 || action==68)
  {
    var new_action=loc_zero-1
    if (new_action==0 || new_action==3 ||new_action==6 || new_action==1 || new_action==4 ||new_action==7)
    {
       sound.play();
      list[loc_zero]=list[new_action]
      list[new_action]=0
    }
    draw_game(list)
  }
  //left A,a
  if (action==37 || action==65)
  {
    var new_action=loc_zero+1
    if (new_action%3!=0)
    {
      sound.play();
      list[loc_zero]=list[new_action]
      list[new_action]=0
    }
    draw_game(list)
  }
  //up W,w
  if (action==40 || action==83)
  {
    var new_action=loc_zero-3
    if (new_action>=0 && new_action<=5)
    {
      sound.play();
      list[loc_zero]=list[new_action]
      list[new_action]=0
    }
    draw_game(list)

  }
  //down S,s
  if (action==38 || action==87)
  {
    var new_action=loc_zero+3
    if (new_action>=3 && new_action<=8)
    {
      sound.play();
      list[loc_zero]=list[new_action]
      list[new_action]=0
    }
    draw_game(list)
  }
  if (action==66)
  {
    puzzle=new eight_puzzle(list);
    path=puzzle.A_star();
    sleep=path.length;
    for(var k=1;k<path.length;k++)
    {
      var loc=eight_puzzle.search(list,0);
      if(path[k].action==37)
      {
        list[loc]=list[loc-1];
        list[loc-1]=0
      }
      else if(path[k].action==38)
      {
        list[loc]=list[loc-3];
        list[loc-3]=0
      }
      else if(path[k].action==39)
      {
        list[loc]=list[loc+1];
        list[loc+1]=0
      }
      else if(path[k].action==40)
      {
        list[loc]=list[loc+3];
        list[loc+3]=0
      }

      (function(l){
        setTimeout(function() {draw_game(l);},k*1000);
      })(path[k].state);
    }
  }
  if (action==67)
  {
    list=eight.Next(list);
    sound.play();
    draw_game(list);
  }
  if (eight_puzzle.goal_test(list))
  {
    var result=document.getElementById("result");

    new_game()
    while(!solvable(list))
    new_game()

    setTimeout(function()
    {result.style.display="block";},1000*sleep)

    setTimeout(draw_game,2000+1000*sleep,list)

    setTimeout(function()
    {result.style.display="none";},2000+1000*sleep)

  }

});
