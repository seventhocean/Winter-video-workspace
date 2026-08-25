import React from "react";
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from "remotion";

const P={paper:"#f5f0e7",ink:"#10151c",night:"#081019",blue:"#2563ff",cyan:"#55d8ff",red:"#f0523b",lime:"#a8f060",white:"#fffdf8",muted:"#7d7b76"};
const mono='"SFMono-Regular",Menlo,monospace';
const serif='"Bodoni 72","Songti SC",serif';
const cl=(v:number)=>Math.max(0,Math.min(1,v));
const q=(t:number,a:number,b:number)=>Easing.bezier(.22,.75,.18,1)(cl((t-a)/(b-a)));
const bezier=(u:number,p0:[number,number],p1:[number,number],p2:[number,number],p3:[number,number])=>{
  const v=1-u;
  return [v*v*v*p0[0]+3*v*v*u*p1[0]+3*v*u*u*p2[0]+u*u*u*p3[0],v*v*v*p0[1]+3*v*v*u*p1[1]+3*v*u*u*p2[1]+u*u*u*p3[1]] as const;
};

const Grid=({dark=false}:{dark?:boolean})=><div style={{position:"absolute",inset:0,opacity:dark?.18:.08,backgroundImage:`linear-gradient(${dark?"#fff":"#10151c"} 1px,transparent 1px),linear-gradient(90deg,${dark?"#fff":"#10151c"} 1px,transparent 1px)`,backgroundSize:"72px 72px"}}/>;
const Label=({children,dark=false}:{children:React.ReactNode;dark?:boolean})=><div style={{position:"absolute",left:54,top:38,fontFamily:mono,fontWeight:800,fontSize:15,letterSpacing:4,color:dark?"#8da8bd":P.muted}}>{children}</div>;
const Kicker=({children}:{children:React.ReactNode})=><div style={{fontFamily:mono,fontSize:16,fontWeight:900,letterSpacing:4,color:P.blue}}>{children}</div>;
const Chip=({children,on=false}:{children:React.ReactNode;on?:boolean})=><div style={{padding:"10px 16px",borderRadius:99,background:on?P.blue:"rgba(255,255,255,.08)",border:`1px solid ${on?P.blue:"rgba(255,255,255,.18)"}`,fontWeight:850,fontSize:20}}>{children}</div>;

// Shotcraft: timeline-travel —— 周期事件沿时间轴推进，最后由散点合并为方法。
const TimelineTravel=({t}:{t:number})=>{
  const weeks=["这周","下周","再下周","每一周"];
  const travel=q(t,5.8,12.6), merge=q(t,14.1,16.8);
  return <AbsoluteFill style={{background:P.paper,color:P.ink,overflow:"hidden"}}><Grid/><Label>SHOT 01 / TIMELINE TRAVEL</Label>
    <div style={{position:"absolute",left:72,top:116,fontSize:70,fontWeight:950,letterSpacing:-4,opacity:1-merge}}>同一件事，为什么还要<span style={{color:P.red}}>重讲</span>？</div>
    <div style={{position:"absolute",left:0,top:330,width:2200,height:400,transform:`translateX(${-travel*500}px) rotateX(${travel*5}deg)`,transformOrigin:"50% 50%",perspective:1000,opacity:1-merge}}>
      <div style={{position:"absolute",left:80,right:0,top:178,height:5,background:P.ink}}/>
      {weeks.map((w,i)=>{const x=160+i*470,starts=[5.8,8.1,9.65,13.7],enter=q(t,starts[i],starts[i]+.55);return <div key={w} style={{position:"absolute",left:x,top:0,width:330,height:350,opacity:enter,transform:`translateY(${(1-enter)*(i%2?70:-70)}px)`}}>
        <div style={{position:"absolute",left:151,top:158,width:36,height:36,borderRadius:30,background:i===3?P.red:P.blue,border:`7px solid ${P.paper}`,boxShadow:`0 0 0 ${q(t,8+i,9+i)*22}px rgba(37,99,255,.1)`}}/>
        <div style={{marginTop:i%2?225:44,textAlign:"center",fontSize:38,fontWeight:950}}>{w}</div>
        <div style={{display:"flex",justifyContent:"center",gap:10,marginTop:12}}>{["成果","问题","行动"].map((x,j)=><span key={x} style={{fontSize:18,fontWeight:850,color:j===1?P.red:P.blue,opacity:q(t,2.3+i*1.8+j*.55,2.7+i*1.8+j*.55)}}>{x}</span>)}</div>
      </div>})}
    </div>
    <div style={{position:"absolute",inset:0,display:"grid",placeItems:"center",opacity:merge,transform:`scale(${.78+.22*merge}) rotate(${(1-merge)*-3}deg)`}}><div style={{textAlign:"center"}}><Kicker>SAVE THE METHOD</Kicker><div style={{fontFamily:serif,fontSize:116,lineHeight:1,marginTop:22}}>提示词 <span style={{color:P.muted}}>→</span> <b style={{color:P.blue}}>Skill</b></div><div style={{fontSize:30,fontWeight:850,marginTop:28}}>保存的不是一句话，是背后的整套做法</div></div></div>
  </AbsoluteFill>;
};

// Shotcraft: basic-3d-scene —— 岗位说明的三层空间被镜头依次“访问”。
const SpatialDefinition=({t}:{t:number})=>{
  const skill=q(t,6.95,7.25)*(1-q(t,8.65,9.05));
  const colleague=q(t,9.0,9.65)*(1-q(t,15.85,16.25));
  const handbook=q(t,16.15,16.85)*(1-q(t,19.75,20.15));
  const compare=q(t,19.95,20.55);
  const planes=[{z:0,n:"01",title:"什么时候接手",sub:"TRIGGER"},{z:-650,n:"02",title:"按什么顺序执行",sub:"WORKFLOW"},{z:-1300,n:"03",title:"什么结果算完成",sub:"QUALITY"}];
  return <AbsoluteFill style={{background:P.night,color:P.white,overflow:"hidden",perspective:1000}}><Grid dark/><Label dark>SHOT 02 / BASIC 3D SCENE</Label>
    <div style={{position:"absolute",inset:0,transformStyle:"preserve-3d",opacity:1-q(t,6.95,7.25)}}>{planes.map((x,i)=>{const starts=[2.25,4.15,5.55],ends=[4.2,5.65,7.1],enter=q(t,starts[i],starts[i]+.28),exit=q(t,ends[i]-.32,ends[i]);const visible=enter*(1-exit);return <div key={x.n} style={{position:"absolute",left:195,top:170,width:1050,height:650,transform:`translateX(${(1-enter)*360-exit*360}px) translateZ(${(1-visible)*-120}px) rotateY(${(1-enter)*-9+exit*9}deg) scale(${.92+.08*visible})`,border:"1px solid rgba(120,180,220,.32)",background:"linear-gradient(145deg,rgba(20,41,60,.98),rgba(6,13,20,.98))",boxShadow:"0 40px 120px rgba(0,0,0,.6),inset 0 0 70px rgba(85,216,255,.1)",padding:"70px 78px",opacity:visible}}><div style={{fontFamily:mono,fontSize:24,color:P.cyan}}>{x.n} / {x.sub}</div><div style={{fontSize:74,fontWeight:950,letterSpacing:-4,marginTop:150}}>{x.title}</div><div style={{height:7,width:`${55+visible*45}%`,background:i===2?P.lime:P.blue,marginTop:28}}/></div>})}</div>
    <div style={{position:"absolute",inset:0,display:"grid",placeItems:"center",opacity:skill}}><div style={{fontFamily:serif,fontSize:126}}>这就是一个 <b style={{color:P.cyan}}>Skill</b></div></div>
    <div style={{position:"absolute",inset:0,display:"grid",placeItems:"center",opacity:colleague}}><div style={{width:1020,textAlign:"center"}}><Kicker>YOUR NEW COLLEAGUE</Kicker><div style={{fontFamily:serif,fontSize:100,marginTop:24}}>能力很强，<span style={{color:P.cyan}}>刚刚入职</span></div><div style={{display:"flex",justifyContent:"center",gap:18,marginTop:42}}>{["会做很多事","不知道你的习惯"].map((x,i)=><div key={x} style={{padding:"22px 28px",border:`1px solid ${i?P.red:P.cyan}`,fontSize:28,fontWeight:900,opacity:q(t,12.9+i*1.55,13.45+i*1.55)}}>{x}</div>)}</div></div></div>
    <div style={{position:"absolute",inset:0,display:"grid",placeItems:"center",opacity:handbook}}><div style={{width:1050,textAlign:"center"}}><Kicker>THE HANDBOOK</Kicker><div style={{fontFamily:serif,fontSize:105,marginTop:25}}>岗位说明书 <span style={{color:P.red}}>+</span> 工作流程</div></div></div>
    <div style={{position:"absolute",inset:0,display:"grid",placeItems:"center",opacity:compare}}><div style={{width:1160}}><Kicker>ONE-TIME PROMPT / REUSABLE SKILL</Kicker><div style={{display:"grid",gridTemplateColumns:"1fr 120px 1fr",alignItems:"center",marginTop:55,textAlign:"center"}}><div style={{fontFamily:serif,fontSize:72,color:"#9aa9b5"}}>眼前这一次</div><div style={{fontSize:52,color:P.red}}>→</div><div style={{fontFamily:serif,fontSize:72,color:P.cyan}}>以后同类任务</div></div></div></div>
  </AbsoluteFill>;
};

// Shotcraft: type-and-filter —— 四个判断项入场、搜索式筛选，留下可复用任务。
const TypeFilter=({t}:{t:number})=>{
  const tests=["任务会重复","输入输出固定","步骤相对稳定","换 AI 仍需解释"];
  const typed=Math.min(12,Math.floor(Math.max(0,t-1.3)*9)); const filter=q(t,13.7,16.5), narrow=q(t,17.9,20.8);
  return <AbsoluteFill style={{background:P.night,color:P.white,overflow:"hidden"}}><Grid dark/><Label dark>SHOT 03 / TYPE AND FILTER</Label>
    <div style={{position:"absolute",left:90,top:110,right:90}}><Kicker>FILTER THE TASK</Kicker><div style={{fontSize:58,fontWeight:950,marginTop:16}}>什么值得做成 Skill？</div><div style={{marginTop:32,height:66,border:"1px solid #3a5368",background:"rgba(0,0,0,.3)",display:"flex",alignItems:"center",padding:"0 22px",fontFamily:mono,fontSize:24,color:P.cyan}}>repeatable? <span style={{color:P.white}}>{"stable-task".slice(0,typed)}</span><i style={{width:3,height:30,background:P.cyan,marginLeft:4}}/></div></div>
    <div style={{position:"absolute",left:90,right:90,top:330,display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>{tests.map((x,i)=>{const starts=[5.15,6.7,9.05,10.72],e=q(t,starts[i],starts[i]+.42),yes=i<3;return <div key={x} style={{height:150,padding:"28px 34px",border:`1px solid ${yes&&filter>.2?P.blue:"#344859"}`,background:yes&&filter>.2?`rgba(37,99,255,${.12+.14*filter})`:"rgba(255,255,255,.04)",opacity:e*(yes?1:1-filter*.75),transform:`translateY(${(1-e)*38+(yes?0:filter*70)}px) scale(${yes?1:1-filter*.08})`}}><div style={{fontFamily:mono,color:yes?P.cyan:"#8493a0"}}>0{i+1}</div><div style={{fontSize:29,fontWeight:900,marginTop:16}}>{x}</div><div style={{position:"absolute",marginTop:14,fontSize:17,color:yes?P.lime:P.red,opacity:filter}}>{yes?"YES":"OPTIONAL"}</div></div>})}</div>
    <div style={{position:"absolute",left:90,right:90,bottom:130,height:105,background:P.white,color:P.ink,padding:"23px 30px",display:"flex",alignItems:"center",gap:30,opacity:narrow,transform:`translateY(${(1-narrow)*70}px)`}}><span style={{fontFamily:mono,fontWeight:900,color:P.red}}>SCOPE</span><span style={{fontSize:25,textDecoration:"line-through",color:P.muted}}>帮我做内容运营</span><span style={{fontSize:34}}>→</span><b style={{fontSize:30}}>访谈记录 → 固定结构长文</b></div>
  </AbsoluteFill>;
};

// Shotcraft: assemble-then-type-flyin —— 六块骨架先组装，再灌入每块内容。
const WorkflowAssembly=({t}:{t:number})=>{
  const items=["什么时候启动","用户提供什么","怎么处理","最后交付什么","怎样算合格","材料不足怎么办"];
  const assembled=q(t,1,5.6); const starts=[5.7,7.1,8.3,9.25,10.5,11.8]; const phase=Math.max(0,starts.filter(x=>t>=x).length-1); const example=q(t,14.7,15.4);
  return <AbsoluteFill style={{background:P.paper,color:P.ink,overflow:"hidden",perspective:1200}}><Grid/><Label>SHOT 04 / ASSEMBLE THEN TYPE</Label>
    <div style={{position:"absolute",left:58,top:104,width:390}}><Kicker>WORKFLOW CARD</Kicker><div style={{fontFamily:serif,fontSize:80,lineHeight:1.02,marginTop:20}}>先画清楚<br/>再建文件</div><div style={{fontSize:22,color:P.muted,marginTop:25,lineHeight:1.6}}>骨架先到位，内容逐项落下。<br/>这张卡就是 Skill 的主体。</div></div>
    <div style={{position:"absolute",left:500,top:115,width:850,height:730,transformStyle:"preserve-3d",transform:`rotateX(${(1-assembled)*18}deg) rotateY(${(1-assembled)*-12}deg)`,opacity:1-example}}>{items.map((x,i)=>{const col=i%2,row=Math.floor(i/2),e=q(t,.9+i*.62,1.5+i*.62),active=i===phase,fill=q(t,starts[i],starts[i]+.38);return <div key={x} style={{position:"absolute",left:col*420,top:row*225,width:390,height:195,background:active?P.ink:P.white,color:active?P.white:P.ink,border:`2px solid ${active?P.ink:P.ink}`,boxShadow:`${(1-e)*(-260+col*520)}px ${(1-e)*(-180+row*130)}px 70px rgba(16,21,28,.2)`,transform:`translate3d(${(1-e)*(col?500:-500)}px,${(1-e)*(row-1)*300}px,${(1-e)*220}px) rotate(${(1-e)*(col?12:-12)}deg)`,opacity:e,padding:"25px 28px"}}><div style={{fontFamily:mono,fontSize:16,color:active?P.cyan:P.blue}}>0{i+1}</div><div style={{fontSize:28,fontWeight:950,marginTop:18}}>{x}</div><div style={{height:4,background:active?P.cyan:P.red,width:`${20+fill*80}%`,marginTop:23}}/></div>})}</div>
    <div style={{position:"absolute",left:500,top:220,width:840,opacity:example}}><Kicker>WEEKLY REVIEW / EXAMPLE</Kicker><div style={{display:"flex",alignItems:"center",gap:12,marginTop:35}}>{["提取事实和数据","整理成果、问题、经验","转成下周行动","待补充 / 不编造"].map((x,i)=>{const times=[14.72,16.85,19.05,21.95],e=q(t,times[i],times[i]+.38);return <React.Fragment key={x}><div style={{flex:1,minHeight:145,background:i===3?P.ink:P.white,color:i===3?P.white:P.ink,border:`2px solid ${i===3?P.red:P.ink}`,padding:"24px 18px",fontSize:22,fontWeight:900,opacity:e,transform:`translateY(${(1-e)*45}px)`}}>{x}</div>{i<3?<span style={{fontSize:30,color:P.red,opacity:e}}>→</span>:null}</React.Fragment>})}</div></div>
  </AbsoluteFill>;
};

// Shotcraft: bezier-source-converge-merge —— 三种真实说法沿曲线汇入同一 Skill。
const TriggerMerge=({t}:{t:number})=>{
  const sources=[{at:2.7,y:205,a:"/weekly-review",b:"点名调用"},{at:7,y:445,a:"流水账整理成周报",b:"自动识别"},{at:10.65,y:685,a:"只给了支付功能",b:"信息不足"}];
  return <AbsoluteFill style={{background:P.night,color:P.white,overflow:"hidden"}}><Grid dark/><Label dark>SHOT 05 / BEZIER MERGE</Label><svg width="1440" height="1080" style={{position:"absolute",inset:0}}>{sources.map((s,i)=>{const p0:[number,number]=[540,s.y],p1:[number,number]=[680,s.y],p2:[number,number]=[810,540+(i-1)*60],p3:[number,number]=[1010,540];const d=`M ${p0[0]} ${p0[1]} C ${p1[0]} ${p1[1]}, ${p2[0]} ${p2[1]}, ${p3[0]} ${p3[1]}`;const draw=q(t,s.at+.15,s.at+.65),move=q(t,s.at+.4,s.at+1.45),point=bezier(move,p0,p1,p2,p3);return <g key={s.a}><path d={d} fill="none" stroke={i===2?P.red:P.blue} strokeWidth="5" pathLength="1" strokeDasharray="1" strokeDashoffset={1-draw} opacity={.45+.55*draw}/><circle cx={point[0]} cy={point[1]} r={10+5*Math.sin(move*Math.PI)} fill={i===2?P.red:P.cyan} opacity={move>0&&move<1?1:0}/><circle cx={point[0]} cy={point[1]} r="24" fill="none" stroke={i===2?P.red:P.cyan} strokeWidth="2" opacity={move>0&&move<1?.35:0}/></g>})}</svg>
    {sources.map((s,i)=>{const e=q(t,s.at,s.at+.38),tested=q(t,s.at+1.35,s.at+1.7);return <div key={s.a} style={{position:"absolute",left:78,top:s.y-58,width:460,opacity:e,background:"rgba(255,255,255,.06)",borderLeft:`6px solid ${i===2?P.red:P.blue}`,padding:"20px 24px",boxShadow:tested?`0 0 ${25*tested}px ${i===2?"rgba(240,82,59,.25)":"rgba(85,216,255,.22)"}`:"none"}}><div style={{fontSize:25,fontWeight:900}}>{s.a}</div><div style={{fontFamily:mono,fontSize:15,color:i===2?"#ff9b8b":P.cyan,marginTop:7}}>{s.b} <span style={{color:P.lime,opacity:tested}}>✓ 已测试</span></div></div>})}
    <div style={{position:"absolute",left:970,top:380,width:330,height:320,borderRadius:"50%",background:"radial-gradient(circle,#24496a,#0b1722 68%)",border:"2px solid #5a819e",display:"grid",placeItems:"center",textAlign:"center",boxShadow:"0 0 90px rgba(85,216,255,.18)",transform:`scale(${.8+.2*q(t,2.5,3.1)})`}}><div><Kicker>WEEKLY REVIEW</Kicker><div style={{fontSize:46,fontWeight:950,marginTop:18}}>同一个 Skill</div><div style={{fontFamily:mono,color:P.lime,marginTop:18,opacity:q(t,15.3,16.2)}}>DIRECT / AUTO / SAFE</div></div></div>
  </AbsoluteFill>;
};

// Shotcraft: canvas-materialize-moves / diagram-cascade —— 根文件落地，依赖按需级联。
const FileCascade=({t}:{t:number})=>{
  const files=[{x:720,y:130,n:"SKILL.md",s:"唯一必需"},{x:500,y:445,n:"scripts/",s:"重复代码"},{x:800,y:590,n:"references/",s:"长资料"},{x:1090,y:430,n:"assets/",s:"模板素材"}];
  const retract=q(t,12.7,14.3);
  return <AbsoluteFill style={{background:P.paper,color:P.ink,overflow:"hidden"}}><Grid/><Label>SHOT 06 / DIAGRAM CASCADE</Label>
    <div style={{position:"absolute",left:64,top:120,width:390}}><Kicker>MINIMUM STRUCTURE</Kicker><div style={{fontFamily:serif,fontSize:88,lineHeight:.96,marginTop:20}}>一个文件<br/><b style={{color:P.blue}}>就能开始</b></div><div style={{fontSize:22,color:P.muted,marginTop:28,lineHeight:1.6}}>空目录不是能力。<br/>真正用到，再让分支长出来。</div></div>
    <svg width="1440" height="1080" style={{position:"absolute",inset:0}}>{files.slice(1).map((f,i)=>{const starts=[5.95,8.4,10.25],e=q(t,starts[i],starts[i]+.55)*(1-retract);return <path key={f.n} d={`M 870 330 C 870 ${380+i*25}, ${f.x+110} ${f.y-40}, ${f.x+110} ${f.y}`} fill="none" stroke={P.blue} strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1-e}/>})}</svg>
    {files.map((f,i)=>{const starts=[3.3,5.95,8.4,10.25],e=q(t,starts[i],starts[i]+.55);const optional=i>0;return <div key={f.n} style={{position:"absolute",left:f.x,top:f.y,width:250,height:145,background:i===0?P.ink:P.white,color:i===0?P.white:P.ink,border:`2px solid ${i===0?P.ink:P.blue}`,boxShadow:"0 24px 55px rgba(31,28,20,.13)",padding:"25px 28px",opacity:e*(optional?1-retract:1),transform:`translateY(${(1-e)*-90+retract*65}px) scale(${.82+.18*e-retract*.08}) rotate(${(1-e)*(i%2?5:-5)}deg)`}}><div style={{fontFamily:mono,fontSize:25,fontWeight:900,color:i===0?P.cyan:P.blue}}>{f.n}</div><div style={{fontSize:18,fontWeight:850,marginTop:20,color:i===0?"#b7c5d1":P.muted}}>{f.s}</div></div>})}
    <div style={{position:"absolute",left:700,top:820,fontSize:30,fontWeight:950,color:P.red,opacity:retract}}>先删掉空架子，保留最小可用版本。</div>
  </AbsoluteFill>;
};

// Shotcraft: terminal-3d —— 输入、执行、产物三块终端在空间中接力，最后展开完整提示词。
const Terminal3D=({t}:{t:number})=>{
  const cam1=q(t,5.1,9.7),cam2=q(t,13.5,18.9),doc=q(t,19.45,20.15);
  const panes=[{x:150,z:0,title:"INPUT",lines:["创建项目级 Skill","weekly-review","只生成必要文件"]},{x:820,z:-400,title:"SKILL CREATOR",lines:["parse workflow","write SKILL.md","validate structure"]},{x:1490,z:-800,title:"OUTPUT",lines:["weekly-review/","└── SKILL.md","✓ passed"]}];
  const camera=-(cam1*670+cam2*670);
  const prompt=["帮我创建一个 Skill。","Skill 名称：weekly-review","工作流：[粘贴工作流卡片]","要求：","1. 创建为项目级 Skill；","2. 只创建真正需要的文件；","3. 完成后帮我验证；","4. 告诉我如何测试。"]; 
  return <AbsoluteFill style={{background:P.night,color:P.white,overflow:"hidden",perspective:1100}}><Grid dark/><Label dark>SHOT 07 / TERMINAL 3D</Label>
    <div style={{position:"absolute",left:0,top:145,width:2200,height:650,transformStyle:"preserve-3d",transform:`translateX(${camera}px) rotateY(${-10+cam1*8+cam2*4}deg)`,opacity:1-doc,filter:`blur(${doc*7}px)`}}>{panes.map((p,i)=><div key={p.title} style={{position:"absolute",left:p.x,top:i===1?70:0,width:560,height:500,transform:`translateZ(${p.z}px) rotateY(${i===1?-5:4}deg)`,background:"rgba(5,12,18,.96)",border:"1px solid #55738b",boxShadow:"0 45px 110px rgba(0,0,0,.65)"}}><div style={{height:56,borderBottom:"1px solid #324657",display:"flex",alignItems:"center",padding:"0 22px",fontFamily:mono,color:P.cyan}}>{p.title}</div><div style={{padding:"42px 34px",fontFamily:mono,fontSize:23,lineHeight:2}}>{p.lines.map((x,j)=><div key={x} style={{opacity:q(t,1.5+i*4.4+j*.65,2+i*4.4+j*.65),color:j===2&&i===2?P.lime:P.white}}><span style={{color:P.blue}}>$</span> {x}</div>)}</div></div>)}</div>
    <div style={{position:"absolute",left:135,top:72,width:1170,height:850,background:P.white,color:P.ink,padding:"48px 58px",boxShadow:"0 50px 130px rgba(0,0,0,.6)",opacity:doc,transform:`translateY(${(1-doc)*100}px) scale(${.9+.1*doc})`}}><Kicker>COPY / PASTE PROMPT</Kicker><div style={{fontSize:46,fontWeight:950,marginTop:10,paddingBottom:20,borderBottom:`5px solid ${P.blue}`}}>直接发给 WorkBuddy</div><div style={{fontFamily:mono,fontSize:25,lineHeight:1.52,marginTop:25}}>{prompt.map((x,i)=><div key={x} style={{opacity:q(t,18+i*.3,18.35+i*.3),transform:`translateX(${(1-q(t,18+i*.3,18.35+i*.3))*25}px)`,color:i===1||i===2?P.blue:P.ink,fontWeight:i===0||i===3?900:600,marginTop:i===3?12:0}}>{x}</div>)}</div></div>
  </AbsoluteFill>;
};

// Shotcraft: document-typewriter-reveal —— 纸张遮罩逐块擦除，光标跟随写入前沿。
const DocumentWriter=({t}:{t:number})=>{
  const blocks=["---","name: weekly-review","description: 将零散记录整理成结构化周报。","触发：周报 / 每周复盘 / 一周总结 / 流水账","---","## 工作流程","## 信息不足或异常时","## 输出格式","## 质量标准"];
  const starts=[5.75,6.05,8.2,14.95,19.75,20.55,21.45,22.55,23.55];
  return <AbsoluteFill style={{background:"#ddd8ce",color:P.ink,overflow:"hidden"}}><Label>SHOT 08 / DOCUMENT REVEAL</Label>
    <div style={{position:"absolute",left:155,top:90,width:1130,height:820,background:P.white,boxShadow:"0 35px 100px rgba(51,42,30,.18)",padding:"54px 75px",transform:`rotate(${(1-q(t,.2,1.1))*-2}deg) translateY(${(1-q(t,.2,1.1))*80}px)`}}><div style={{fontFamily:serif,fontSize:76}}>SKILL.md</div><div style={{height:6,width:230,background:P.blue,margin:"16px 0 28px"}}><div style={{height:"100%",width:`${q(t,3.1,5.4)*100}%`,background:P.red}}/></div><div style={{fontFamily:mono,fontSize:23,lineHeight:1.58}}>{blocks.map((x,i)=>{const start=starts[i],wipe=q(t,start,start+.48);return <div key={x} style={{position:"relative",minHeight:i===2||i===3?66:46,color:i===1||i===2?P.blue:P.ink,fontWeight:i>=5?850:600,overflow:"hidden"}}><span>{x}</span><span style={{position:"absolute",right:0,top:0,bottom:0,width:`${(1-wipe)*100}%`,background:P.white}}/>{t>=start&&wipe<1?<i style={{position:"absolute",left:`${wipe*100}%`,top:5,width:3,height:29,background:P.red}}/>:null}</div>})}</div><div style={{position:"absolute",right:74,top:62,fontFamily:mono,fontSize:17,color:P.red}}>TRIGGER → PROCESS → EXCEPTION → QUALITY</div></div>
  </AbsoluteFill>;
};

// Shotcraft: before-after-slider-scrub + validation journey —— 滑杆只承担一次转折，其余旁白切换到对应检查状态。
const ValidationSlider=({t}:{t:number})=>{
  const checks=["文件夹名称","YAML","必填字段","安装作用域"];
  const compare=q(t,7.75,8.2)*(1-q(t,11.65,12.05));
  const x=interpolate(t,[8.1,9.25,10.55,11.55],[220,1130,530,930],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.inOut(Easing.cubic)});
  const testPhase=q(t,11.85,12.25)*(1-q(t,14.45,14.8));
  const repairPhase=q(t,14.45,14.85)*(1-q(t,22.75,23.1));
  const realPhase=q(t,22.9,23.3);
  const utterances=["/weekly-review","流水账整理成周报","只给了支付功能"];
  const repairs=[{at:14.5,bad:"自然表达没触发",good:"改 description"},{at:17.35,bad:"输出顺序乱",good:"改工作流程"},{at:19.85,bad:"材料不够还在编",good:"补异常处理"}];
  return <AbsoluteFill style={{background:P.paper,color:P.ink,overflow:"hidden"}}><Label>SHOT 09 / BEFORE AFTER SCRUB</Label>
    <div style={{position:"absolute",left:110,top:145,width:1220,height:680,opacity:1-q(t,7.75,8.15)}}><Kicker>STRUCTURE CHECK</Kicker><div style={{fontFamily:serif,fontSize:76,marginTop:20}}>先检查，再安装</div><div style={{marginTop:60,display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>{checks.map((item,i)=>{const starts=[.4,2.65,4.65,6.0],e=q(t,starts[i],starts[i]+.5);return <div key={item} style={{height:140,border:"2px solid #b9b4aa",background:P.white,padding:"30px 34px",display:"flex",alignItems:"center",justifyContent:"space-between",opacity:e,transform:`translateY(${(1-e)*35}px)`}}><span style={{fontSize:30,fontWeight:900}}>{item}</span><span style={{width:48,height:48,borderRadius:30,background:P.blue,color:P.white,display:"grid",placeItems:"center",fontSize:28,transform:`scale(${e})`}}>✓</span></div>})}</div></div>
    <div style={{position:"absolute",left:0,top:85,bottom:115,width:1440,background:P.white,opacity:compare}}><div style={{position:"absolute",inset:0,padding:"110px 100px"}}><Kicker>VALIDATION PASSED</Kicker><div style={{fontFamily:serif,fontSize:88,marginTop:25}}>结构没有错</div><div style={{fontSize:29,color:P.muted,marginTop:25}}>文件名 ✓ / YAML ✓ / 必填字段 ✓</div><div style={{fontFamily:mono,fontSize:160,color:"rgba(16,21,28,.07)",marginTop:80}}>FORMAT</div></div><div style={{position:"absolute",inset:0,clipPath:`inset(0 0 0 ${x}px)`,background:P.night,color:P.white,padding:"110px 100px"}}><Kicker>REAL TASK TEST</Kicker><div style={{fontFamily:serif,fontSize:88,marginTop:25}}>还得真的好用</div><div style={{fontFamily:mono,fontSize:160,color:"rgba(85,216,255,.08)",marginTop:155}}>QUALITY</div></div><div style={{position:"absolute",left:x-3,top:0,bottom:0,width:6,background:P.red}}><div style={{position:"absolute",left:-30,top:"46%",width:66,height:66,borderRadius:40,background:P.red,display:"grid",placeItems:"center",fontSize:28,color:P.white}}>↔</div></div></div>
    <div style={{position:"absolute",left:95,right:95,top:190,opacity:testPhase}}><Kicker>RUN THE THREE REAL PHRASES</Kicker><div style={{fontFamily:serif,fontSize:70,marginTop:22}}>把三句话，各跑一遍</div><div style={{display:"flex",gap:18,marginTop:70}}>{utterances.map((item,i)=>{const starts=[12.05,12.85,13.65],e=q(t,starts[i],starts[i]+.32),pulse=q(t,starts[i]+.3,starts[i]+.7);return <div key={item} style={{flex:1,minHeight:190,background:P.night,color:P.white,border:`2px solid ${pulse?P.cyan:"#425464"}`,padding:"30px 25px",opacity:e,transform:`translateY(${(1-e)*45}px)`}}><div style={{fontFamily:mono,color:P.cyan}}>TEST 0{i+1}</div><div style={{fontSize:25,fontWeight:900,lineHeight:1.4,marginTop:28}}>{item}</div><div style={{height:5,background:P.blue,width:`${pulse*100}%`,marginTop:28}}/></div>})}</div></div>
    <div style={{position:"absolute",left:120,right:120,top:150,opacity:repairPhase}}><Kicker>FAIL → REPAIR → RETEST</Kicker><div style={{fontFamily:serif,fontSize:68,marginTop:20}}>哪里出问题，就改哪里</div><div style={{marginTop:46}}>{repairs.map((item)=>{const e=q(t,item.at,item.at+.42),done=q(t,item.at+1.05,item.at+1.45);return <div key={item.bad} style={{height:135,display:"grid",gridTemplateColumns:"1fr 90px 1fr",alignItems:"center",borderTop:"1px solid #bbb5aa",opacity:e,transform:`translateX(${(1-e)*45}px)`}}><div style={{fontSize:29,fontWeight:900,color:P.red}}>{item.bad}</div><div style={{fontSize:36,textAlign:"center",color:P.blue}}>→</div><div style={{fontFamily:mono,fontSize:27,fontWeight:900,color:P.blue}}>{item.good} <span style={{color:"#2f9d62",opacity:done}}>✓</span></div></div>})}</div></div>
    <div style={{position:"absolute",inset:0,display:"grid",placeItems:"center",background:P.night,color:P.white,opacity:realPhase}}><div style={{width:1050,textAlign:"center"}}><Kicker>REAL TASK / FIRST RUN</Kicker><div style={{fontFamily:serif,fontSize:83,marginTop:30}}>让第一版，接一次真实任务</div><div style={{margin:"55px auto 0",width:760,height:18,background:"#253746",overflow:"hidden"}}><div style={{height:"100%",width:`${q(t,23.1,25.25)*100}%`,background:P.cyan}}/></div><div style={{display:"flex",justifyContent:"center",gap:24,marginTop:32}}>{["运行","发现问题","回去修改"].map((item,i)=><Chip key={item} on={t>23.1+i*1.15}>{item}</Chip>)}</div><div style={{fontSize:34,fontWeight:950,color:P.lime,marginTop:45,opacity:q(t,25.2,26)}}>真实迭代开始 ✓</div></div></div>
  </AbsoluteFill>;
};

// Shotcraft: word-relay-filmstrip —— 左侧证据只在换坑时步进，右侧词组原位接力。
const PitfallFilmstrip=({t}:{t:number})=>{
  const pits=[{at:3,bad:"聊天记录",good:"提炼工作流",lines:["触发条件","步骤","异常","验收"]},{at:12.55,bad:"无限范围",good:"收紧任务",lines:["一个输入","一个输出"]},{at:21.1,bad:"只有步骤",good:"补完成标准",lines:["固定栏目","优先级","完成条件"]},{at:29.5,bad:"验证即完成",good:"三类实测",lines:["正常","模糊","缺失"]},{at:39.1,bad:"一次做满",good:"最小版本",lines:["先跑通","再扩展"]}];
  const active=Math.max(0,pits.filter(p=>t>=p.at).length-1);
  const step=pits.slice(1).reduce((sum,p)=>sum+q(t,p.at,p.at+.9),0),cardH=420,gap=55;
  return <AbsoluteFill style={{background:P.paper,color:P.ink,overflow:"hidden"}}><Label>SHOT 10 / WORD RELAY FILMSTRIP</Label>
    <div style={{position:"absolute",left:55,top:145,width:760,height:800,overflow:"hidden"}}><div style={{transform:`translateY(${-step*(cardH+gap)}px)`}}>{pits.map((p,i)=><div key={p.bad} style={{height:cardH,marginBottom:gap,background:i%2?P.night:P.white,color:i%2?P.white:P.ink,border:"1px solid rgba(20,20,20,.1)",padding:"55px 60px",boxShadow:"0 20px 55px rgba(30,25,18,.12)"}}><div style={{fontFamily:mono,color:i%2?P.cyan:P.blue}}>PITFALL 0{i+1}</div><div style={{fontSize:47,fontWeight:950,marginTop:22,textDecoration:"line-through",textDecorationColor:P.red,textDecorationThickness:"7px"}}>{p.bad}</div><div style={{display:"flex",gap:12,marginTop:52,flexWrap:"wrap"}}>{p.lines.map(x=><Chip key={x} on={i%2===1}>{x}</Chip>)}</div></div>)}</div></div>
    <div style={{position:"absolute",right:65,top:320,width:535,height:350,textAlign:"right"}}><div style={{fontFamily:serif,fontSize:55,color:P.muted}}>不要</div>{pits.map((p,i)=>{const enter=q(t,p.at+.25,p.at+.9),exit=i<pits.length-1?q(t,pits[i+1].at-1,pits[i+1].at-.2):0;return <div key={p.good} style={{position:"absolute",right:0,top:75,fontFamily:serif,fontSize:78,lineHeight:1.08,fontWeight:700,color:i===4?P.red:P.blue,opacity:enter*(1-exit),transform:`translateY(${(1-enter)*45}px)`}}>{p.good}</div>})}<div style={{position:"absolute",right:0,top:190,fontFamily:mono,fontSize:20,color:P.muted}}>STEP {active+1} / 5</div></div>
  </AbsoluteFill>;
};

// Shotcraft: ui-strip-away-outro —— 所有流程 UI 分层剥离，最后只留一个可执行动作。
const StripAwayOutro=({t}:{t:number})=>{
  const layers=["找出重复任务","填写工作流卡片","交给 WorkBuddy","生成第一版","拿真实任务测试"];
  const strip=q(t,27.6,31.2),final=q(t,31,34.3);
  return <AbsoluteFill style={{background:P.night,color:P.white,overflow:"hidden",perspective:1000}}><Grid dark/><Label dark>SHOT 11 / UI STRIP AWAY</Label>
    <div style={{position:"absolute",left:110,top:105,width:1220,height:760,opacity:1-final}}><Kicker>START TODAY</Kicker><div style={{fontFamily:serif,fontSize:78,marginTop:22}}>从最近一次重复解释开始</div><div style={{display:"flex",alignItems:"center",gap:14,marginTop:105}}>{layers.map((x,i)=>{const starts=[2.35,8.75,16.9,19.65,21.35],e=q(t,starts[i],starts[i]+.5);const fly=i<layers.length-1?strip:0;return <React.Fragment key={x}><div style={{width:i===3?240:195,height:170,background:i===3?P.blue:"rgba(255,255,255,.06)",border:`1px solid ${i===3?P.blue:"#3f5669"}`,padding:"30px 22px",opacity:e*(1-fly),transform:`translateY(${(1-e)*80-fly*(180+i*70)}px) rotate(${fly*(i%2?12:-12)}deg)`}}><div style={{fontFamily:mono,color:i===3?P.white:P.cyan}}>0{i+1}</div><div style={{fontSize:24,fontWeight:900,marginTop:26,lineHeight:1.35}}>{x}</div></div>{i<layers.length-1?<div style={{fontSize:34,color:P.red,opacity:e*(1-strip)}}>→</div>:null}</React.Fragment>})}</div><div style={{marginTop:95,display:"flex",gap:14,flexWrap:"wrap"}}>{["何时启动","用户给什么","执行步骤","最终输出","验收标准","信息不足怎么办"].map((x,i)=>{const starts=[8.75,10.65,11.7,12.75,13.8,14.9],e=q(t,starts[i],starts[i]+.35);return <div key={x} style={{opacity:e,transform:`translateY(${(1-e)*18}px)`}}><Chip on={i===5}>{x}</Chip></div>})}</div></div>
    <div style={{position:"absolute",inset:0,display:"grid",placeItems:"center",opacity:final}}><div style={{textAlign:"center",transform:`scale(${.85+.15*final})`}}><div style={{fontFamily:mono,color:P.cyan,letterSpacing:5}}>THE METHOD IS THE ASSET</div><div style={{fontFamily:serif,fontSize:68,marginTop:38}}>把“我每次都要重新解释”</div><div style={{fontSize:34,color:P.red,margin:"22px 0"}}>变成</div><div style={{fontFamily:serif,fontSize:92,color:P.cyan}}>“它以后知道该怎么做”</div></div></div>
  </AbsoluteFill>;
};

export const ShotcraftRebuild=({sceneId}:{sceneId:string})=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;
  if(sceneId==="01-repeated-prompts")return <TimelineTravel t={t}/>;
  if(sceneId==="02-what-is-skill")return <SpatialDefinition t={t}/>;
  if(sceneId==="03-when-to-build")return <TypeFilter t={t}/>;
  if(sceneId==="04-workflow-card")return <WorkflowAssembly t={t}/>;
  if(sceneId==="05-trigger-tests")return <TriggerMerge t={t}/>;
  if(sceneId==="06-file-structure")return <FileCascade t={t}/>;
  if(sceneId==="07-create-skill")return <Terminal3D t={t}/>;
  if(sceneId==="08-skill-md")return <DocumentWriter t={t}/>;
  if(sceneId==="09-validate-test")return <ValidationSlider t={t}/>;
  if(sceneId==="10-pitfalls")return <PitfallFilmstrip t={t}/>;
  return <StripAwayOutro t={t}/>;
};
