import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import ToolbarPlugin from "./plugins/toolbar"
import { ParagraphNode, TextNode, $getRoot } from "lexical"
import { HeadingNode } from "@lexical/rich-text"
import theme from "./theme"
import "./editor.css"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useMemo } from "react"

export const Editor = ({
  onBlur,
  state,
}: {
  onBlur: (content: string) => void
  state: Nullable<string>
}) => {
  const config = useMemo(() => {
    return {
      namespace: "Editor",
      nodes: [ParagraphNode, TextNode, HeadingNode],
      theme: {
        ...theme,
      },
      editorState: state ? state : null,
      onError(error: Error) {
        throw error
      },
    }
  }, [])
  console.log("STATE", state)
  return (
    <LexicalComposer initialConfig={config}>
      <ToolbarPlugin />
      <RichTextPlugin
        contentEditable={<EditableContent onBlur={onBlur} />}
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  )
}

const EditableContent = ({ onBlur }: { onBlur: (content: string) => void }) => {
  const [editor] = useLexicalComposerContext()
  return (
    <ContentEditable
      onBlur={() => {
        const editorState = editor.getEditorState()
        let isEmpty = true
        editorState.read(() => {
          const text = $getRoot().getTextContent().trim()
          isEmpty = text.length === 0
        })
        if (isEmpty) return
        onBlur(JSON.stringify(editorState))
      }}
      tabIndex={0}
      className="editor-input border-main-light min-h-30 rounded-b-lg border-x border-b p-4 outline-none"
      // aria-placeholder={"test"}
      // placeholder={
      //   <div className="editor-placeholder">test here</div>
      // }
    />
  )
}
