import { InfoIcon, Trash2, Pencil, ImageIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Alert, AlertTitle } from './ui/alert'

type ContentBoxProps = {
  id: number
  text: string
  onDelete?: (id: number) => void
  onEdit?: (id: number) => void
  onImages?: (id: number) => void
}

const ContentBox: React.FC<ContentBoxProps> = ({
  id,
  text,
  onDelete,
  onEdit,
  onImages,
}) => {
  return (
    <Alert className="flex items-center gap-3 border-gray-500 h-14 shadow-lg">
      <InfoIcon className="h-4 w-4" />

      <AlertTitle className="flex-1 text-base font-bold">
        {text}
      </AlertTitle>

      <div className="flex gap-2">
        {onImages && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => onImages(id)}
            className='cursor-pointer'
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        )}

        {onEdit && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(id)}
            className='cursor-pointer'
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}

        {onDelete && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(id)}
            className='cursor-pointer'
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Alert>
  )
}

export default ContentBox
