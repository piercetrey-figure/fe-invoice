import styled from "styled-components";
import PropTypes from "prop-types";
import { Colors } from "consts";
import { useFormContext } from "react-hook-form";
import { FunctionComponent, SelectHTMLAttributes } from "react";

const Container = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
`;
const Group = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  flex-basis: 100%;
`;
const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;
const StyledSelect = styled.select<SelectHTMLAttributes<HTMLSelectElement> & { type?: string }>`
  width: 100%;
  padding: 11px 18px;
  border-radius: 4px;
  margin: 0;
  border: 1px solid ${Colors.DARK};
  font-size: 1.4rem;
  flex-grow: ${({ type }) => (type === "radio" ? "initial" : "1")};
  font-weight: bold;
  background: ${Colors.LIGHT};
  cursor: pointer;
  color: ${Colors.DARK};
  &:focus,
  &:focus-visible,
  &:active {
    outline-color: ${Colors.DARK};
  }
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
`;
const DropdownIcon = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 18px;
  color: ${Colors.TEXT};
  pointer-events: none;
  cursor: pointer;
  font-size: 1.8rem;
  text-align: middle;
  font-weight: bold;
`;
const Label = styled.label`
  margin-bottom: 16px;
  font-weight: bold;
  display: inline-block;
  position: absolute;
  left: 0;
  top: -2rem;
  color: #333333;
`;


type DropdownOption = string | DetailedDropdownOption

interface DetailedDropdownOption {
  display: string,
  key: string,
  value: string,
}

function parseOption(value: DropdownOption): DetailedDropdownOption {
  if (typeof value === 'string') {
    return {
      display: value,
      key: value,
      value,
    }
  }
  return value
}

export interface DropdownProps {
  className?: string,
  label?: string,
  options: DropdownOption[],
  name: string,
  onChange?: (value: any) => any,
  disabled?: boolean,
  required?: boolean | string,
}

const Dropdown: FunctionComponent<DropdownProps> = ({
  className,
  label,
  options,
  name,
  onChange,
  disabled,
  required,
}) => {
  const renderOptions = () =>
    options.map(parseOption).map((option, index) => (
      <option key={option.key} value={option.value} disabled={index === 0}>
        {option.display}
      </option>
    ));

  const { register } = useFormContext();

  return (
    <Container className={`${className}`}>
      <Group>
        <SelectContainer className="inputContainer">
          {label && <Label htmlFor={name}>{label}</Label>}
          <StyledSelect
            {...register(name, { required })}
            onChange={({ target }) => onChange && onChange(target.value)}
            disabled={disabled}
          >
            {renderOptions()}
          </StyledSelect>
          <DropdownIcon>^</DropdownIcon>
        </SelectContainer>
      </Group>
    </Container>
  );
};

Dropdown.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};
Dropdown.defaultProps = {
  className: "",
  label: "",
  disabled: false,
  onChange: () => {},
  required: false,
};

export default Dropdown;
