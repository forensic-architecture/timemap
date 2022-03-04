import React from "react";
import PropTypes from "prop-types";

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  primary,
  backgroundColor,
  borderRadius,
  size,
  label,
  normalCursor,
  ...props
}) => {
  const mode = primary ? "button--primary" : "button--secondary";
  return (
    <button
      type="button"
      className={[
        "button",
        `button--${size}`,
        mode,
        normalCursor ? "no-hover" : "",
      ].join(" ")}
      style={{ backgroundColor: backgroundColor, borderRadius: borderRadius }}
      {...props}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */
  primary: PropTypes.bool,
  /**
   * What background color to use
   */
  backgroundColor: PropTypes.string,
  /**
   * How much rounded are they?
   */
  borderRadius: PropTypes.string,
  /**
   * How large should the button be?
   */
  size: PropTypes.oneOf(["small", "medium", "large"]),
  /**
   * Button contents
   */
  label: PropTypes.string.isRequired,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
};

Button.defaultProps = {
  backgroundColor: "red",
  borderRadius: "0%",
  primary: false,
  size: "medium",
  onClick: undefined,
};

const CardButton = ({
  text,
  color = "#000",
  onClick = () => {},
  normalCursor,
}) => (
  <Button
    size={"small"}
    backgroundColor={color}
    borderRadius={"12px"}
    primary={false}
    label={text}
    onClick={onClick}
    normalCursor={normalCursor}
  />
);

export default CardButton;
