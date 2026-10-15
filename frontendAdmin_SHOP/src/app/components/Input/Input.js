import React, { useEffect } from "react";
import { useController } from "react-hook-form";
import PropTypes from "prop-types";
import { withErrorBoundary } from "react-error-boundary";
import { debounce } from "lodash";
import ErrorComponent from "../Commom/ErrorComponent";
const Input = (props) => {
  const {
    control,
    name,
    type = "text",
    error = "",
    placeholder = "",
    children,
    className,
    kind = "",
    cssEye = "",
    onChange = () => {},
    ...rest
  } = props;

  const { field } = useController({
    control,
    name,
    defaultValue: "",
    mode: "onChange",
  });

  // Hàm handleChange chỉ gọi prop onChange nếu nó tồn tại
  const handleChange = (event) => {
    field.onChange(event.target.value);
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <div>
      <div className="relative">
        <input
          type={type}
          id={name}
          className={`py-3 px-4 w-full border font-medium  rounded-md  outline-none  ${className}   ${
            error ? "border-error " : "border-[#D0D1D3]  "
          } ${
            children && kind === "eye"
              ? "pr-16"
              : children && kind === "search"
              ? "pl-12"
              : ""
          } dark:bg-darkSecondary`}
          placeholder={error.length > 0 ? "" : placeholder}
          {...rest}
          {...field}
          onChange={handleChange}
        />

        {children && kind === "eye" && (
          <span
            className={`absolute top-2/4 right-6 -translate-y-3/4   select-none cursor-pointer ${cssEye}`}
          >
            {children}
          </span>
        )}

        {kind === "search" && children && (
          <span className="absolute top-2/4 left-4 -translate-y-2/4 select-none cursor-pointer ">
            {children}
          </span>
        )}
      </div>

      {error.length > 0 && (
        <span className=" block mt-4 text-[14px] font-medium text-error top-2/4 left-6 -translate-y-2/4 pointer-events-none  ">
          {error}
        </span>
      )}
    </div>
  );
};

Input.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  error: PropTypes.string,
  control: PropTypes.any.isRequired,
};
export default withErrorBoundary(Input, {
  FallbackComponent: ErrorComponent,
});
