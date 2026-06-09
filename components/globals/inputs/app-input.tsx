"use client"
import { BodyText } from "../typography/body-text"
import { cn } from "@/lib/utils"
import { useEffect, useMemo, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
interface AppInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  errorMsg?: string;
}

interface AppTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: boolean;
  errorMsg?: string;
}

interface AppSearchableSelectProps {
  label?: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  value?: string | null;
  defaultValue?: string | null;
  onChange: (e: { target: { name: string; value: string | null } }) => void;
  name: string;
  error?: boolean;
  errorMsg?: string;
}
interface AppSelectInputProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label?: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  error?: boolean;
  errorMsg?: string;
  onChange?: (e: { target: { name: string; value: string } }) => void;
}

interface AppRadioButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}


const inputStyles = "bg-dark-5! p-4 w-full text-[14px] font-sans text-dark-100 font-medium tracking-[1px] leading-[100%] placeholder:text-dark-40 focus:outline-none focus:border-none";

export const AppInput = ({ label, className, error, errorMsg, ...props }: AppInputProps) => {
  return (
    <div className="flex flex-col gap-3 w-full">
      {label && (
        <BodyText as="label" variant="14m" className="text-dark">{label}</BodyText>
      )}
      <input
        className={cn(inputStyles, error && "border! border-red-500!", className)}
        {...props}
      />
      {error && errorMsg && (
        <span className="text-red-500 text-[12px] font-medium">{errorMsg}</span>
      )}
    </div>
  )
}

export const AppPasswordInput = ({ label, className, ...props }: AppInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <BodyText as="label" variant="14m" className="text-dark">{label}</BodyText>
      )}
      <div className="relative group/password">
        <input
          type={showPassword ? "text" : "password"}
          className={cn(
            inputStyles,
            "pr-12",
            !showPassword && "text-[20px] font-sans tracking-[2px] max-h-12.5",
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-40 hover:text-dark-100 transition-colors"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  )
}

export const AppInputTextArea = ({ label, className, error, errorMsg, ...props }: AppTextAreaProps) => {
  return (
    <div className="flex flex-col gap-3">
      {label && (
        <BodyText as="label" variant="14m" className="text-dark">{label}</BodyText>
      )}
      <textarea
        className={cn(inputStyles, "min-h-32 resize-none", error && "border! border-red-500!", className)}
        {...props}
      />
      {error && errorMsg && (
        <span className="text-red-500 text-[12px] font-medium">{errorMsg}</span>
      )}
    </div>
  )
}


export const AppSelectInput = ({ label, options, className, placeholder, error, errorMsg, ...props }: AppSelectInputProps) => {
  const { value, defaultValue, onChange, name, disabled } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string>((defaultValue as string) || "");

  // Use controlled value if provided, otherwise use internal state
  const currentValue = value !== undefined ? value : internalValue;
  const selectedOption = options.find((opt) => opt.value === currentValue);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && !(e.target as HTMLElement).closest(`.select-input-${name}`)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, name]);

  return (
    <div className={cn("flex flex-col gap-3 relative w-full", `select-input-${name}`, className)}>
      {label && <BodyText as="label" variant="14m" className="text-dark">{label}</BodyText>}
      
      {/* Hidden input for Form compatibility */}
      <input type="hidden" name={name} value={currentValue || ""} />

      <div
        className={cn(
          inputStyles,
          "flex justify-between items-center group transition-all",
          error && "border! border-red-500!",
          disabled && "opacity-50 cursor-not-allowed bg-dark-5/50 font-normal"
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={cn(!selectedOption && "text-dark-40")}>
          {selectedOption ? selectedOption.label : (placeholder || "Select option")}
        </span>
        <div className={cn("bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2014%2014%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20clip-path%3D%22url(%23clip0_269_8410)%22%3E%3Cpath%20d%3D%22M6.99944%207.68328L9.88694%204.79578L10.7118%205.62061L6.99944%209.33294L3.28711%205.62061L4.11194%204.79578L6.99944%207.68328Z%22%20fill%3D%22%23020617%22%2F%3E%3C%2Fg%3E%3Cdefs%3E%3CclipPath%20id%3D%22clip0_269_8410%22%3E%3Crect%20width%3D%2214%22%20height%3D%2214%22%20fill%3D%22white%22%2F%3E%3C%2FclipPath%3E%3C%2Fdefs%3E%3C%2Fsvg%3E')] bg-size-[14px_14px] w-3.5 h-3.5 transition-transform duration-300", isOpen && "rotate-180")} />
      </div>

      {isOpen && !disabled && options.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white border border-dark-10 z-100 shadow-xl mt-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-60 overflow-y-auto custom-scrollbar" data-lenis-prevent>
            {options.map((opt) => (
              <div
                key={opt.value}
                className={cn(
                  "px-4 py-2 hover:bg-dark-5 cursor-pointer text-[14px] text-dark-100 transition-colors flex justify-between items-center group/item border-b border-dark-5 last:border-0",
                  opt.value === currentValue && "bg-dark-5/50 font-semibold"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  if (value === undefined) {
                      setInternalValue(opt.value);
                  }
                  onChange?.({ target: { name: name ?? "", value: opt.value } });
                  setIsOpen(false);
                }}
              >
                <span className="group-hover/item:translate-x-1 transition-transform duration-200">
                  {opt.label}
                </span>
                {opt.value === currentValue && (
                  <div className="size-1.5 rounded-full bg-dark-100" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {error && errorMsg && (
        <span className="text-red-500 text-[12px] font-medium">{errorMsg}</span>
      )}
    </div>
  )
}


export const AppRadioButton = ({ label, className, ...props }: AppRadioButtonProps) => {
  return (
    <label className={cn("flex items-center gap-4 cursor-pointer group select-none", className)}>
      <div className="relative flex items-center justify-center">
        <input
          type="radio"
          className="peer sr-only"
          {...props}
        />
        {/* Outer Ring */}
        <div className="size-5 rounded-full border-2 border-dark-40 flex items-center justify-center transition-all peer-checked:border-dark-100">
          {/* Inner Dot */}
          <div className="size-2.5 rounded-full bg-dark-100 transition-all scale-0 peer-checked:scale-100" />
        </div>
      </div>
      <BodyText as="span" variant="14m" className="text-dark-100 font-sans tracking-[1px]">
        {label}
      </BodyText>
    </label>
  )
}

export const AppRadioGroup = ({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  className
}: {
  label?: string;
  options: { label: string; value: string }[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}) => {
  return (
    <div className="flex flex-col gap-3">
      {label && (
        <BodyText as="label" variant="14m" className="text-dark">{label}</BodyText>
      )}
      <RadioGroup value={value} defaultValue={defaultValue} onValueChange={onValueChange} className={cn("flex flex-row items-center gap-6", className)}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-3">
            <RadioGroupItem value={option.value} id={option.value} />
            <label htmlFor={option.value} className="cursor-pointer">
              <BodyText variant="14m" className="text-dark-100 font-sans tracking-[1px]">
                {option.label}
              </BodyText>
            </label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export const AppCheckbox = ({ label, className, children, ...props }: React.ComponentProps<typeof Checkbox> & { label?: string }) => {
  return (
    <label className={cn("flex items-center gap-3 cursor-pointer group select-none w-fit", className)}>
      <Checkbox {...props} />
      {label && (
        <BodyText as="span" variant="14r" className="text-dark-100">
          {label}
        </BodyText>
      )}
      {children && (
        <div className="flex-1">
          {children}
        </div>
      )}
    </label>
  )
}

export const AppSearchableSelect = ({ label, options, placeholder, value, defaultValue, onChange, name, error, errorMsg }: AppSearchableSelectProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string>((defaultValue as string) || "");

  const currentValue = value !== undefined ? value : internalValue;
  const filteredOptions = useMemo(
    () =>
      options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm, options]
  );

  const selectedOption = options.find((opt) => opt.value === currentValue);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && !(e.target as HTMLElement).closest(`.searchable-select-${name}`)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, name]);

  return (
    <div className={cn("flex flex-col gap-3 relative w-full", `searchable-select-${name}`)}>
      {label && <BodyText as="label" variant="14m" className="text-dark">{label}</BodyText>}
      
      {/* Hidden input for Form compatibility */}
      <input type="hidden" name={name} value={currentValue || ""} />

      <div
        className={cn(inputStyles, "flex justify-between items-center group transition-all", error && "border! border-red-500!")}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={cn(!selectedOption && "text-dark-40")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className={cn("bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2014%2014%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20clip-path%3D%22url(%23clip0_269_8410)%22%3E%3Cpath%20d%3D%22M6.99944%207.68328L9.88694%204.79578L10.7118%205.62061L6.99944%209.33294L3.28711%205.62061L4.11194%204.79578L6.99944%207.68328Z%22%20fill%3D%22%23020617%22%2F%3E%3C%2Fg%3E%3Cdefs%3E%3CclipPath%20id%3D%22clip0_269_8410%22%3E%3Crect%20width%3D%2214%22%20height%3D%2214%22%20fill%3D%22white%22%2F%3E%3C%2FclipPath%3E%3C%2Fdefs%3E%3C%2Fsvg%3E')] bg-size-[14px_14px] w-3.5 h-3.5 transition-transform duration-300", isOpen && "rotate-180")} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border border-dark-10 z-100 shadow-xl mt-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 border-b border-dark-10 bg-dark-5/30">
            <input
              autoFocus
              type="text"
              className="w-full p-2.5 bg-white border border-dark-10 focus:outline-none text-[14px] placeholder:text-dark-40"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-60 overflow-y-auto custom-scrollbar" data-lenis-prevent>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  className={cn(
                    "px-4 py-2 hover:bg-dark-5 cursor-pointer text-[14px] text-dark-100 transition-colors flex justify-between items-center group/item border-b border-dark-5 last:border-0",
                    opt.value === currentValue && "bg-dark-5/50 font-semibold"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (value === undefined) {
                        setInternalValue(opt.value);
                    }
                    onChange?.({ target: { name, value: opt.value } });
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  <span className="group-hover/item:translate-x-1 transition-transform duration-200">
                    {opt.label}
                  </span>
                  {opt.value === currentValue && (
                    <div className="size-1.5 rounded-full bg-dark-100" />
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 text-dark-40 text-[14px] text-center italic">No results found</div>
            )}
          </div>
        </div>
      )}
      {error && errorMsg && (
        <span className="text-red-500 text-[12px] font-medium">{errorMsg}</span>
      )}
    </div>
  );
}

export default AppInput;