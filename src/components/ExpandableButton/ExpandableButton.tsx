import { useState, ReactNode, useMemo } from "react";
import "./ExpandableButton.scss";
import clsx from "clsx";

interface IExpandableButtonProps {
  onClick: () => void;
  icon: ReactNode;
  expandedText: string;
  className?: string;
}

interface IButtonFocus {
  hover: boolean;
  focus: boolean;
}

export const ExpandableButton = ({
  onClick,
  icon,
  expandedText,
  className,
}: IExpandableButtonProps) => {
  const [isFocused, setIsFocused] = useState<IButtonFocus>({
    hover: false,
    focus: false,
  });

  const showContent = useMemo(
    () => isFocused.hover || isFocused.focus,
    [isFocused]
  );

  return (
    <button
      className={clsx(className, "expandable-button")}
      onClick={onClick}
      onMouseEnter={() =>
        setIsFocused((prev: IButtonFocus) => ({ ...prev, hover: true }))
      }
      onFocus={() =>
        setIsFocused((prev: IButtonFocus) => ({ ...prev, focus: true }))
      }
      onMouseLeave={() =>
        setIsFocused((prev: IButtonFocus) => ({ ...prev, hover: false }))
      }
      onBlur={() =>
        setIsFocused((prev: IButtonFocus) => ({ ...prev, focus: false }))
      }
    >
      {icon}
      {showContent && <div>{expandedText}</div>}
    </button>
  );
};
