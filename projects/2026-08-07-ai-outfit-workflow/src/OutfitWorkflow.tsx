import {Audio, AbsoluteFill, Easing, Freeze, Img, Sequence, interpolate, spring, useCurrentFrame} from "remotion";
import {Video} from "@remotion/media";

const FPS = 30;
const OPEN_END = 252;
const STEP_ONE = 446;
const STEP_TWO = 713;
const WAIT = 906;
const RESULT = 976;
const CLOSING = 1218;
const TOTAL = 1519;

const ink = "#181716";
const paper = "#f4f0e8";
const lilac = "#9b7ad7";
const green = "#61b889";
const coral = "#e96f5d";

const localAsset = (filename: string) => `http://127.0.0.1:8766/${encodeURIComponent(filename)}`;
const assets: Record<string, string> = {
  "source.mov": localAsset("口播精剪版.mov"),
  "viral-example.mp4": localAsset("案例视频放在开头.mp4"),
  "prompt-one.mp4": localAsset("提示词一示例.mp4"),
  "prompt-two.mp4": localAsset("提示词二示例.mp4"),
  "result-with-bgm.mov": localAsset("带BGM版本结换装视频用这个.mov"),
  "viral-like-1.png": localAsset("爆款截图一.png"),
  "viral-like-2.png": localAsset("爆款截图二.png"),
  "viral-like-3.png": localAsset("爆款截图3.png"),
  "outfit-collage.png": localAsset("甜美轻熟换装参考图.png"),
};
const asset = (id: string) => assets[id];

const enter = (frame: number, at = 0, duration = 16) =>
  interpolate(frame, [at, at + duration], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const FadeSlide = ({children, at = 0, x = 0, y = 26, style = {}}: {children: React.ReactNode; at?: number; x?: number; y?: number; style?: React.CSSProperties}) => {
  const frame = useCurrentFrame();
  const p = enter(frame, at);
  return <div style={{opacity: p, transform: `translate(${(1 - p) * x}px, ${(1 - p) * y}px)`, ...style}}>{children}</div>;
};

const Person = ({sourceStart = 0, pip = false, opening = false}: {sourceStart?: number; pip?: boolean; opening?: boolean}) => (
  <div style={pip ? {
    position: "absolute", right: opening ? 42 : 44, bottom: opening ? 335 : 132,
    width: opening ? 365 : 300, height: opening ? 286 : 236,
    borderRadius: 28, overflow: "hidden", background: "#d9ded9",
    boxShadow: "0 22px 58px rgba(20,18,15,.24)", border: "5px solid rgba(255,255,255,.9)",
  } : {position: "absolute", inset: 0, overflow: "hidden"}}>
    <Video
      src={asset("source.mov")}
      muted
      trimBefore={Math.round(sourceStart * FPS)}
      objectFit="cover"
      style={{width: "100%", height: "100%", objectPosition: "50% 46%"}}
    />
    {pip ? <div style={{position: "absolute", left: 16, top: 14, padding: "7px 12px", borderRadius: 999, color: "white", background: "rgba(24,23,22,.72)", fontSize: 16, fontWeight: 800, letterSpacing: 1}}>WINTER</div> : null}
  </div>
);

const EditorialBackground = ({dark = false}: {dark?: boolean}) => (
  <AbsoluteFill style={{background: dark ? ink : paper}}>
    <div style={{position: "absolute", inset: 0, background: dark ? "radial-gradient(circle at 18% 18%, rgba(155,122,215,.24), transparent 38%)" : "radial-gradient(circle at 84% 12%, rgba(155,122,215,.18), transparent 34%)"}} />
    <div style={{position: "absolute", left: 34, top: 32, bottom: 32, width: 1, background: dark ? "rgba(255,255,255,.14)" : "rgba(24,23,22,.14)"}} />
  </AbsoluteFill>
);

const Kicker = ({children, color = lilac}: {children: React.ReactNode; color?: string}) => (
  <div style={{display: "flex", alignItems: "center", gap: 12, color, fontSize: 18, fontWeight: 900, letterSpacing: 3}}>
    <span style={{width: 28, height: 4, background: color}} />{children}
  </div>
);

const VerticalAsset = ({src, loop = false, muted = true}: {src: string; loop?: boolean; muted?: boolean}) => (
  <div style={{position: "absolute", left: 42, top: 116, width: 620, height: 1102, borderRadius: 30, overflow: "hidden", background: "#ddd", boxShadow: "0 26px 70px rgba(0,0,0,.28)"}}>
    <Video src={asset(src)} muted={muted} loop={loop} objectFit="cover" style={{width: "100%", height: "100%"}} />
    <div style={{position: "absolute", inset: 0, boxShadow: "inset 0 0 0 2px rgba(255,255,255,.28)", borderRadius: 30}} />
  </div>
);

const Opening = () => {
  return <AbsoluteFill style={{color: "white", fontFamily: "Arial, PingFang SC, sans-serif"}}>
    <EditorialBackground dark />
    <div style={{position: "absolute", left: 42, top: 42}}><Kicker color="#bda7ed">VIRAL CASE · 爆款案例</Kicker></div>
    <Sequence durationInFrames={36}><Freeze frame={0}><VerticalAsset src="viral-example.mp4" /></Freeze></Sequence>
    <Sequence from={36} durationInFrames={216}><VerticalAsset src="viral-example.mp4" /></Sequence>
    <Sequence durationInFrames={36}><Person pip opening /></Sequence>
    <Sequence from={36} durationInFrames={OPEN_END - 36}><div style={{position: "absolute", right: 42, bottom: 335, width: 365, height: 286, borderRadius: 28, overflow: "hidden", border: "5px solid rgba(255,255,255,.9)", boxShadow: "0 22px 58px rgba(0,0,0,.25)"}}><Freeze frame={35}><Video src={asset("source.mov")} muted objectFit="cover" style={{width: "100%", height: "100%"}} /></Freeze><div style={{position: "absolute", left: 16, top: 14, padding: "7px 12px", borderRadius: 999, color: "white", background: "rgba(24,23,22,.72)", fontSize: 16, fontWeight: 800}}>WINTER</div></div></Sequence>
  </AbsoluteFill>;
};

const LikeProof = ({src, value, at, x, y, rotate}: {src: string; value: string; at: number; x: number; y: number; rotate: number}) => {
  const frame = useCurrentFrame();
  const p = spring({frame: frame - at, fps: FPS, config: {damping: 15, stiffness: 145}});
  return <div style={{position: "absolute", left: x, top: y, width: 235, transform: `translateY(${(1-p)*55}px) rotate(${rotate}deg) scale(${0.78+p*.22})`, opacity: p, padding: "16px 18px 18px", background: "rgba(255,255,255,.94)", boxShadow: "0 18px 40px rgba(0,0,0,.2)"}}>
    <Img src={asset(src)} style={{width: "100%", height: 92, objectFit: "contain", imageRendering: "auto"}} />
    <div style={{display: "flex", justifyContent: "space-between", alignItems: "end", marginTop: 8, color: ink}}><span style={{fontSize: 14, fontWeight: 800, letterSpacing: 1}}>点赞验证</span><span style={{fontSize: 36, fontWeight: 950, color: coral}}>{value}</span></div>
  </div>;
};

const ViralProof = () => {
  const frame = useCurrentFrame();
  const wash = interpolate(frame, [0, 28], [.2, .52], {extrapolateRight: "clamp"});
  return <AbsoluteFill style={{fontFamily: "Arial, PingFang SC, sans-serif", color: "white"}}>
    <Person sourceStart={1.5} />
    <AbsoluteFill style={{background: `linear-gradient(90deg, rgba(22,16,31,${wash}) 0%, rgba(22,16,31,.08) 56%, rgba(22,16,31,.42) 100%)`}} />
    <div style={{position: "absolute", left: 58, top: 70}}><Kicker color="#d5c4fa">WORKFLOW BREAKDOWN</Kicker></div>
    <FadeSlide at={5} x={-30} style={{position: "absolute", left: 58, top: 132, width: 510}}>
      <div style={{fontSize: 75, fontWeight: 950, lineHeight: .96, letterSpacing: -4}}>这种视频<br/><span style={{color: "#d5c4fa"}}>特别火</span></div>
    </FadeSlide>
    <LikeProof src="viral-like-1.png" value="1.2万" at={19} x={66} y={420} rotate={-4} />
    <LikeProof src="viral-like-2.png" value="1.3万" at={35} x={805} y={430} rotate={3} />
    <LikeProof src="viral-like-3.png" value="10.2万" at={51} x={96} y={720} rotate={-2} />
    <FadeSlide at={112} y={18} style={{position: "absolute", right: 50, top: 106, width: 300, textAlign: "right"}}>
      <div style={{fontSize: 26, color: "rgba(255,255,255,.72)"}}>整套流程</div>
      <div style={{fontSize: 108, fontWeight: 950, lineHeight: .9, color: "#d5c4fa"}}>2</div>
      <div style={{fontSize: 34, fontWeight: 900}}>个提示词</div>
    </FadeSlide>
  </AbsoluteFill>;
};

const BrowserVideo = ({src, duration, at = 0, loop = false}: {src: string; duration: number; at?: number; loop?: boolean}) => (
  <Sequence from={at} durationInFrames={duration}>
    <div style={{position: "absolute", left: 86, top: 205, width: 908, height: 511, borderRadius: 22, overflow: "hidden", background: "white", boxShadow: "0 24px 65px rgba(24,23,22,.18)"}}>
      <div style={{height: 42, display: "flex", alignItems: "center", gap: 8, paddingLeft: 18, background: "#282521"}}>{[coral,"#e8b84b",green].map(c=><span key={c} style={{width: 11,height:11,borderRadius:"50%",background:c}} />)}<span style={{marginLeft: 14, color: "rgba(255,255,255,.55)", fontSize: 14, letterSpacing: 1}}>PROMPT WORKSPACE</span></div>
      <Video src={asset(src)} muted loop={loop} objectFit="cover" style={{width: "100%", height: 469}} />
    </div>
  </Sequence>
);

const FlowArrow = ({left, top, width, at}: {left: number; top: number; width: number; at: number}) => {
  const frame = useCurrentFrame(); const p = enter(frame, at, 18);
  return <div style={{position:"absolute",left,top,width:width*p,height:3,background:lilac}}><span style={{position:"absolute",right:-2,top:-7,width:15,height:15,borderTop:`3px solid ${lilac}`,borderRight:`3px solid ${lilac}`,transform:"rotate(45deg)"}} /></div>;
};

const PromptOne = () => {
  const frame = useCurrentFrame();
  const showResult = frame > 150;
  const flowOut = interpolate(frame, [112, 128], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return <AbsoluteFill style={{fontFamily: "Arial, PingFang SC, sans-serif", color: ink}}>
    <EditorialBackground />
    <div style={{position:"absolute",left:58,top:62}}><Kicker>PROMPT 01 · 生成参考图</Kicker></div>
    <FadeSlide at={4} x={-22} style={{position:"absolute",left:58,top:103}}><div style={{fontSize:68,fontWeight:950,letterSpacing:-3}}>第一个提示词</div></FadeSlide>
    {!showResult ? <BrowserVideo src="prompt-one.mp4" duration={128} at={22} loop /> : null}
    {showResult ? <FadeSlide at={150} style={{position:"absolute",left:86,top:205,width:480,height:850}}><Img src={asset("outfit-collage.png")} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:24,boxShadow:"0 24px 65px rgba(24,23,22,.2)"}} /></FadeSlide> : null}
    <div style={{position:"absolute",inset:0,opacity:flowOut}}>
      <FadeSlide at={72} style={{position:"absolute",left:76,top:785}}><div style={{fontSize:19,fontWeight:900,color:coral,letterSpacing:2}}>01 · CHARACTER</div><div style={{fontSize:43,fontWeight:950,marginTop:7}}>角色外貌</div></FadeSlide>
      <FlowArrow left={310} top={846} width={118} at={84} />
      <FadeSlide at={94} style={{position:"absolute",left:455,top:785}}><div style={{fontSize:19,fontWeight:900,color:lilac,letterSpacing:2}}>02 · OUTFIT</div><div style={{fontSize:43,fontWeight:950,marginTop:7}}>衣服元素</div></FadeSlide>
      <FlowArrow left={687} top={846} width={105} at={106} />
      <FadeSlide at={118} style={{position:"absolute",left:815,top:785}}><div style={{fontSize:19,fontWeight:900,color:green,letterSpacing:2}}>03 · IMAGE</div><div style={{fontSize:43,fontWeight:950,marginTop:7}}>拼贴图</div></FadeSlide>
    </div>
    <FadeSlide at={156} x={22} style={{position:"absolute",right:62,top:340,width:390}}><div style={{fontSize:52,fontWeight:950,lineHeight:1.05}}>人物穿搭<br/><span style={{color:lilac}}>拼贴图</span></div><div style={{fontSize:23,lineHeight:1.55,marginTop:18,color:"#5c554d"}}>生图软件生成<br/>后续视频的视觉底稿</div></FadeSlide>
    <Person sourceStart={7.97} pip />
  </AbsoluteFill>;
};

const PromptTwo = () => {
  const frame = useCurrentFrame();
  const syncOut = interpolate(frame, [88, 102], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return <AbsoluteFill style={{fontFamily: "Arial, PingFang SC, sans-serif", color: ink}}>
    <EditorialBackground />
    <div style={{position:"absolute",left:58,top:62}}><Kicker color={coral}>PROMPT 02 · 生成换装视频</Kicker></div>
    <FadeSlide at={4} x={-22} style={{position:"absolute",left:58,top:103}}><div style={{fontSize:68,fontWeight:950,letterSpacing:-3}}>第二个提示词</div></FadeSlide>
    <BrowserVideo src="prompt-two.mp4" duration={93} at={18} />
    <div style={{position:"absolute",inset:0,opacity:syncOut}}>
      <FadeSlide at={32} x={-20} style={{position:"absolute",left:90,top:770,width:290}}><div style={{fontSize:17,fontWeight:900,color:coral,letterSpacing:2}}>SYNC · CHARACTER</div><div style={{fontSize:35,fontWeight:950,marginTop:8}}>角色特征</div><div style={{marginTop:12,height:7,borderRadius:99,background:"rgba(24,23,22,.12)",overflow:"hidden"}}><div style={{width:"88%",height:"100%",background:coral}} /></div></FadeSlide>
      <FadeSlide at={48} x={20} style={{position:"absolute",left:425,top:770,width:290}}><div style={{fontSize:17,fontWeight:900,color:lilac,letterSpacing:2}}>SYNC · OUTFIT</div><div style={{fontSize:35,fontWeight:950,marginTop:8}}>衣服特征</div><div style={{marginTop:12,height:7,borderRadius:99,background:"rgba(24,23,22,.12)",overflow:"hidden"}}><div style={{width:"88%",height:"100%",background:lilac}} /></div></FadeSlide>
      <FadeSlide at={65} y={12} style={{position:"absolute",left:760,top:790,width:235}}><div style={{display:"flex",alignItems:"center",gap:12,fontSize:27,fontWeight:950,color:green}}><span style={{width:32,height:32,borderRadius:"50%",display:"grid",placeItems:"center",background:green,color:"white",fontSize:20}}>✓</span>同步完成</div><div style={{fontSize:17,color:"#746b60",marginTop:10}}>与第一张图保持一致</div></FadeSlide>
    </div>
    <FadeSlide at={102} style={{position:"absolute",left:76,top:805,width:190}}><Img src={asset("outfit-collage.png")} style={{width:190,height:338,objectFit:"cover",borderRadius:18,boxShadow:"0 18px 45px rgba(0,0,0,.16)"}} /><div style={{marginTop:12,fontSize:20,fontWeight:900}}>第一张图片</div></FadeSlide>
    <FlowArrow left={300} top={952} width={135} at={112} />
    <FadeSlide at={121} style={{position:"absolute",left:455,top:842,width:250,textAlign:"center"}}><div style={{width:124,height:124,borderRadius:"50%",margin:"0 auto",display:"grid",placeItems:"center",background:ink,color:"white",fontSize:47,fontWeight:950}}>S2</div><div style={{fontSize:27,fontWeight:950,marginTop:14}}>Seedance 2.0</div><div style={{fontSize:17,color:"#746b60",marginTop:6}}>图片＋提示词</div></FadeSlide>
    <FlowArrow left={704} top={952} width={120} at={135} />
    <FadeSlide at={146} style={{position:"absolute",left:848,top:830,width:155}}><div style={{height:276,borderRadius:20,background:"linear-gradient(160deg,#bca6e4,#57446e)",display:"grid",placeItems:"center",color:"white",boxShadow:"0 18px 45px rgba(0,0,0,.18)"}}><div style={{fontSize:54}}>▶</div></div><div style={{marginTop:12,fontSize:20,fontWeight:900}}>换装视频</div></FadeSlide>
    <Person sourceStart={16.87} pip />
  </AbsoluteFill>;
};

const WaitScene = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame,[10,58],[0,100],{easing:Easing.out(Easing.cubic),extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  return <AbsoluteFill style={{fontFamily:"Arial, PingFang SC, sans-serif",color:"white"}}>
    <Person sourceStart={23.3} />
    <AbsoluteFill style={{background:"linear-gradient(90deg,rgba(26,18,37,.68),rgba(26,18,37,.04) 65%)"}} />
    <div style={{position:"absolute",left:62,top:100}}><Kicker color="#d5c4fa">GENERATING · 正在生成</Kicker></div>
    <FadeSlide at={4} x={-28} style={{position:"absolute",left:62,top:160}}><div style={{fontSize:112,fontWeight:950,lineHeight:.9}}>2<span style={{fontSize:42,color:"#d5c4fa",marginLeft:14}}>分钟</span></div><div style={{fontSize:38,fontWeight:850,marginTop:20}}>完整视频自动生成</div></FadeSlide>
    <div style={{position:"absolute",left:64,top:410,width:470,height:10,borderRadius:99,background:"rgba(255,255,255,.2)",overflow:"hidden"}}><div style={{width:`${progress}%`,height:"100%",background:"#d5c4fa"}} /></div>
    <div style={{position:"absolute",left:64,top:438,width:470,display:"flex",justifyContent:"space-between",fontSize:18,color:"rgba(255,255,255,.7)"}}><span>Seedance 2.0</span><span>{Math.round(progress)}%</span></div>
  </AbsoluteFill>;
};

const FinalResult = () => {
  return <AbsoluteFill style={{fontFamily:"Arial, PingFang SC, sans-serif",color:"white"}}>
    <EditorialBackground dark />
    <div style={{position:"absolute",left:42,top:42}}><Kicker color="#d5c4fa">REPRODUCED RESULT · 复现结果</Kicker></div>
    <VerticalAsset src="result-with-bgm.mov" />
    <div style={{position:"absolute",right:42,top:126,width:330}}>
      <FadeSlide at={3} x={24}><div style={{fontSize:55,fontWeight:950,lineHeight:1.02}}>复现的<br/><span style={{color:"#d5c4fa"}}>效果</span></div></FadeSlide>
    </div>
    <Sequence durationInFrames={43}><Person sourceStart={25.63} pip /></Sequence>
    <Sequence from={43}><Freeze frame={41}><Person sourceStart={25.63} pip /></Freeze></Sequence>
  </AbsoluteFill>;
};

const PromptSheet = ({number, at, side}: {number: string; at: number; side: "left" | "right"}) => {
  const frame = useCurrentFrame();
  const p = enter(frame, at, 18);
  const active = enter(frame, at + 34, 15);
  return <div style={{position:"absolute",left:side==="left"?76:562,top:286,width:442,height:470,padding:"30px 32px",boxSizing:"border-box",background:"#f6f1e9",color:ink,boxShadow:"0 26px 70px rgba(0,0,0,.26)",transform:`translateY(${(1-p)*45}px) rotate(${side==="left"?-2:2}deg)`,opacity:p}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:17,fontWeight:900,letterSpacing:2,color:lilac}}><span>PROMPT</span><span>{number}</span></div>
    <div style={{fontSize:40,fontWeight:950,marginTop:20}}>对应特征</div>
    {["角色特征","衣服特征"].map((label,index)=><div key={label} style={{marginTop:38}}><div style={{display:"flex",justifyContent:"space-between",fontSize:25,fontWeight:850}}><span>{label}</span><span style={{fontSize:17,color:index===0?coral:lilac}}>REPLACE</span></div><div style={{height:8,marginTop:13,borderRadius:99,background:"rgba(24,23,22,.12)",overflow:"hidden"}}><div style={{height:"100%",width:`${active*88}%`,background:index===0?coral:lilac}} /></div></div>)}
    <div style={{position:"absolute",left:32,right:32,bottom:28,display:"flex",alignItems:"center",gap:10,color:green,fontSize:21,fontWeight:900}}><span style={{width:25,height:25,borderRadius:"50%",display:"grid",placeItems:"center",background:green,color:"white",fontSize:16}}>✓</span>只改这里</div>
  </div>;
};

const ClosingExplainer = () => {
  const frame = useCurrentFrame();
  const summary = enter(frame, 180, 20);
  const detailsOut = interpolate(frame,[168,190],[1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  return <AbsoluteFill style={{fontFamily:"Arial, PingFang SC, sans-serif",color:"white"}}>
    <EditorialBackground dark />
    <div style={{position:"absolute",left:54,top:54}}><Kicker color="#d5c4fa">REUSE THE WORKFLOW · 继续复用</Kicker></div>
    <FadeSlide at={3} x={-24} style={{position:"absolute",left:54,top:112}}><div style={{fontSize:74,fontWeight:950,lineHeight:.98}}>想换角色<br/>或者衣服？</div></FadeSlide>
    <div style={{position:"absolute",inset:0,opacity:detailsOut}}>
      <FadeSlide at={18} style={{position:"absolute",right:65,top:122,width:330,textAlign:"right"}}><div style={{fontSize:25,color:"rgba(255,255,255,.62)"}}>只需要修改</div><div style={{fontSize:42,fontWeight:950,color:"#d5c4fa",marginTop:8}}>对应特征</div></FadeSlide>
      <PromptSheet number="01" at={30} side="left" />
      <PromptSheet number="02" at={49} side="right" />
      <FlowArrow left={264} top={820} width={535} at={92} />
      <FadeSlide at={112} style={{position:"absolute",left:317,top:860,width:450,textAlign:"center"}}><div style={{fontSize:24,color:"rgba(255,255,255,.58)"}}>角色与衣服同步替换</div><div style={{fontSize:43,fontWeight:950,marginTop:9}}>工作流保持不变</div></FadeSlide>
    </div>
    <div style={{position:"absolute",inset:0,opacity:summary}}>
      <div style={{position:"absolute",left:70,top:310,width:300}}><div style={{fontSize:190,fontWeight:950,lineHeight:.78,color:"#d5c4fa"}}>2</div><div style={{fontSize:42,fontWeight:950,marginTop:24}}>个提示词</div></div>
      <div style={{position:"absolute",left:420,top:320,width:585}}><div style={{fontSize:64,fontWeight:950,lineHeight:1.03}}>复现整套<br/><span style={{color:"#d5c4fa"}}>AI 换装工作流</span></div><div style={{display:"flex",alignItems:"center",gap:16,marginTop:55}}>{["拼贴图","Seedance 2.0","换装视频"].map((label,index)=><div key={label} style={{display:"flex",alignItems:"center",gap:16}}><div style={{padding:"15px 19px",borderRadius:999,border:"1px solid rgba(255,255,255,.28)",fontSize:20,fontWeight:850}}>{label}</div>{index<2?<span style={{color:"#d5c4fa",fontSize:28}}>→</span>:null}</div>)}</div></div>
      <FadeSlide at={244} y={24} style={{position:"absolute",left:70,right:70,bottom:210,paddingTop:30,borderTop:"1px solid rgba(255,255,255,.2)",display:"flex",justifyContent:"space-between",alignItems:"end"}}><div><div style={{fontSize:58,fontWeight:950}}>先收藏</div><div style={{fontSize:23,color:"rgba(255,255,255,.58)",marginTop:8}}>需要时直接拿来复现</div></div><div style={{fontSize:32,fontWeight:900,textAlign:"right"}}>下一个爆款<br/><span style={{color:"#d5c4fa"}}>说不定就是你</span></div></FadeSlide>
    </div>
  </AbsoluteFill>;
};

const captions = [
  [7,29,"先看这个视频"],[254,320,"最近这种 AI 转身换装视频特别火"],[322,365,"今天我们来拆一下它的工作流"],[375,429,"整个流程其实很简单，只需要两个提示词"],
  [446,495,"第一步，复制第一个提示词"],[502,559,"把角色和衣服改成你想要的样子"],[568,623,"然后发给豆包或者其他的生图软件"],[646,693,"生成一张人物穿搭的拼贴图"],
  [713,761,"然后我们复制第二个提示词"],[764,828,"把里面角色和衣服的特征都改一下"],[832,906,"和第一张图片一起发给 Seedance 2.0"],[906,963,"等两分钟，完整的换装视频就出来了"],
  [976,1017,"我们看一下我复现的效果"],[1218,1275,"以后想要换其他角色或者衣服"],[1278,1345,"只需要修改里面的提示词特征就可以了"],[1363,1441,"两个提示词就能复现整个 AI 换装视频的工作流"],[1450,1510,"赶快收藏一下，说不定下一个爆款就是你"],
] as const;

const Subtitles = () => {
  const frame = useCurrentFrame();
  const item = captions.find(([s,e])=>frame>=s&&frame<=e);
  if(!item) return null;
  return <div style={{position:"absolute",left:74,right:74,bottom:34,zIndex:100,display:"flex",justifyContent:"center",pointerEvents:"none"}}><div style={{padding:"13px 24px 14px",borderRadius:14,background:"rgba(15,14,13,.78)",boxShadow:"0 8px 28px rgba(0,0,0,.24)",color:"white",fontFamily:"Arial, PingFang SC, sans-serif",fontSize:34,fontWeight:850,lineHeight:1.2,textAlign:"center",textShadow:"0 2px 6px rgba(0,0,0,.4)"}}>{item[2]}</div></div>;
};

const MasterAudio = () => <>
  <Sequence durationInFrames={36}><Audio src={asset("source.mov")} trimAfter={36} /></Sequence>
  <Sequence from={36} durationInFrames={216}><Audio src={asset("viral-example.mp4")} trimAfter={216} volume={0.9} /></Sequence>
  <Sequence from={OPEN_END} durationInFrames={765}><Audio src={asset("source.mov")} trimBefore={45} trimAfter={810} /></Sequence>
  <Sequence from={CLOSING} durationInFrames={TOTAL-CLOSING}><Audio src={asset("source.mov")} trimBefore={815} /></Sequence>
  <Sequence from={RESULT} durationInFrames={CLOSING-RESULT}><Audio src={asset("result-with-bgm.mov")} trimAfter={CLOSING-RESULT} volume={0.12} /></Sequence>
</>;

export const OutfitWorkflow = () => (
  <AbsoluteFill style={{background:ink}}>
    <Sequence durationInFrames={OPEN_END}><Opening /></Sequence>
    <Sequence from={OPEN_END} durationInFrames={STEP_ONE-OPEN_END}><ViralProof /></Sequence>
    <Sequence from={STEP_ONE} durationInFrames={STEP_TWO-STEP_ONE}><PromptOne /></Sequence>
    <Sequence from={STEP_TWO} durationInFrames={WAIT-STEP_TWO}><PromptTwo /></Sequence>
    <Sequence from={WAIT} durationInFrames={RESULT-WAIT}><WaitScene /></Sequence>
    <Sequence from={RESULT} durationInFrames={CLOSING-RESULT}><FinalResult /></Sequence>
    <Sequence from={CLOSING} durationInFrames={TOTAL-CLOSING}><ClosingExplainer /></Sequence>
    <MasterAudio />
    <Subtitles />
  </AbsoluteFill>
);
