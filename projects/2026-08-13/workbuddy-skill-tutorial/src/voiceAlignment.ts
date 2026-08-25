import opening from "../work/alignment/transcripts/01-opening.json";
import definition from "../work/alignment/transcripts/02-what-is-skill.json";
import filter from "../work/alignment/transcripts/03-when-to-build.json";
import workflow from "../work/alignment/transcripts/04-workflow-card.json";
import triggers from "../work/alignment/transcripts/05-trigger-tests.json";
import files from "../work/alignment/transcripts/06-file-structure.json";
import create from "../work/alignment/transcripts/07-create.json";
import skillMd from "../work/alignment/transcripts/08-skill-md.json";
import validate from "../work/alignment/transcripts/09-validate.json";
import pitfalls from "../work/alignment/transcripts/10-pitfalls.json";
import closing from "../work/alignment/transcripts/11-closing.json";

type Word={text:string;start:number;end:number;type:string};
type Transcript={words:Word[]};
export type CaptionCue={start:number;end:number;text:string};

const transcripts:Record<string,Transcript>={
  "01-repeated-prompts":opening,
  "02-what-is-skill":definition,
  "03-when-to-build":filter,
  "04-workflow-card":workflow,
  "05-trigger-tests":triggers,
  "06-file-structure":files,
  "07-create-skill":create,
  "08-skill-md":skillMd,
  "09-validate-test":validate,
  "10-pitfalls":pitfalls,
  "11-closing":closing,
};

const clean=(text:string)=>text
  .replace(/scale\.md/gi,"SKILL.md")
  .replace(/scale/gi,"Skill")
  .replace(/skillcreator/gi,"skill creator")
  .replace(/weeklyreview/gi,"weekly review")
  .replace(/常资料/g,"长资料")
  .replace(/还再编/g,"还在编");

const makeCues=(source:Transcript):CaptionCue[]=>{
  const words=source.words.filter(word=>word.type==="word");
  const result:CaptionCue[]=[];
  let group:Word[]=[];
  words.forEach((word,index)=>{
    group.push(word);
    const next=words[index+1];
    const gap=next?next.start-word.end:1;
    const length=group.map(item=>item.text).join("").replace(/[，。！？；：]/g,"").length;
    const boundary=/[，。！？；：]$/.test(word.text)||gap>.38||length>=18;
    if(boundary){
      result.push({start:Math.max(0,group[0].start-.06),end:next?Math.max(word.end,next.start-.04):word.end+.15,text:clean(group.map(item=>item.text).join(""))});
      group=[];
    }
  });
  return result;
};

export const captionCues:Record<string,CaptionCue[]>=Object.fromEntries(
  Object.entries(transcripts).map(([id,source])=>[id,makeCues(source)]),
);
