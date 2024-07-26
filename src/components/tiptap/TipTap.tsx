"use client";

import Color from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import {
  useEditor,
  EditorContent,
  EditorProvider,
  Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "../testReport/TestView/MenuBar";

const Tiptap = (props: { data: any; setData: any }) => {
  const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] } as any),
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: false,
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false,
      },
      heading: {
        levels: [1, 2, 3, 4, 5, 6],
      },
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
  ];
  // const editor = useEditor({
  //   extensions: extensions,
  //   onUpdate: () => {
  //     props.setData && props.setData(editor?.getHTML());
  //   },
  // });

  return (
    <div className="border-stone-200 border-4 p-2">
      <EditorProvider
        slotBefore={<MenuBar />}
        extensions={extensions}
        content={props.data}
        onUpdate={(eidtor) => {
          props.setData && props.setData(eidtor.editor.getHTML());
        }}
      ></EditorProvider>
    </div>
  );
};

export default Tiptap;
