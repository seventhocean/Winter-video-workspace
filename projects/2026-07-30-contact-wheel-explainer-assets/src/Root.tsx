import {Composition} from "remotion";
import {ApplicationMontage, PsychologyOpeningLandscape, ReusableWorkflow, WheelPrinciple} from "./Main";

export const Root = () => (
  <>
    <Composition id="PsychologyOpeningLandscape" component={PsychologyOpeningLandscape} durationInFrames={96} fps={30} width={1920} height={1080} />
    <Composition id="WheelPrinciple" component={WheelPrinciple} durationInFrames={240} fps={30} width={1920} height={1080} />
    <Composition id="ReusableWorkflow" component={ReusableWorkflow} durationInFrames={210} fps={30} width={1920} height={1080} />
    <Composition id="ApplicationMontage" component={ApplicationMontage} durationInFrames={180} fps={30} width={1920} height={1080} />
  </>
);
