
var a;
var c;
$(function(){
    a = $("#hs")[0];
    console.debug(a);
    c = a.getContext('2d');
    function stop() {
        clearTimeout(timer);

        $("#hs").click(function() {
            p();
            $("#hs").click(T);
        });

    }
    setTimeout(stop, 5000);

    hero();
});


var timer;
var T, p;
function hero() {
M=Math;
C=4000;
S=8;
O=0.5;
F=0.9;
u=[];
T=function(){
r=M.random;
f=M.floor;
for(i=0;i<C;++i)
 u[i]={x:r()*a.width,y:r()*a.height};
for(i in u){
 v=u[i];
 while(!v.h)
  v.h=u[f(r()*C)];
 v.h.v=v;
 while(!v.v)
  v.v=u[f(r()*C)];
 v.v.h=v
}
}
p=function(){
 c.fillStyle="rgba(0,0,0,"+F+")";
 c.beginPath();
 c.fillRect(0,0,a.width,a.height);
 c.fillStyle="rgba(255,255,255,"+O+")";
 u.map(function(q){c.fillRect(q.x,q.y,1,1)});
 c.fill();
 u.map(function(q){
  h=mi(q.h,q.v);
  n=mi(q,q.v);
  s=dp(h,n)/dp(h,h);
  r=1+2/md(h);
  t=mi(ad(q.v,sm(mi(q.h,q.v),s<r?r:s)),q);
  if(md(t)>S){
   d=ad(q,sc(t,S));
   q.a=d.x;
   q.b=d.y
  }else{
   q.a=q.x;
   q.b=q.y
  }
 });
 u.map(function(q){
  if(q.a>0&&q.a<a.width)q.x=q.a;
  if(q.b>0&&q.b<a.height)q.y=q.b
 });
 timer = setTimeout(p,1)
}
T();
p();

function dp(v,w){return v.x*w.x+v.y*w.y}
function md(v){return M.sqrt(dp(v,v))}
function ad(v,w){return{x:v.x+w.x,y:v.y+w.y}}
function sm(v,s){return{x:v.x*s,y:v.y*s}}
function mi(v,w){return ad(v,sm(w,-1))}
function sc(v,w){return sm(sm(v,1/md(v)),w)}
}
