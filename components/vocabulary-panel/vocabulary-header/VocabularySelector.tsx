import { Topic } from "@/lib/database/models/user.model";
import { useState } from "react";
import { Check, ChevronsUpDown, PencilIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";

interface Props {
  currentTopic: Topic;
  topics: Topic[];
  setEditor: (v: boolean) => void;
}

export const VocabularySelector = ({
  currentTopic,
  topics,
  setEditor,
}: Props) => {

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Topic>(currentTopic);

  const onEdit = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    setOpen(false);
    setEditor(true);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>

        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-60 justify-between pr-1 pl-2"
        >
          {selected.name}

          <TooltipWrapper text="create new vocabulary">
            <PlusIcon
              className="w-6 h-6 bg-primary rounded-sm text-background ml-4"
            // onClick={() => setOpen(true)}
            />
          </TooltipWrapper>
        </Button>

      </PopoverTrigger>
      <PopoverContent className="w-60 p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No vocabulary found</CommandEmpty>
          <CommandGroup>
            {topics.map((topic) => (
              <CommandItem
                key={123}
                value={selected.name}
                onSelect={(currentValue) => {
                  setSelected(topic);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selected.id === topic.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {selected.name}

                <PencilIcon className='h-4 ml-auto' onClick={onEdit} />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover >
  );
};
