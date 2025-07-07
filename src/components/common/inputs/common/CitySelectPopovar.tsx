"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

type Item = {
  label: string;
  value: string;
};

interface CitySelectPopoverProps {
  value: string;
  onChange: (value: string) => void;
  items: Item[];
  placeholder?: string;
}

const CitySelectPopover: React.FC<CitySelectPopoverProps> = ({
  value,
  onChange,
  items,
  placeholder = "استان یا شهر را انتخاب کنید",
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          className="rtl rounded-[16px] border text-subText bg-transparent w-full px-4 py-5 border-subText dark:group-hover:text-white dark:group-hover:border-white outline-none"
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 border">
        <Command>
          <CommandInput placeholder="جستجو..." />
          <CommandList>
            <CommandEmpty>یافت نشد</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CitySelectPopover;
