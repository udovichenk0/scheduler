import { Icon } from "@/shared/ui/icon"
import { Popover } from "@/shared/ui/disclosure/popover"
import { useDisclosure } from "@/shared/lib/disclosure/use-disclosure"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { mergeRegister } from "@lexical/utils"
import {
  $createParagraphNode,
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from "lexical"
import { $setBlocksType } from "@lexical/selection"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  $createHeadingNode,
  $isHeadingNode,
  HeadingTagType,
} from "@lexical/rich-text"
import { Button } from "@/shared/ui/buttons/main-button"

function Divider() {
  return <div className="bg-cBorder mx-1 w-px" />
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const toolbarRef = useRef(null)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [activeBlockType, setActiveBlockType] = useState<BlockType | null>(null)

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"))
      setIsItalic(selection.hasFormat("italic"))
      setIsUnderline(selection.hasFormat("underline"))
      setIsStrikethrough(selection.hasFormat("strikethrough"))
      const selectionHeading = (["h1", "h2", "h3", "h4"] as const).find((tag) =>
        isSelectionInHeading(tag),
      )
      setActiveBlockType(
        selectionHeading || (isSelectionInParagraph() ? "paragraph" : null),
      )
    }
  }, [])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(
          () => {
            $updateToolbar()
          },
          { editor },
        )
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar()
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
    )
  }, [editor, $updateToolbar])

  return (
    <div className="toolbar" ref={toolbarRef}>
      <HeadingPopover activeBlockType={activeBlockType} />
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
        }}
        className={"toolbar-item spaced " + (isBold ? "active" : "")}
        aria-label="Format Bold"
      >
        <Icon className="format" name="editor/bold" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
        }}
        className={"toolbar-item spaced " + (isItalic ? "active" : "")}
        aria-label="Format Italics"
      >
        <Icon className="format" name="editor/italic" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
        }}
        className={"toolbar-item spaced " + (isUnderline ? "active" : "")}
        aria-label="Format Underline"
      >
        <Icon className="format" name="editor/underline" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
        }}
        className={"toolbar-item spaced " + (isStrikethrough ? "active" : "")}
        aria-label="Format Strikethrough"
      >
        <Icon className="format" name="editor/strikethrough" />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")
        }}
        className="toolbar-item spaced"
        aria-label="Left Align"
      >
        <Icon className="format" name="editor/text-align-start" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")
        }}
        className="toolbar-item spaced"
        aria-label="Center Align"
      >
        <Icon className="format" name="editor/text-align-center" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")
        }}
        className="toolbar-item spaced"
        aria-label="Right Align"
      >
        <Icon className="format" name="editor/text-align-end" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")
        }}
        className="toolbar-item"
        aria-label="Justify Align"
      >
        <Icon className="format" name="editor/text-align-justify" />
      </button>{" "}
    </div>
  )
}

type BlockType = HeadingTagType | "paragraph"

const HEADING_OPTIONS: Array<{
  type: BlockType
  label: string
  icon:
    | "editor/text"
    | "editor/heading-1"
    | "editor/heading-2"
    | "editor/heading-3"
    | "editor/heading-4"
}> = [
  { type: "paragraph", label: "Text", icon: "editor/text" },
  { type: "h1", label: "Heading 1", icon: "editor/heading-1" },
  { type: "h2", label: "Heading 2", icon: "editor/heading-2" },
  { type: "h3", label: "Heading 3", icon: "editor/heading-3" },
  { type: "h4", label: "Heading 4", icon: "editor/heading-4" },
]

const HeadingPopover = ({
  activeBlockType,
}: {
  activeBlockType: BlockType | null
}) => {
  const [editor] = useLexicalComposerContext()

  const {
    isOpened: isFormatOpened,
    open: openFormat,
    close: closeFormat,
  } = useDisclosure({
    prefix: "task-editor/format",
  })

  const activeOption =
    HEADING_OPTIONS.find((option) => option.type === activeBlockType) ??
    HEADING_OPTIONS[0]

  return (
    <Popover
      isOpened={isFormatOpened}
      label="Text format"
      closeModal={closeFormat}
    >
      <Popover.Trigger
        className="toolbar-item spaced"
        aria-label="Text format"
        onClick={openFormat}
      >
        <Icon className="format" name={activeOption.icon} />
      </Popover.Trigger>
      <Popover.Content className="flex w-40 flex-col items-start">
        {HEADING_OPTIONS.map((option) => {
          const isActive = option.type === activeBlockType
          return (
            <Button
              size="sm"
              key={option.type}
              type="button"
              className={
                "toolbar-popover-item" + (isActive ? " is-active" : "")
              }
              onClick={() => {
                if (option.type === "paragraph") {
                  editor.update(() => {
                    const selection = $getSelection()
                    if ($isRangeSelection(selection)) {
                      $setBlocksType(selection, () => $createParagraphNode())
                    }
                  })
                } else {
                  createHeadingNode(editor, option.type)
                }
                closeFormat()
              }}
            >
              <Icon className="icon" name={option.icon} />
              <span className="label">{option.label}</span>
              {isActive && <Icon className="check icon" name="common/check" />}
            </Button>
          )
        })}
      </Popover.Content>
    </Popover>
  )
}

function createHeadingNode(editor: LexicalEditor, headingNode: HeadingTagType) {
  editor.update(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      $setBlocksType(selection, () => $createHeadingNode(headingNode))
    }
  })
}

function getSelectionParent() {
  const selection = $getSelection()
  if (!$isRangeSelection(selection)) return null
  const anchorNode = selection.anchor.getNode()
  return anchorNode.getTopLevelElement()
}

function isSelectionInHeading(tag?: HeadingTagType): boolean {
  const parentElement = getSelectionParent()
  if (!$isHeadingNode(parentElement)) return false
  return tag ? parentElement.getTag() === tag : true
}

function isSelectionInParagraph(): boolean {
  return $isParagraphNode(getSelectionParent())
}
