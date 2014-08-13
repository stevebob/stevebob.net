M=Math;
r=M.random;
f=M.floor;
C=2000;
S=16;
O=0.5;
F=0.9;
u=[];
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
function p(){
 c.fillStyle="rgba(0,0,0,"+F+")";
 c.beginPath();
 c.fillRect(0,0,a.width,a.height);
 c.fill();
 c.fillStyle="rgba(255,255,255,"+O+")";
 c.beginPath();
 u.map(function(q){c.fillRect(q.x,q.y,1,1)});
 c.fill();
 u.map(function(q){;
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
 })
 u.map(function(q){
  if(q.a>0&&q.a<a.width)q.x=q.a;
  if(q.b>0&&q.b<a.height)q.y=q.b
 })
 setTimeout(p,1)
}
p();
function dp(v,w){return v.x*w.x+v.y*w.y}
function md(v){return M.sqrt(dp(v,v))}
function ad(v,w){return{x:v.x+w.x,y:v.y+w.y}}
function sm(v,s){return{x:v.x*s,y:v.y*s}}
function mi(v,w){return ad(v,sm(w,-1))}
function sc(v,l){return sm(sm(v,1/md(v)),l)}

