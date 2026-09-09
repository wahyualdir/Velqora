import React from "react";

export interface FolderPixelIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

/**
 * Pixel-art Folder Icon matching the retro 2.5D OS design.
 * Built with crispEdges vector rectangles for flawless pixel scaling at any resolution.
 */
export function FolderPixelIcon({
  size = 20,
  className = "inline-block shrink-0",
  width,
  height,
  ...props
}: FolderPixelIconProps) {
  const w = width ?? size;
  const h = height ?? size;

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      width={w}
      height={h}
      className={className}
      role="img"
      aria-label="Logo Folder Pixel"
      {...props}
    >
      <g fill="#a85424">
          <rect x="12" y="3" width="4" height="1" />
          <rect x="29" y="12" width="1" height="1" />
          <rect x="29" y="13" width="1" height="1" />
          <rect x="29" y="14" width="1" height="1" />
          <rect x="29" y="15" width="1" height="1" />
          <rect x="29" y="16" width="1" height="1" />
          <rect x="29" y="17" width="1" height="1" />
          <rect x="29" y="18" width="1" height="1" />
          <rect x="29" y="19" width="1" height="1" />
          <rect x="29" y="20" width="1" height="1" />
          <rect x="29" y="21" width="1" height="1" />
          <rect x="29" y="22" width="1" height="1" />
          <rect x="29" y="23" width="1" height="1" />
          <rect x="29" y="24" width="1" height="1" />
          <rect x="29" y="25" width="1" height="1" />
          <rect x="29" y="26" width="1" height="1" />
          <rect x="29" y="27" width="1" height="1" />
        </g>
        <g fill="#d6d3d1">
          <rect x="23" y="8" width="3" height="1" />
          <rect x="27" y="9" width="1" height="1" />
          <rect x="27" y="10" width="1" height="1" />
          <rect x="27" y="11" width="1" height="1" />
          <rect x="27" y="12" width="1" height="1" />
          <rect x="27" y="13" width="1" height="1" />
          <rect x="27" y="14" width="1" height="1" />
          <rect x="27" y="15" width="1" height="1" />
          <rect x="27" y="16" width="1" height="1" />
          <rect x="27" y="17" width="1" height="1" />
          <rect x="27" y="18" width="1" height="1" />
          <rect x="27" y="19" width="1" height="1" />
          <rect x="27" y="20" width="1" height="1" />
          <rect x="27" y="21" width="1" height="1" />
          <rect x="27" y="22" width="1" height="1" />
          <rect x="27" y="23" width="1" height="1" />
          <rect x="27" y="24" width="1" height="1" />
          <rect x="27" y="25" width="1" height="1" />
          <rect x="27" y="26" width="1" height="1" />
        </g>
        <g fill="#ffffff">
          <rect x="22" y="8" width="1" height="1" />
          <rect x="24" y="9" width="2" height="1" />
          <rect x="25" y="10" width="1" height="1" />
          <rect x="25" y="11" width="1" height="1" />
          <rect x="25" y="12" width="1" height="1" />
          <rect x="25" y="13" width="1" height="1" />
          <rect x="25" y="14" width="1" height="1" />
          <rect x="25" y="15" width="1" height="1" />
          <rect x="25" y="16" width="1" height="1" />
          <rect x="25" y="17" width="1" height="1" />
          <rect x="25" y="18" width="1" height="1" />
          <rect x="25" y="19" width="1" height="1" />
          <rect x="25" y="20" width="1" height="1" />
          <rect x="25" y="21" width="1" height="1" />
          <rect x="25" y="22" width="1" height="1" />
          <rect x="25" y="23" width="1" height="1" />
          <rect x="25" y="24" width="1" height="1" />
          <rect x="25" y="25" width="1" height="1" />
          <rect x="25" y="26" width="1" height="1" />
        </g>
        <g fill="#e78b36">
          <rect x="1" y="5" width="1" height="1" />
          <rect x="1" y="6" width="1" height="1" />
          <rect x="1" y="7" width="1" height="1" />
          <rect x="1" y="8" width="1" height="1" />
          <rect x="1" y="9" width="1" height="1" />
          <rect x="1" y="10" width="1" height="1" />
          <rect x="1" y="11" width="1" height="1" />
          <rect x="1" y="12" width="1" height="1" />
          <rect x="1" y="13" width="1" height="1" />
          <rect x="1" y="14" width="1" height="1" />
          <rect x="1" y="15" width="1" height="1" />
          <rect x="1" y="16" width="1" height="1" />
          <rect x="1" y="17" width="1" height="1" />
          <rect x="1" y="18" width="1" height="1" />
          <rect x="1" y="19" width="1" height="1" />
          <rect x="1" y="20" width="1" height="1" />
          <rect x="1" y="21" width="1" height="1" />
          <rect x="1" y="22" width="1" height="1" />
          <rect x="1" y="23" width="1" height="1" />
          <rect x="1" y="24" width="1" height="1" />
          <rect x="1" y="25" width="1" height="1" />
          <rect x="1" y="26" width="1" height="1" />
        </g>
        <g fill="#d97706">
          <rect x="1" y="4" width="1" height="1" />
          <rect x="1" y="27" width="23" height="1" />
          <rect x="25" y="27" width="1" height="1" />
          <rect x="27" y="27" width="1" height="1" />
        </g>
        <g fill="#f59e0b">
          <rect x="1" y="3" width="2" height="1" />
          <rect x="10" y="3" width="1" height="1" />
          <rect x="3" y="4" width="9" height="1" />
          <rect x="13" y="4" width="6" height="1" />
          <rect x="2" y="5" width="15" height="1" />
          <rect x="19" y="5" width="3" height="1" />
          <rect x="2" y="6" width="16" height="1" />
          <rect x="20" y="6" width="2" height="1" />
          <rect x="2" y="7" width="17" height="1" />
          <rect x="2" y="8" width="18" height="1" />
          <rect x="2" y="9" width="19" height="1" />
          <rect x="2" y="10" width="19" height="1" />
          <rect x="2" y="11" width="20" height="1" />
          <rect x="2" y="12" width="20" height="1" />
          <rect x="2" y="13" width="20" height="1" />
          <rect x="2" y="14" width="20" height="1" />
          <rect x="2" y="15" width="20" height="1" />
          <rect x="2" y="16" width="20" height="1" />
          <rect x="2" y="17" width="20" height="1" />
          <rect x="2" y="18" width="20" height="1" />
          <rect x="2" y="19" width="20" height="1" />
          <rect x="2" y="20" width="20" height="1" />
          <rect x="2" y="21" width="20" height="1" />
          <rect x="2" y="22" width="20" height="1" />
          <rect x="2" y="23" width="20" height="1" />
          <rect x="2" y="24" width="20" height="1" />
          <rect x="2" y="25" width="20" height="1" />
          <rect x="2" y="26" width="20" height="1" />
        </g>
        <g fill="#fde047">
          <rect x="3" y="3" width="7" height="1" />
          <rect x="2" y="4" width="1" height="1" />
          <rect x="17" y="5" width="1" height="1" />
          <rect x="18" y="6" width="1" height="1" />
          <rect x="19" y="7" width="1" height="1" />
          <rect x="20" y="8" width="1" height="1" />
          <rect x="21" y="9" width="1" height="1" />
          <rect x="21" y="10" width="2" height="1" />
          <rect x="22" y="11" width="1" height="1" />
          <rect x="22" y="12" width="1" height="1" />
          <rect x="22" y="13" width="1" height="1" />
          <rect x="22" y="14" width="1" height="1" />
          <rect x="22" y="15" width="1" height="1" />
          <rect x="22" y="16" width="1" height="1" />
          <rect x="22" y="17" width="1" height="1" />
          <rect x="22" y="18" width="1" height="1" />
          <rect x="22" y="19" width="1" height="1" />
          <rect x="22" y="20" width="1" height="1" />
          <rect x="22" y="21" width="1" height="1" />
          <rect x="22" y="22" width="1" height="1" />
          <rect x="22" y="23" width="1" height="1" />
          <rect x="22" y="24" width="1" height="1" />
          <rect x="22" y="25" width="1" height="1" />
          <rect x="22" y="26" width="1" height="1" />
        </g>
        <g fill="#1c1917">
          <rect x="1" y="2" width="16" height="1" />
          <rect x="0" y="3" width="1" height="1" />
          <rect x="11" y="3" width="1" height="1" />
          <rect x="16" y="3" width="2" height="1" />
          <rect x="0" y="4" width="1" height="1" />
          <rect x="12" y="4" width="1" height="1" />
          <rect x="0" y="5" width="1" height="1" />
          <rect x="18" y="5" width="1" height="1" />
          <rect x="0" y="6" width="1" height="1" />
          <rect x="19" y="6" width="1" height="1" />
          <rect x="0" y="7" width="1" height="1" />
          <rect x="20" y="7" width="7" height="1" />
          <rect x="0" y="8" width="1" height="1" />
          <rect x="21" y="8" width="1" height="1" />
          <rect x="26" y="8" width="2" height="1" />
          <rect x="0" y="9" width="1" height="1" />
          <rect x="22" y="9" width="2" height="1" />
          <rect x="26" y="9" width="1" height="1" />
          <rect x="28" y="9" width="1" height="1" />
          <rect x="0" y="10" width="1" height="1" />
          <rect x="23" y="10" width="2" height="1" />
          <rect x="26" y="10" width="1" height="1" />
          <rect x="28" y="10" width="2" height="1" />
          <rect x="0" y="11" width="1" height="1" />
          <rect x="23" y="11" width="2" height="1" />
          <rect x="26" y="11" width="1" height="1" />
          <rect x="28" y="11" width="2" height="1" />
          <rect x="0" y="12" width="1" height="1" />
          <rect x="23" y="12" width="2" height="1" />
          <rect x="26" y="12" width="1" height="1" />
          <rect x="28" y="12" width="1" height="1" />
          <rect x="30" y="12" width="1" height="1" />
          <rect x="0" y="13" width="1" height="1" />
          <rect x="23" y="13" width="2" height="1" />
          <rect x="26" y="13" width="1" height="1" />
          <rect x="28" y="13" width="1" height="1" />
          <rect x="30" y="13" width="1" height="1" />
          <rect x="0" y="14" width="1" height="1" />
          <rect x="23" y="14" width="2" height="1" />
          <rect x="26" y="14" width="1" height="1" />
          <rect x="28" y="14" width="1" height="1" />
          <rect x="30" y="14" width="1" height="1" />
          <rect x="0" y="15" width="1" height="1" />
          <rect x="23" y="15" width="2" height="1" />
          <rect x="26" y="15" width="1" height="1" />
          <rect x="28" y="15" width="1" height="1" />
          <rect x="30" y="15" width="1" height="1" />
          <rect x="0" y="16" width="1" height="1" />
          <rect x="23" y="16" width="2" height="1" />
          <rect x="26" y="16" width="1" height="1" />
          <rect x="28" y="16" width="1" height="1" />
          <rect x="30" y="16" width="1" height="1" />
          <rect x="0" y="17" width="1" height="1" />
          <rect x="23" y="17" width="2" height="1" />
          <rect x="26" y="17" width="1" height="1" />
          <rect x="28" y="17" width="1" height="1" />
          <rect x="30" y="17" width="1" height="1" />
          <rect x="0" y="18" width="1" height="1" />
          <rect x="23" y="18" width="2" height="1" />
          <rect x="26" y="18" width="1" height="1" />
          <rect x="28" y="18" width="1" height="1" />
          <rect x="30" y="18" width="1" height="1" />
          <rect x="0" y="19" width="1" height="1" />
          <rect x="23" y="19" width="2" height="1" />
          <rect x="26" y="19" width="1" height="1" />
          <rect x="28" y="19" width="1" height="1" />
          <rect x="30" y="19" width="1" height="1" />
          <rect x="0" y="20" width="1" height="1" />
          <rect x="23" y="20" width="2" height="1" />
          <rect x="26" y="20" width="1" height="1" />
          <rect x="28" y="20" width="1" height="1" />
          <rect x="30" y="20" width="1" height="1" />
          <rect x="0" y="21" width="1" height="1" />
          <rect x="23" y="21" width="2" height="1" />
          <rect x="26" y="21" width="1" height="1" />
          <rect x="28" y="21" width="1" height="1" />
          <rect x="30" y="21" width="1" height="1" />
          <rect x="0" y="22" width="1" height="1" />
          <rect x="23" y="22" width="2" height="1" />
          <rect x="26" y="22" width="1" height="1" />
          <rect x="28" y="22" width="1" height="1" />
          <rect x="30" y="22" width="1" height="1" />
          <rect x="0" y="23" width="1" height="1" />
          <rect x="23" y="23" width="2" height="1" />
          <rect x="26" y="23" width="1" height="1" />
          <rect x="28" y="23" width="1" height="1" />
          <rect x="30" y="23" width="1" height="1" />
          <rect x="0" y="24" width="1" height="1" />
          <rect x="23" y="24" width="2" height="1" />
          <rect x="26" y="24" width="1" height="1" />
          <rect x="28" y="24" width="1" height="1" />
          <rect x="30" y="24" width="1" height="1" />
          <rect x="0" y="25" width="1" height="1" />
          <rect x="23" y="25" width="2" height="1" />
          <rect x="26" y="25" width="1" height="1" />
          <rect x="28" y="25" width="1" height="1" />
          <rect x="30" y="25" width="1" height="1" />
          <rect x="0" y="26" width="1" height="1" />
          <rect x="23" y="26" width="2" height="1" />
          <rect x="26" y="26" width="1" height="1" />
          <rect x="28" y="26" width="1" height="1" />
          <rect x="30" y="26" width="1" height="1" />
          <rect x="0" y="27" width="1" height="1" />
          <rect x="24" y="27" width="1" height="1" />
          <rect x="26" y="27" width="1" height="1" />
          <rect x="28" y="27" width="1" height="1" />
          <rect x="30" y="27" width="1" height="1" />
          <rect x="1" y="28" width="30" height="1" />
        </g>
    </svg>
  );
}

export const PixelFolderIcon = FolderPixelIcon;
export default FolderPixelIcon;
