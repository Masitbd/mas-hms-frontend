import { setDocxContent } from "@/redux/features/discriptiveTem/docxTemSlice"
import { useAppDispatch } from "@/redux/hook"
import { useCurrentEditor } from "@tiptap/react"
import './TestViewD.css'
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
        <div className="flex gap-2 mb-4 ml-6">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={
                    !editor.can()
                        .chain()
                        .focus()
                        .toggleBold()
                        .run()
                }
                className={`flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1${editor.isActive('bold') ? 'is-active' : ''}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bold"><path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" /></svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-italic"><line x1="19" x2="10" y1="4" y2="4" /><line x1="14" x2="5" y1="20" y2="20" /><line x1="15" x2="9" y1="4" y2="20" /></svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-strikethrough"><path d="M16 4H9a3 3 0 0 0-2.83 4" /><path d="M14 12a4 4 0 0 1 0 8H6" /><line x1="4" x2="20" y1="12" y2="12" /></svg>
            </button>


            <button
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={`flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1${editor.isActive('paragraph') ? 'is-active' : ''}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pilcrow"><path d="M13 4v16" /><path d="M17 4v16" /><path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13" /></svg>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1${editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heading-1"><path d="M4 12h8" /><path d="M4 18V6" /><path d="M12 18V6" /><path d="m17 12 3-2v8" /></svg>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heading-2"><path d="M4 12h8" /><path d="M4 18V6" /><path d="M12 18V6" /><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" /></svg>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1${editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heading-3"><path d="M4 12h8" /><path d="M4 18V6" /><path d="M12 18V6" /><path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2" /><path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2" /></svg>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                className={`flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1${editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heading-4"><path d="M4 12h8" /><path d="M4 18V6" /><path d="M12 18V6" /><path d="M17 10v4h4" /><path d="M21 10v8" /></svg>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1${editor.isActive('bulletList') ? 'is-active' : ''}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list"><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" /></svg>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1${editor.isActive('orderedList') ? 'is-active' : ''}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-ordered"><line x1="10" x2="21" y1="6" y2="6" /><line x1="10" x2="21" y1="12" y2="12" /><line x1="10" x2="21" y1="18" y2="18" /><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></svg>
            </button>

            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1${editor.isActive('blockquote') ? 'is-active' : ''}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-text-quote"><path d="M17 6H3" /><path d="M21 12H8" /><path d="M21 18H8" /><path d="M3 12v6" /></svg>
            </button>
            <button className="flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-separator-horizontal"><line x1="3" x2="21" y1="12" y2="12" /><polyline points="8 8 12 4 16 8" /><polyline points="16 16 12 20 8 16" /></svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-undo"><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-redo"><path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" /></svg>
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1${editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1${editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-align-center"><line x1="21" x2="3" y1="6" y2="6" /><line x1="17" x2="7" y1="12" y2="12" /><line x1="19" x2="5" y1="18" y2="18" /></svg>
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1${editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </button>

            <button onClick={() => editor.chain().focus().unsetTextAlign().run()}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eraser"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" /><path d="M22 21H7" /><path d="m5 11 9 9" /></svg></button>
        </div>
    )
}

export default MenuBar;