import { Button } from "@/shared/ui/buttons/main-button"

export const ActionsButton = ({
  onSave,
  onCancel,
}: {
  onSave: () => void
  onCancel: () => void
}) => {
  return (
    <div className="flex items-center space-x-2 text-white">
      <Button
        onClick={onCancel}
        className="w-24 justify-center text-center text-[12px]"
      >
        Cancel
      </Button>
      <Button
        onClick={onSave}
        intent={"filled"}
        className="w-24 justify-center p-[1px] text-center text-[12px]"
      >
        Save
      </Button>
    </div>
  )
}
