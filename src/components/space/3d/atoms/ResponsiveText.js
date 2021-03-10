import React from "react";
import { useThree } from "react-three-fiber";
import { Text } from "@react-three/drei";

function ResponsiveText(props) {
  const { viewport } = useThree();
  const color = "black"; // useControl("color", { type: "color", value: "#EC2D2D" })
  const fontSize = 0.8; // useControl("fontSize", { type: "number", value: 16.5, min: 1, max: 100 })
  const maxWidth = 90; // useControl("maxWidth", { type: "number", value: 90, min: 1, max: 100 })
  const lineHeight = 0.05; // useControl("lineHeight", { type: "number", value: 0.75, min: 0.1, max: 10 })
  const letterSpacing = -0.08; // useControl("spacing", { type: "number", value: -0.08, min: -0.5, max: 1 })
  const textAlign = "justify"; // useControl("textAlign", {
  //     type: "select",
  //     items: ["left", "right", "center", "justify"],
  //     value: "justify",
  //   })
  return (
    <Text
      {...props}
      color={color}
      fontSize={fontSize}
      maxWidth={(viewport.width / 100) * maxWidth}
      lineHeight={lineHeight}
      letterSpacing={letterSpacing}
      textAlign={textAlign}
      font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
      anchorX="center"
      anchorY="middle"
    >
      {props.content}
    </Text>
  );
}

export default ResponsiveText;
