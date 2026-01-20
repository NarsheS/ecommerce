import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";

type ContentBoxProps = {
  id: number;
  text: string;
  onDelete?: (id: number) => Promise<any>
}

const ContentBox: React.FC<ContentBoxProps> = ({ id, text, onDelete }) => {
  return (
    <div className="flex items-center justify-between py-2 px-4 text-sm border border-black rounded bg-white text-black">
            <p className="flex-1 mr-4">{text}</p>
            <Button className="ml-2 cursor-pointer" variant="destructive" onClick={() => onDelete?.(id)}><Trash2 /></Button>
    </div>
  )
}

export default ContentBox