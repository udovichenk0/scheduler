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
      className="stroke-cFont cursor-pointer"
    >
      {isPasswordVisible ? (
        <Icon name="common/eye-opened" />
      ) : (
        <Icon name="common/eye-closed" />
      )}
    </div>
  )
}
