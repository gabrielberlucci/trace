import { Plus } from 'lucide-react';
import { Button } from './button';

interface HeaderInfoProps {
  headerName: string;
  headerParagraph: string;
  buttonText: string;
}

export const HeaderInfo = ({
  headerName,
  headerParagraph,
  buttonText,
}: HeaderInfoProps) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">{headerName}</h2>
        <p className="text-sm text-muted-foreground">{headerParagraph}</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> {buttonText}
        </Button>
      </div>
    </div>
  );
};
