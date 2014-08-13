
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

// number of points
C=4000;

// inaccuracy 
S=8;

O=0.5;
F=0.9;

// array of points
u=[];

/* Initialize the positions of each point and the
 * hero/villain assignments of each
 */
T=function(){
// short hand for common functions
r=M.random;
f=M.floor;
// randomize start positions of points
for(i=0;i<C;++i)
 u[i]={x:r()*a.width,y:r()*a.height};

// set up hero/villain assignments
for(i in u){
 // v refers to the current player
 v=u[i];

 // randomly chose the hero if it's not set
 if(!v.h)
  v.h=u[f(r()*C)];

 // set the hero's villain to be current player
 v.h.v=v;

 // randomly chose the villain if it's not set
 if(!v.v)
  v.v=u[f(r()*C)];

 // set the villain's hero to be current player
 v.v.h=v
}
}

// step function
p=function(){
 // canvas stuff
 c.fillStyle="rgba(0,0,0,"+F+")";
 c.beginPath();
 c.fillRect(0,0,a.width,a.height);
 c.fillStyle="rgba(255,255,255,"+O+")";

 // draw each dot
 u.map(function(q){c.fillRect(q.x,q.y,1,1)});
 c.fill();

 // calculate the next position of each point 
 u.map(function(q){

  // vector from villain to hero
  h=mi(q.h,q.v);

  // vector from villain to self
  n=mi(q,q.v);

  // this is the scalar value which is multiplied by h to compute the projection of n onto h
  s=dp(h,n)/dp(h,h);

  // this is the scalar value which if multiplied by h, calculates a point 2 units past h along the vector
  r=1+2/md(h);

  // vector from the current point to the computed point
  t=mi(  
    ad(     // put the computed point into the global context
        q.v,    // global position of villain
        sm(     // compute the point furthest along the vector h (from the 2 multipliers)
            h,          // hero relative to villain
            s<r?r:s     // the larger of the two multipliers
        )
    ),
    q
  );

  // if the distance from where we are to the destination is less than some constant
  if(md(t)>S){
   
   // move towards the destination a distance of S
   d=ad(q,sc(t,S));

   // set a and b which will later be transfered into x and y respectively
   q.a=d.x;
   q.b=d.y
  }else{
   // stay where we are
   q.a=q.x;
   q.b=q.y
  }
 });

 // update the position of each point if its new position is on the screen
 u.map(function(q){
  if(q.a>0&&q.a<a.width)q.x=q.a;
  if(q.b>0&&q.b<a.height)q.y=q.b
 });
 timer = setTimeout(p,1)
}
T();
p();

function dp(v,w){return v.x*w.x+v.y*w.y}        // dot product
function md(v){return M.sqrt(dp(v,v))}          // modulus
function ad(v,w){return{x:v.x+w.x,y:v.y+w.y}}   // vector addition
function sm(v,s){return{x:v.x*s,y:v.y*s}}       // scalar multiplication
function mi(v,w){return ad(v,sm(w,-1))}         // vector subtraction
function sc(v,w){return sm(sm(v,1/md(v)),w)}    // scale a vector to a specified length
}
