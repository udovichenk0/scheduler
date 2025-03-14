import { Icon } from "@/shared/ui/icon"

export const TogglePasswordButton = ({
  isPasswordVisible,
  togglePasswordVisibility,
}: {
  isPasswordVisible: boolean
  togglePasswordVisibility: (isPasswordShown: boolean) => void
}) => {
  return (
    <div
      onClick={() => togglePasswordVisibility(!isPasswordVisible)}
      className="cursor-pointer stroke-cFont"
    >
      {isPasswordVisible ? (
        <Icon name="common/eye-opened" />
      ) : (
        <Icon name="common/eye-closed" />
      )}
    </div>
  )
}
