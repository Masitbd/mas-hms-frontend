
"use client";

import Color from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import {
  EditorContent,
  useEditor
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import MenuBar from "../testReport/TestView/MenuBar";



const Tiptap = (props: { data: any; setData: any }) => {
  const [data, setData] = useState(props.data);
  console.log(data)
  // const modifiedData = JSON.parse(JSON.stringify(data));


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
  const editor = useEditor({

    extensions: extensions,
    content: data,
    parseOptions: {
      preserveWhitespace: 'full'
    },
    onUpdate: async ({ editor }) => {
      const html = editor?.getHTML()
      props.setData(html);
    },
  });

  // const replaceSpacesWithNbsp = (html: string) => {
  //   // Replace multiple spaces with non-breaking spaces
  //   return html.replace(/ {2,}/g, (match) => match.replace(/ /g, '&nbsp;'));
  // };

  useEffect(() => {
    setData(props.data);
    if (editor) {
      editor.commands.setContent(data, false, { preserveWhitespace: "full" })
    }
  }, [data, editor, props.data]);

  return (
    <div className="border-stone-200 border-4 p-2">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
      />
    </div>
  );
};

export default Tiptap;
