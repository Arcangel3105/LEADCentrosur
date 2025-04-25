import { useEffect, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
  options: string[];
  label: string;
  placeholder: string;
  selectedValues: string[];
  onSelectionChange: (selected: string[]) => void;
}

export function MultiSelect({
  options,
  label,
  placeholder,
  selectedValues,
  onSelectionChange,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Update select all checkbox when selections change
  useEffect(() => {
    setSelectAll(selectedValues.length === options.length);
  }, [selectedValues, options.length]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref]);

  const toggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      onSelectionChange(selectedValues.filter((item) => item !== option));
    } else {
      onSelectionChange([...selectedValues, option]);
    }
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      onSelectionChange([...options]);
    } else {
      onSelectionChange([]);
    }
  };

  const removeOption = (option: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectionChange(selectedValues.filter((item) => item !== option));
  };

  return (
    <div className="relative" ref={ref}>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div
        className={cn(
          "relative w-full cursor-pointer",
          isOpen && "ring-2 ring-primary rounded-md"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className={cn(
            "flex flex-wrap min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            isOpen && "border-primary"
          )}
        >
          {selectedValues.length === 0 && (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <div className="flex flex-wrap gap-1 mt-1">
            {selectedValues.map((value) => (
              <span
                key={value}
                className="multiselect-chip"
              >
                {value}
                <button
                  type="button"
                  onClick={(e) => removeOption(value, e)}
                  className="ml-1 focus:outline-none hover:text-red-500"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="absolute right-3 top-3 pointer-events-none">
            <ChevronDownIcon className="h-4 w-4" />
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-sm ring-1 ring-black ring-opacity-5 multiselect-options">
          <div className="p-2 border-b">
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`select-all-${label}`}
                checked={selectAll}
                onChange={toggleSelectAll}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label
                htmlFor={`select-all-${label}`}
                className="ml-2 block text-sm text-gray-700"
              >
                Select All
              </label>
            </div>
          </div>
          {options.map((option) => (
            <div
              key={option}
              className="flex items-center px-2 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => toggleOption(option)}
            >
              <div className="h-4 w-4 flex items-center justify-center border rounded border-gray-300 mr-2">
                {selectedValues.includes(option) && (
                  <CheckIcon className="h-3 w-3 text-primary" />
                )}
              </div>
              <span className="text-sm">{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
