import { onMount } from "./on-mount"

export const useDocumentTitle = (title: string) => {
  onMount(() => document.title = title)
    
}
