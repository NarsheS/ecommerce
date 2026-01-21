import { InfoIcon, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

type ContentBoxProps = {
  id: number;
  text: string;
  onDelete?: (id: number) => Promise<any>
}

const ContentBox: React.FC<ContentBoxProps> = ({ id, text, onDelete }) => {
  return (
    <Alert className="flex items-center gap-3 border-gray-500 h-14 shadow-lg">
      <InfoIcon className="h-4 w-4" />

      <AlertTitle className="flex-1 text-base font-bold">
        {text}
      </AlertTitle>

      <Button
        variant="destructive"
        size="icon"
        onClick={() => onDelete?.(id)}
        className="cursor-pointer"
      >
        <Trash2 className="h-4 w-2" />
      </Button>
    </Alert>

  )
}

export default ContentBox