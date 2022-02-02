import styled from "styled-components";
import PropTypes from "prop-types";
import { Colors } from "consts";
import { useFormContext, useFormState } from "react-hook-form";
import { InputError } from "Components/Form";

const InputContainer = styled.div`
  position: relative;
  flex-basis: ${({ width }) => width};
  display: flex;
`;
const StyledInput = styled.input`
  padding: 4px 10px;
  height: 30px;
  width: 100%;
  box-sizing: content-box;
  border-radius: 4px;
  margin-bottom: 10px;
  border: 1px solid ${Colors.DARK};
`;
const Label = styled.label`
  font-size: 1rem;
  font-weight: 700;
  position: absolute;
  top: -2rem;
  left: 0;
`;

const Input = ({
  className,
  label,
  value,
  onChange,
  placeholder,
  width,
  disabled,
  style,
  type,
  name,
  required,
  registerConfig,
}) => {
  const { register, control } = useFormContext();
  const {
    errors: { [name]: error },
  } = useFormState({ control });

  return (
    <>
      <InputContainer width={width} className={`${className} inputContainer`}>
        {label && <Label>{label}</Label>}
        <StyledInput
          placeholder={placeholder}
          onChange={({ target }) => onChange(target.value)}
          disabled={disabled}
          style={style}
          type={type}
          {...register(name, { required, ...registerConfig })}
        />
      </InputContainer>
      {error && <InputError>{error}</InputError>}
    </>
  );
};

Input.propTypes = {
  className: PropTypes.string,
  width: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  style: PropTypes.any,
  type: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  registerConfig: PropTypes.any,
};
Input.defaultProps = {
  className: "",
  width: "100%",
  label: "",
  value: "",
  onChange: () => {},
  placeholder: "Enter Value",
  style: {},
  type: "text",
  required: false,
  registerConfig: {},
};

export default Input;
