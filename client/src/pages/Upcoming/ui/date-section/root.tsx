import { PropsWithChildren } from "react";

import { Header } from "./header";
import { Content } from "./content";

export const SectionRoot = ({children}: PropsWithChildren) => {
  return <>{children}</>
}

SectionRoot.Header = Header
SectionRoot.Content = Content