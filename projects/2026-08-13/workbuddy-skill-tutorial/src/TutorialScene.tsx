import {AbsoluteFill,useCurrentFrame,useVideoConfig} from "remotion";
import type {StageScene} from "./schema";
import {ShotcraftRebuild} from "./ShotcraftRebuild";
import {captionCues} from "./voiceAlignment";

const Caption=({id,time,dark}:{id:string;time:number;dark:boolean})=>{
  const cues=captionCues[id]??[];
  const cue=cues.find(item=>time>=item.start&&time<item.end);
  if(!cue)return null;
  return <div style={{position:"absolute",left:115,right:115,bottom:48,display:"flex",justifyContent:"center",zIndex:30}}><div style={{color:dark?"#fffdf8":"#10151c",background:dark?"rgba(8,15,24,.86)":"rgba(255,253,247,.92)",borderBottom:"5px solid #2563ff",padding:"9px 22px 11px",fontSize:50,fontWeight:850,lineHeight:1.2,textAlign:"center",boxShadow:"0 12px 28px rgba(0,0,0,.14)",maxWidth:1180}}>{cue.text}</div></div>;
};

export const TutorialScene=({scene}:{scene:StageScene})=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig(),time=frame/fps;
  const dark=["02-what-is-skill","03-when-to-build","05-trigger-tests","07-create-skill","09-validate-test","11-closing"].includes(scene.sceneId);
  return <AbsoluteFill style={{fontFamily:'"PingFang SC","Helvetica Neue",Arial,sans-serif'}}><ShotcraftRebuild sceneId={scene.sceneId}/><Caption id={scene.sceneId} time={time} dark={dark}/></AbsoluteFill>;
};
