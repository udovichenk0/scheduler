import { Icon } from "@/shared/ui/icon"

export const TogglePasswordButton = ({
  isPasswordVisible,
  togglePasswordVisibility,
}: {
  isPasswordVisible: boolean,
  togglePasswordVisibility: (isPasswordShown: boolean) => void }) => {
  return (
    <div onClick={() => togglePasswordVisibility(!isPasswordVisible)} className="hover:stroke-white stroke-grey cursor-pointer">
      {isPasswordVisible ? <Icon name="common/eye-closed"/> : <Icon name="common/eye-opened"/>}
    </div>
  )
}