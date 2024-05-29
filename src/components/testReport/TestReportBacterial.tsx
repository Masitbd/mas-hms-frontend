import { IBacteria } from '@/app/(withlayout)/bacteria/page';
import { useGetBacteriaQuery } from '@/redux/api/bacteria/bacteriaSlice';
import { useGetConditionQuery } from '@/redux/api/condition/conditionSlice';
import { useGetSingleTestQuery } from '@/redux/api/test/testSlice';
import { usePostTestReportMutation } from '@/redux/api/testReport/testReportSlice';
import { useAppSelector } from '@/redux/hook';
import { ICondition } from '@/types/allDepartmentInterfaces';

import { useState } from 'react';
import { Button, Form, Schema, SelectPicker, Table, TagPicker, Toggle } from 'rsuite';
import RModal from '../ui/Modal';

import { ITestReportForm } from './TestReportForm';
import TestSensitivity from './TestSensitivity';
const { Column, HeaderCell, Cell } = Table;



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
    // const formRef: React.MutableRefObject<any> = useRef();
    // const model = Schema.Model({
    //     duration: StringType().isRequired("This field is required."),
    //     temperatures: StringType().isRequired("This field is required."),
    //     condition: StringType().isRequired("This field is required."),
    // });
    const [
        postTestReport
    ] = usePostTestReportMutation(); // post create a reportTest
    const id = useAppSelector((state: { id: { id: string; }; }) => state.id.id);
    console.log(reportGenerate.modeSingleType)
    microbiology.sensitivityOptions = sensitivityData
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



    console.log(microbiology);


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

        </div>
    );
};

export default TestReportBacterial;