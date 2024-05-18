import { setDocxContent } from "@/redux/features/discriptiveTem/docxTemSlice"
import { useAppDispatch } from "@/redux/hook"
import { useCurrentEditor } from "@tiptap/react"

const MenuBar = () => {
    const { editor } = useCurrentEditor()
    const dispatch = useAppDispatch()

    if (!editor) {
        return null
    }

    editor.on('update', ({ editor }) => {
        console.log(editor.getHTML());
        dispatch(setDocxContent(editor.getHTML()))
    })


    return (
        <div className="flex gap-2 mb-4">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={
                    !editor.can()
                        .chain()
                        .focus()
                        .toggleBold()
                        .run()
                }
                className={`flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1${editor.isActive('bold') ? 'bg-red-900 text-black' : ''}`}
            >
                bold
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={
                    !editor.can()
                        .chain()
                        .focus()
                        .toggleItalic()
                        .run()
                }
                className={`flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1 ${editor.isActive('italic') ? 'is-active' : ''}`}
            >
                italic
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={
                    !editor.can()
                        .chain()
                        .focus()
                        .toggleStrike()
                        .run()
                }
                className={`flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1${editor.isActive('strike') ? 'is-active' : ''}`}
            >
                strike
            </button>


            <button
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={`flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1${editor.isActive('paragraph') ? 'is-active' : ''}`}
            >
                paragraph
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1${editor.isActive('heading', { level: 1 }) ? 'text-white' : ''}`}
            >
                h1
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
            >
                h2
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1${editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}`}
            >
                h3
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                className={`flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1${editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}`}
            >
                h4
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                className={`flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1${editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}`}
            >
                h5
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                className={`flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1${editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}`}
            >
                h6
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1${editor.isActive('bulletList') ? 'is-active' : ''}`}
            >
                bullet list
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1${editor.isActive('orderedList') ? 'is-active' : ''}`}
            >
                ordered list
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1${editor.isActive('codeBlock') ? 'is-active' : ''}`}
            >
                code block
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1${editor.isActive('blockquote') ? 'is-active' : ''}`}
            >
                blockquote
            </button>
            <button className="flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                horizontal rule
            </button>
            <button className="flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1" onClick={() => editor.chain().focus().setHardBreak().run()}>
                hard break
            </button>
            <button className="flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={
                    !editor.can()
                        .chain()
                        .focus()
                        .undo()
                        .run()
                }
            >
                undo
            </button>
            <button
                className='flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1'
                onClick={() => editor.chain().focus().redo().run()}
                disabled={
                    !editor.can()
                        .chain()
                        .focus()
                        .redo()
                        .run()
                }
            >
                redo
            </button>
        </div>
    )
}

export default MenuBar;