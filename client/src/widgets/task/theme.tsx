import { EditorThemeClasses } from "lexical"

const config: EditorThemeClasses = {
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5",
  },
  paragraph: "editor-paragraph",
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    underline: "editor-text-underline",
    strikethrough: "editor-text-strikethrough",
    underlineStrikethrough: "editor-text-underlineStrikethrough",
  },
  list: {
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listitem",
    nested: {
      listitem: "editor-nested-listitem",
    },
  },
}

export default config
