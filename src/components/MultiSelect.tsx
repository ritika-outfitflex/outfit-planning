
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder,
  className
}) => {
  const handleToggle = (option: string) => {
    const newSelected = selected.includes(option)
      ? selected.filter(v => v !== option)
      : [...selected, option];
    onChange(newSelected);
  };

  return (
    <div className={className}>
      {placeholder && selected.length === 0 && (
        <p className="text-sm text-muted-foreground mb-2">{placeholder}</p>
      )}
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={option}
              checked={selected.includes(option)}
              onCheckedChange={() => handleToggle(option)}
            />
            <label
              htmlFor={option}
              className="text-sm cursor-pointer"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiSelect;