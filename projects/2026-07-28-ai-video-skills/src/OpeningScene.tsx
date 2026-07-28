import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const C = {
  bg: "#F3EFE7",
  fg: "#17151B",
  accent: "#7657D6",
  accentSoft: "#E8E0FB",
  muted: "#6E6875",
  panel: "#FBF9F4",
  line: "#CBC3D7",
  danger: "#D75555",
  warning: "#E49A45",
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

const fade = (frame: number, input: [number, number]) =>
  interpolate(frame, input, [0, 1], {...clamp, easing: easeOut});

const skillCards = [
  {name: "HyperFrames", role: "动态设计", code: "01"},
  {name: "Remotion", role: "代码动画", code: "02"},
  {name: "video-use", role: "真人剪辑", code: "03"},
  {name: "Seedance", role: "补充镜头", code: "04"},
];

const clips = [
  {left: 0, width: 250, color: "#D9CFF4"},
  {left: 265, width: 150, color: "#F0CDA6"},
  {left: 430, width: 330, color: "#C8DDCE"},
  {left: 775, width: 180, color: "#D9CFF4"},
  {left: 970, width: 280, color: "#F0CDA6"},
  {left: 1265, width: 215, color: "#C8DDCE"},
  {left: 1495, width: 265, color: "#D9CFF4"},
];

const ManualTimeline: React.FC<{frame: number}> = ({frame}) => {
  const inProgress = fade(frame, [8, 30]);
  const cursorProgress = interpolate(frame, [20, 76], [0, 1], clamp);
  const cursorX = interpolate(cursorProgress, [0, 1], [175, 1540]);
  const rulerWidth = interpolate(frame, [10, 62], [0, 1], clamp);

  return (
    <div
      style={{
        position: "absolute",
        left: 94,
        right: 94,
        bottom: 82,
        height: 310,
        borderRadius: 28,
        border: `2px solid ${C.line}`,
        backgroundColor: C.panel,
        boxShadow: "0 28px 70px rgba(45,32,64,.12)",
        opacity: inProgress,
        translate: `0 ${interpolate(inProgress, [0, 1], [42, 0])}px`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 56,
          borderBottom: `2px solid ${C.line}`,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 22px",
          fontFamily: mono,
          fontSize: 18,
          color: C.muted,
        }}
      >
        <span style={{color: C.danger}}>●</span>
        <span>手动剪辑时间线</span>
        <span style={{marginLeft: "auto"}}>片段 27 · 调整 46 次</span>
      </div>

      <div style={{position: "absolute", inset: "82px 28px 28px 118px"}}>
        {[0, 1, 2].map((track) => (
          <div
            key={track}
            style={{
              position: "relative",
              height: 58,
              marginBottom: 14,
              borderRadius: 10,
              backgroundColor: "#ECE7DE",
              overflow: "hidden",
            }}
          >
            {clips.slice(track, track + 5).map((clip, index) => {
              const appear = fade(frame, [18 + index * 3, 34 + index * 3]);
              return (
                <div
                  key={`${track}-${index}`}
                  style={{
                    position: "absolute",
                    left: (clip.left + track * 120) % 1380,
                    top: 5,
                    width: Math.max(88, clip.width - track * 24),
                    height: 48,
                    borderRadius: 7,
                    border: "1px solid rgba(23,21,27,.13)",
                    backgroundColor: clip.color,
                    opacity: appear,
                    scale: `${interpolate(appear, [0, 1], [0.82, 1])} 1`,
                    transformOrigin: "left center",
                  }}
                />
              );
            })}
          </div>
        ))}

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: -14,
            height: 4,
            borderRadius: 99,
            background: `linear-gradient(90deg, ${C.danger} ${rulerWidth * 100}%, ${C.line} ${rulerWidth * 100}%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: cursorX,
            top: -18,
            bottom: -10,
            width: 3,
            backgroundColor: C.danger,
            boxShadow: "0 0 0 5px rgba(215,85,85,.12)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 22,
          top: 91,
          width: 78,
          fontFamily: mono,
          fontSize: 17,
          lineHeight: 4.25,
          color: C.muted,
        }}
      >
        视频
        <br />
        字幕
        <br />
        音频
      </div>
    </div>
  );
};

export const OpeningManualToFourSkills: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const painIn = spring({
    frame,
    fps,
    config: {damping: 18, stiffness: 170, mass: 0.85},
    durationInFrames: 28,
  });
  const painOut = interpolate(frame, [78, 99], [1, 0], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const workflowIn = fade(frame, [82, 105]);
  const railProgress = interpolate(frame, [102, 145], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const finaleIn = interpolate(frame, [151, 174], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const counter = Math.round(
    interpolate(frame, [8, 77], [18, 227], clamp),
  );
  const hours = Math.floor(counter / 60);
  const minutes = counter % 60;

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
            "radial-gradient(circle at 82% 12%, rgba(118,87,214,.15), transparent 30%), repeating-linear-gradient(90deg, rgba(67,55,84,.045) 0, rgba(67,55,84,.045) 1px, transparent 1px, transparent 96px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 76,
          top: 58,
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: mono,
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: 2,
          color: C.accent,
        }}
      >
        <span
          style={{
            width: 13,
            height: 13,
            borderRadius: "50%",
            backgroundColor: C.accent,
          }}
        />
        AI VIDEO WORKFLOW
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: painOut,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 92,
            top: 126,
            opacity: painIn,
            translate: `${interpolate(painIn, [0, 1], [-80, 0])}px 0`,
          }}
        >
          <div
            style={{
              fontSize: 44,
              fontWeight: 650,
              color: C.muted,
              marginBottom: 2,
            }}
          >
            你还在花
          </div>
          <div
            style={{
              fontFamily: serif,
              fontSize: 164,
              fontWeight: 700,
              lineHeight: 0.98,
              letterSpacing: -8,
            }}
          >
            几个小时
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 48,
              fontWeight: 700,
            }}
          >
            手动剪一条视频吗？
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: 112,
            top: 152,
            width: 328,
            height: 214,
            borderRadius: 30,
            color: "#FFF9F4",
            backgroundColor: C.fg,
            boxShadow: "0 28px 70px rgba(23,21,27,.18)",
            padding: "30px 34px",
            opacity: fade(frame, [14, 34]),
            scale: interpolate(fade(frame, [14, 34]), [0, 1], [0.76, 1]),
          }}
        >
          <div
            style={{
              fontFamily: mono,
              fontSize: 17,
              letterSpacing: 2,
              color: "#B8AFBF",
            }}
          >
            ELAPSED TIME
          </div>
          <div
            style={{
              fontFamily: mono,
              fontSize: 68,
              fontWeight: 800,
              letterSpacing: -4,
              marginTop: 20,
            }}
          >
            {String(hours).padStart(2, "0")}:
            {String(minutes).padStart(2, "0")}
          </div>
          <div style={{fontSize: 23, color: "#D7CFDD", marginTop: 8}}>
            还在拖时间线……
          </div>
        </div>

        <ManualTimeline frame={frame} />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: workflowIn,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 150,
            textAlign: "center",
            fontSize: 41,
            fontWeight: 700,
            color: C.muted,
            opacity: interpolate(frame, [84, 108, 145, 159], [0, 1, 1, 0], clamp),
            translate: `0 ${interpolate(workflowIn, [0, 1], [25, 0])}px`,
          }}
        >
          装上这
          <span
            style={{
              fontFamily: serif,
              fontSize: 102,
              lineHeight: 1,
              color: C.accent,
              margin: "0 16px",
            }}
          >
            4
          </span>
          个 Skill
        </div>

        <svg
          viewBox="0 0 1920 1080"
          style={{position: "absolute", inset: 0, width: "100%", height: "100%"}}
        >
          <path
            d="M 236 666 C 470 666, 478 666, 662 666 S 1025 666, 1108 666 S 1438 666, 1684 666"
            fill="none"
            stroke={C.line}
            strokeWidth={10}
            strokeLinecap="round"
          />
          <path
            d="M 236 666 C 470 666, 478 666, 662 666 S 1025 666, 1108 666 S 1438 666, 1684 666"
            pathLength={1}
            fill="none"
            stroke={C.accent}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={1}
            strokeDashoffset={1 - railProgress}
          />
        </svg>

        {skillCards.map((skill, index) => {
          const cardIn = spring({
            frame: frame - (91 + index * 5),
            fps,
            config: {damping: 17, stiffness: 150, mass: 0.8},
            durationInFrames: 38,
          });
          const targetX = 225 + index * 490;
          const x = interpolate(cardIn, [0, 1], [960, targetX]);
          const y = interpolate(cardIn, [0, 1], [666, 666]);
          const complete = fade(frame, [132 + index * 4, 145 + index * 4]);

          return (
            <div
              key={skill.name}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: 390,
                height: 210,
                marginLeft: -195,
                marginTop: -105,
                borderRadius: 27,
                border: `2px solid ${C.accent}`,
                backgroundColor: C.panel,
                boxShadow: "0 25px 60px rgba(45,32,64,.16)",
                scale: interpolate(cardIn, [0, 1], [0.52, 1]),
                opacity: cardIn,
                padding: "25px 28px",
                zIndex: index + 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontFamily: mono,
                  color: C.accent,
                  fontSize: 20,
                  fontWeight: 800,
                }}
              >
                {skill.code}
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    color: "white",
                    backgroundColor: complete > 0.5 ? C.green : C.accent,
                    scale: interpolate(complete, [0, 1], [0.72, 1]),
                  }}
                >
                  ✓
                </span>
              </div>
              <div
                style={{
                  marginTop: 26,
                  fontSize: skill.name.length > 10 ? 34 : 40,
                  fontWeight: 800,
                  letterSpacing: -1,
                }}
              >
                {skill.name}
              </div>
              <div style={{fontSize: 25, color: C.muted, marginTop: 9}}>
                {skill.role}
              </div>
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 147,
            textAlign: "center",
            opacity: finaleIn,
            translate: `0 ${interpolate(finaleIn, [0, 1], [34, 0])}px`,
          }}
        >
          <div
            style={{
              fontFamily: serif,
              fontSize: 132,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: -7,
            }}
          >
            人人都是
            <span style={{color: C.accent}}>剪辑师</span>
          </div>
          <div
            style={{
              display: "inline-block",
              marginTop: 22,
              padding: "9px 22px",
              borderRadius: 999,
              backgroundColor: C.accentSoft,
              color: C.accent,
              fontFamily: mono,
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: 2,
            }}
          >
            4 SKILLS · 1 WORKFLOW
          </div>
          <div
            style={{
              width: interpolate(frame, [177, 231], [0, 620], clamp),
              height: 5,
              margin: "28px auto 0",
              borderRadius: 99,
              backgroundColor: C.accent,
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 76,
          top: 60,
          fontFamily: mono,
          fontSize: 18,
          color: C.muted,
        }}
      >
        00 / 04
      </div>
    </AbsoluteFill>
  );
};
