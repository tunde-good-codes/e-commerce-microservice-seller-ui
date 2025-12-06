"use client";

import styled, { CSSProperties } from "styled-components";

interface BoxProps {
  css?: CSSProperties;
}

const Box = styled.div<BoxProps>`
  box-sizing: border-box;
  ${(props) =>
    props.css &&
    Object.entries(props.css)
      .map(([key, value]) => `${key}: ${value};`)
      .join("")}
`;

export default Box;
