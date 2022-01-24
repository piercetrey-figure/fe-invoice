import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import { Loading } from "Components";

const StyledButton = styled.button`
  flex-basis: ${({ width }) => width};
  width: ${({ width }) => width};
  ${({ width }) => width === "auto" && "min-width: 150px"};
  align-items: center;
  background: ${({ backgroundColor }) => backgroundColor};
  white-space: nowrap;
  border-radius: 6px;
  border: 1px solid
    ${({ borderColor, backgroundColor }) => borderColor || backgroundColor};
  color: ${({ color }) => color};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  display: flex;
  justify-content: center;
  letter-spacing: 0.07rem;
  transition: 250ms all;
  user-select: none;
  font-size: 1.2rem;
  height: 40px;
  padding: 0 30px;
  &:hover:not(:disabled) {
    filter: contrast(200%);
    ${({ secondary, color, backgroundColor }) =>
      secondary &&
      css`
        background-color: ${color};
        color: ${backgroundColor};
      `}
  }
  &:active:not(:disabled) {
    filter: contrast(90%);
  }
  &:disabled {
    filter: grayscale(80%);
  }
`;
const ButtonContent = styled.div``;

const Button = ({
  className,
  backgroundColor,
  onClick,
  children,
  disabled,
  width,
  title,
  type,
  loading,
  borderColor,
  color,
  secondary,
}) => {
  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  if (secondary) {
    [color, backgroundColor, borderColor] = [
      backgroundColor,
      color,
      backgroundColor,
    ];
  }

  return (
    <StyledButton
      title={title}
      className={className}
      onClick={handleClick}
      color={color}
      secondary={secondary}
      backgroundColor={backgroundColor.toUpperCase()}
      borderColor={(borderColor || backgroundColor).toUpperCase()}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          handleClick();
        }
      }}
      disabled={disabled || loading}
      width={width}
      type={type}
    >
      <ButtonContent>{loading ? <Loading /> : children}</ButtonContent>
    </StyledButton>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  backgroundColor: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  width: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
  borderColor: PropTypes.string,
  color: PropTypes.string,
  secondary: PropTypes.bool,
};
Button.defaultProps = {
  className: "",
  backgroundColor: "#42368E",
  onClick: () => {},
  disabled: false,
  width: "auto",
  title: "",
  type: "button",
  loading: false,
  color: "white",
  secondary: false,
};

export default Button;
