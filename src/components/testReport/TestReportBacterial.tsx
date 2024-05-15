import { IBacteria } from '@/app/(withlayout)/bacteria/page';
import { useGetBacteriaQuery } from '@/redux/api/bacteria/bacteriaSlice';
import { useGetConditionQuery } from '@/redux/api/condition/conditionSlice';
import { useGetSingleTestQuery } from '@/redux/api/test/testSlice';
import { usePostTestReportMutation } from '@/redux/api/testReport/testReportSlice';
import { useAppSelector } from '@/redux/hook';
import { ICondition } from '@/types/allDepartmentInterfaces';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import mammoth from 'mammoth';
import { useRef, useState } from 'react';
import { Button, Form, Schema, SelectPicker, Table, TagPicker, Toggle } from 'rsuite';
import RModal from '../ui/Modal';
import FileUpload from './FileUpload';
import { ITestReportForm } from './TestReportForm';
import TestSensitivity from './TestSensitivity';
const { Column, HeaderCell, Cell } = Table;


const MenuBar = () => {
    const { editor } = useCurrentEditor()

    if (!editor) {
        return null
    }



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
                className={`flex gap-2 border-gray-500 border items-center rounded-lg px-2 py-1${editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}`}
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
                className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
            >
                h3
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
            >
                h4
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
            >
                h5
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
            >
                h6
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'is-active' : ''}
            >
                bullet list
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'is-active' : ''}
            >
                ordered list
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={editor.isActive('codeBlock') ? 'is-active' : ''}
            >
                code block
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive('blockquote') ? 'is-active' : ''}
            >
                blockquote
            </button>
            <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                horizontal rule
            </button>
            <button onClick={() => editor.chain().focus().setHardBreak().run()}>
                hard break
            </button>
            <button
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
            <button
                onClick={() => editor.chain().focus().setColor('#958DF1').run()}
                className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
            >
                purple
            </button>
        </div>
    )
}

type microbiology = {
    _id: string;
    duration: string;
    temperatures: string;
    conditions: ICondition[];
    growth: boolean;
    colonyCount?: {
        thenType: string;
        powerType: string;
    };
    bacteria?: IBacteria[];
    sensitivityOptions?: ISensitivityData;
}
export type ISensitivityData = {
    id: string;
    name: string;
    A: string;
    B: string;
    C: string;

}[];

const TestReportBacterial = ({ reportGenerate, setReportGenerate, setReportGenerateModal }: ITestReportForm) => {
    const sensitivityStatusData = [
        {
            id: '1',
            name: 'AMOXYCILLIN',
            A: "",
            B: "",
            C: "",
        },
        {
            id: '2',
            name: 'AUGMENISSTIN',
            A: "",
            B: "",
            C: "",
        },
        {
            id: '3',
            name: 'Carbenicillin',
            A: "",
            B: "",
            C: "",
        },
        {
            id: '4',
            name: 'CEFOTAXIME',
            A: "",
            B: "",
            C: "",
        },
        {
            id: '5',
            name: 'CEFTRIAXONE',
            A: "",
            B: "",
            C: "",
        },
        {
            id: '6',
            name: 'CEPMALEXIN',
            A: "",
            B: "",
            C: "",
        },
        {
            id: '7',
            name: 'CLOXACILLIN',
            A: "",
            B: "",
            C: "",
        },
        {
            id: '8',
            name: 'DOXYCYCLINE',
            A: "",
            B: "",
            C: "",
        },
    ];
    const [sensitivityData, setSensitivityData] = useState<ISensitivityData>(sensitivityStatusData);
    const { StringType, NumberType } = Schema.Types;
    const [growth, setGrowth] = useState<boolean>(false)
    const [microbiology, setMicrobiology] = useState<microbiology>({
        _id: "",
        duration: "",
        temperatures: "",
        conditions: [],
        growth: growth,
        colonyCount: {
            thenType: "",
            powerType: ""
        },
        bacteria: [],
        sensitivityOptions: []
    })

    console.log(microbiology)

    const { data: testQueryData } = useGetSingleTestQuery(reportGenerate.id);
    // const { data: sensitivityData } = useGetSensitivityQuery(undefined);
    const { data: conditionData } = useGetConditionQuery(undefined);
    const { data: bacteriaData } = useGetBacteriaQuery(undefined);
    console.log(testQueryData)
    const formRef: React.MutableRefObject<any> = useRef();
    const model = Schema.Model({
        duration: StringType().isRequired("This field is required."),
        temperatures: StringType().isRequired("This field is required."),
        condition: StringType().isRequired("This field is required."),
    });
    const [
        postTestReport
    ] = usePostTestReportMutation(); // post create a reportTest
    const id = useAppSelector((state: { id: { id: string; }; }) => state.id.id);
    console.log(reportGenerate.modeSingleType)
    const handleSubmit = async () => {

        const testId = reportGenerate.id;
        const type = reportGenerate.modeSingleType;
        const orderId = id;
        microbiology._id = testQueryData?.data?.resultFields[0]._id;

        const finalDataForSendBakcend = {
            testId,
            orderId,
            type,
            data: microbiology
        }
        console.log(finalDataForSendBakcend);
        const results = await postTestReport(finalDataForSendBakcend);
        console.log(results)
        // if ('data' in result) {
        //     const message = (result as { data: { message: string } })?.data.message;
        //     swal(`Done! ${message}!`, {
        //         icon: "success",
        //     })

        // }

    }
    const durationType = [
        {
            label: "48 hours",
            value: "48 hours",
        },
        {
            label: "72 hours",
            value: "72 hours",
        },
        {
            label: "7 days",
            value: "7 days",
        },
        {
            label: "14 days",
            value: "14 days",
        },
        {
            label: "45 days",
            value: "45 days",
        },
    ];
    const temparatureType = [
        {
            label: `25' C`,
            value: `25' C`,
        },
        {
            label: `37' C`,
            value: `37' C`,
        },
        {
            label: `42' C`,
            value: `42' C`,
        },

    ];
    const thenType = [
        {
            label: `>`,
            value: `>`,
        },
        {
            label: `<`,
            value: `<`,
        },

    ];
    const options = Array.from({ length: 10 }, (_, i) => ({ value: `${i + 1}`, label: `${i + 1}` }));

    const [sensitivityModal, setSensitivityModal] = useState<boolean>(false);

    microbiology.sensitivityOptions = sensitivityData

    console.log(microbiology);

    const [docxContent, setDocxContent] = useState<string>('');

    const handleFileUpload = async (file: File) => {
        const reader = new FileReader();
        reader.onload = async () => {
            const result = await mammoth.convertToHtml({ arrayBuffer: reader.result as ArrayBuffer });
            setDocxContent(result.value)
        };
        reader.readAsArrayBuffer(file)
    }
    console.log('docx', docxContent)

    const content = `${docxContent}`
    const extensions = [
        Color.configure({ types: [TextStyle.name, ListItem.name] }),
        TextStyle.configure(),
        StarterKit.configure({
            bulletList: {
                keepMarks: true,
                keepAttributes: false,
            },
            orderedList: {
                keepMarks: true,
                keepAttributes: false,
            },
        }),

    ]

    console.log(docxContent)

    return (
        <div>
            <div>
                <Form
                    onChange={(formValue, e) => {
                        console.log(formValue);
                        setMicrobiology({
                            _id: "",
                            duration: formValue.duration,
                            temperatures: formValue.temperatures,
                            conditions: formValue.conditions,
                            growth: growth,
                            colonyCount: {
                                thenType: formValue.thenType,
                                powerType: formValue.powerType
                            },
                            bacteria: formValue.bacterias,
                        })
                    }}
                    fluid
                    className="grid grid-cols-1 gap"
                // ref={formRef}
                // model={model}
                >
                    <div className="grid grid-cols-3 gap-5">
                        <Form.Group controlId="duration">
                            <Form.ControlLabel>Duration</Form.ControlLabel>
                            <Form.Control
                                name="duration"
                                data={durationType}
                                accepter={SelectPicker}
                                className="w-full"
                            />
                        </Form.Group>
                        <Form.Group controlId="temperatures">
                            <Form.ControlLabel>Temperatures</Form.ControlLabel>
                            <Form.Control
                                name="temperatures"
                                data={temparatureType}
                                accepter={SelectPicker}
                                className="w-full"
                            />
                        </Form.Group>
                        <Form.Group controlId="conditions">
                            <Form.ControlLabel>Condition</Form.ControlLabel>
                            <Form.Control
                                name="conditions"
                                accepter={TagPicker}
                                data={conditionData?.data.map((data: ICondition) => ({
                                    label: data.label,
                                    value: data._id,
                                }))}
                                className="w-full"

                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.ControlLabel>
                                <Toggle
                                    checked={growth}
                                    onChange={(value: boolean) =>
                                        setGrowth(value)
                                    }
                                />
                                Growth Option
                            </Form.ControlLabel>
                        </Form.Group>
                    </div>
                    {
                        growth && (
                            <>
                                <div className="grid grid-cols-3 gap-5 mt-10">
                                    <Form.Group controlId="colonyCount">
                                        <Form.ControlLabel>Colony Count</Form.ControlLabel>
                                        1X <div style={{ display: 'inline-flex' }}
                                        ><Form.Control
                                                name="thenType"
                                                data={thenType}
                                                style={{ width: 224, }}
                                                accepter={SelectPicker}

                                            /></div> 10 <sup style={{
                                                verticalAlign: 'super',
                                                fontSize: 'smaller',
                                            }}><div style={{ display: 'inline-flex' }}><Form.Control
                                                name="powerType"
                                                data={options}
                                                style={{
                                                    width: 224,
                                                }}
                                                accepter={SelectPicker}

                                            /></div></sup> /ml
                                    </Form.Group>
                                    <Form.Group controlId="bacterias">
                                        <Form.ControlLabel>Bacteria</Form.ControlLabel>
                                        <Form.Control
                                            name="bacterias"
                                            accepter={TagPicker}
                                            data={bacteriaData?.data.map((data: IBacteria) => ({
                                                label: data.label,
                                                value: data._id,
                                            }))}

                                            className="w-full"
                                        />
                                    </Form.Group>

                                    <Button onClick={() => setSensitivityModal(true)}>Sensitivity Option</Button>

                                </div></>
                        )}
                </Form>
                <Button appearance="default" className='ml-5 mt-10' onClick={() => {
                    setMicrobiology({
                        _id: "",
                        duration: "",
                        temperatures: "",
                        conditions: [],
                        growth: false,
                        colonyCount: {
                            thenType: '',
                            powerType: '',
                        },
                        bacteria: [],
                        sensitivityOptions: []
                    })
                    setReportGenerateModal(false);
                }}>Cancel</Button>
                <Button appearance="default" className='ml-5 mt-10' onClick={() => {
                    handleSubmit();
                    setReportGenerateModal(false);
                }}>ok</Button>
            </div>
            {
                sensitivityModal && (
                    <RModal
                        open={sensitivityModal}
                        size="md"
                        title={
                            "Test Report View"
                        }
                    >
                        <TestSensitivity sensitivityStatusData={sensitivityStatusData} setSensitivityData={setSensitivityData} setSensitivityModal={setSensitivityModal} sensitivityData={sensitivityData} />
                    </RModal>
                )
            }
            <h1>File Upload</h1>
            <FileUpload onFileUpload={handleFileUpload} />


            {docxContent && (<div className='bg-gray-100 rounded p-4'>

                <EditorProvider slotBefore={(<MenuBar />)} extensions={extensions} content={content} ><></></EditorProvider>
            </div>)}
            {/* <button onClick={handleSave}>Save</button> */}
        </div>
    );
};

export default TestReportBacterial;