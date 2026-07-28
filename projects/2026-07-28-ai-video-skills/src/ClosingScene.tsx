import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

const C = {
  bg: "#F3EFE7",
  fg: "#17151B",
  accent: "#7657D6",
  accentSoft: "#E8E0FB",
  muted: "#6E6875",
  panel: "#FBF9F4",
  line: "#CBC3D7",
  green: "#67B878",
};

const serif = '"Songti SC", STSong, Georgia, serif';
const sans =
  '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif';
const mono = '"SFMono-Regular", Menlo, Monaco, Consolas, monospace';
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

const items = [
  ["01", "HyperFrames", "设计"],
  ["02", "Remotion", "动画"],
  ["03", "video-use", "剪素材"],
  ["04", "Seedance", "补镜头"],
];

export const ClosingWorkflowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const lineProgress = interpolate(frame, [26, 176], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const headlineIn = interpolate(frame, [166, 194], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const completed = Math.min(
    4,
    Math.floor(interpolate(frame, [46, 178], [0, 4.99], clamp)),
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        color: C.fg,
        fontFamily: sans,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle at 82% 16%, rgba(118,87,214,.15), transparent 31%), repeating-linear-gradient(90deg, rgba(67,55,84,.045) 0, rgba(67,55,84,.045) 1px, transparent 1px, transparent 96px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 78,
          top: 58,
          fontFamily: mono,
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: 2,
          color: C.accent,
        }}
      >
        COMPLETE WORKFLOW · {completed} / 4
      </div>

      <div
        style={{
          position: "absolute",
          left: 105,
          right: 105,
          top: 210,
          height: 330,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 115,
            right: 115,
            top: 163,
            height: 10,
            borderRadius: 99,
            backgroundColor: C.line,
          }}
        >
          <div
            style={{
              width: `${lineProgress * 100}%`,
              height: "100%",
              borderRadius: 99,
              backgroundColor: C.accent,
            }}
          />
        </div>

        {items.map(([code, name, role], index) => {
          const itemIn = interpolate(
            frame,
            [32 + index * 38, 56 + index * 38],
            [0, 1],
            {...clamp, easing: easeOut},
          );
          const done = completed > index;
          return (
            <div
              key={name}
              style={{
                position: "absolute",
                left: 42 + index * 415,
                top: 48,
                width: 330,
                height: 230,
                borderRadius: 28,
                border: `3px solid ${done ? C.accent : C.line}`,
                backgroundColor: C.panel,
                boxShadow: "0 26px 65px rgba(45,32,64,.14)",
                padding: "26px 28px",
                opacity: itemIn,
                translate: `0 ${interpolate(itemIn, [0, 1], [48, 0])}px`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: mono,
                  fontSize: 20,
                  fontWeight: 800,
                  color: C.accent,
                }}
              >
                {code}
                <span style={{color: done ? C.green : C.line}}>●</span>
              </div>
              <div style={{fontSize: 34, fontWeight: 800, marginTop: 42}}>
                {name}
              </div>
              <div style={{fontSize: 26, color: C.muted, marginTop: 12}}>
                {role}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 142,
          textAlign: "center",
          opacity: headlineIn,
          translate: `0 ${interpolate(headlineIn, [0, 1], [36, 0])}px`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: -34,
            width: 1080,
            height: 205,
            marginLeft: -540,
            borderRadius: 34,
            backgroundColor: C.accentSoft,
            scale: `${interpolate(frame, [190, 239], [0, 1], {
              ...clamp,
              easing: easeOut,
            })} 1`,
            transformOrigin: "center center",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            fontFamily: serif,
            fontSize: 96,
            fontWeight: 700,
            lineHeight: 1.06,
            letterSpacing: -4,
          }}
        >
          四种能力，
          <span style={{color: C.accent}}>一条工作流</span>
        </div>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: interpolate(frame, [196, 232], [0, 730], clamp),
            height: 6,
            margin: "28px auto 0",
            borderRadius: 99,
            backgroundColor: C.accent,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
