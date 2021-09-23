import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Field from "react-bulma-companion/lib/Field";
import Control from "react-bulma-companion/lib/Control";
import Input from "react-bulma-companion/lib/Input";
import Icon from "react-bulma-companion/lib/Icon";
import Help from "react-bulma-companion/lib/Help";

export default function FormInput({
  className,
  onChange,
  value,
  placeholder,
  type,
  leftIcon,
  rightIcon,
  size,
  label,
  color,
  inputIsvalid,
  helpMessage,
}) {
  return (
    <div className="form-input">
      <div className="form-input-label">{label}</div>
      <Field className={className}>
        <Control iconsLeft={!!leftIcon} iconsRight={!!rightIcon}>
          <Input
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            value={value}
            size={size}
            color={color}
          />
          {leftIcon && (
            <Icon size="small" align="left">
              <FontAwesomeIcon icon={leftIcon} />
            </Icon>
          )}
          {value && rightIcon && (
            <Icon
              size="small"
              align="right"
              color={inputIsvalid ? "success" : "danger"}
            >
              <FontAwesomeIcon icon={rightIcon} />
            </Icon>
          )}
        </Control>
        {value && (
          <Help color={inputIsvalid ? "success" : "danger"}>{helpMessage}</Help>
        )}
      </Field>
    </div>
  );
}

FormInput.defaultProps = {
  className: "",
  leftIcon: undefined,
  rightIcon: undefined,
  type: "text",
  size: "medium",
  label: "",
  color: undefined,
  inputIsvalid: true,
  helpMessage: "",
};

FormInput.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  leftIcon: PropTypes.object,
  rightIcon: PropTypes.object,
  type: PropTypes.string,
  size: PropTypes.string,
  label: PropTypes.string,
  color: PropTypes.string,
  inputIsvalid: PropTypes.bool,
  helpMessage: PropTypes.string,
};
