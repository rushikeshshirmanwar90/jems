import React from 'react';
import Svg, { Circle, Path, Polygon, Rect } from 'react-native-svg';
import { IconName, ICONS } from './iconData';

interface Props {
  name: IconName;
  size?: number;
  color?: string;
  sw?: number;
  fill?: string;
}

/** Stroke icon set shared with the design file (24x24 viewBox). */
export function Icon({ name, size = 24, color = '#000', sw = 2, fill }: Props) {
  return (
    <Svg style={{ position: "relative" }} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name].map((el, i) => {
        const { _fill, ...a } = el.a as Record<string, string | number | boolean>;
        const f = _fill ? color : fill ?? 'none';
        const common = { fill: f } as const;
        if (el.t === 'path') return <Path key={i} {...common} d={String(a.d)} />;
        if (el.t === 'circle') return <Circle key={i} {...common} cx={Number(a.cx)} cy={Number(a.cy)} r={Number(a.r)} />;
        if (el.t === 'polygon') return <Polygon key={i} {...common} points={String(a.points)} />;
        return <Rect key={i} {...common} x={Number(a.x)} y={Number(a.y)} width={Number(a.width)} height={Number(a.height)} rx={a.rx ? Number(a.rx) : undefined} />;
      })}
    </Svg>
  );
}
