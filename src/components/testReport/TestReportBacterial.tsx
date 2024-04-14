import { IBacteria } from '@/app/(withlayout)/bacteria/page';
import { useGetBacteriaQuery } from '@/redux/api/bacteria/bacteriaSlice';
import { useGetConditionQuery } from '@/redux/api/condition/conditionSlice';
import { useGetSensitivityQuery } from '@/redux/api/sensitivity/sensitivitySlict';
import { useGetSingleTestQuery } from '@/redux/api/test/testSlice';
import { ICondition, ISensitivity } from '@/types/allDepartmentInterfaces';
import { useRef, useState } from 'react';
import { Form, Schema, Table, TagPicker, Toggle } from 'rsuite';
import { ITestReportForm } from './TestReportForm';
const { Column, HeaderCell, Cell } = Table;

type microbiology = {
    duration: string;
    temperatures: string;
    conditions: ICondition[];
    growth: boolean;
    colonyCount?: string;
    bacterias?: IBacteria[];
    sensitivityOptions?: ISensitivity[];
}
const TestReportBacterial = ({ reportGenerate, setReportGenerate, setReportGenerateModal }: ITestReportForm) => {
    const { StringType, NumberType } = Schema.Types;
    const [growth, setGrowth] = useState<boolean>(false)
    const [microbiology, setMicrobiology] = useState<microbiology>({
        duration: "",
        temperatures: "",
        conditions: [],
        growth: growth,
        colonyCount: "",
        bacterias: [],
        sensitivityOptions: []
    })

    console.log(microbiology)

    const { data: testQueryData } = useGetSingleTestQuery(reportGenerate.id);
    const { data: sensitivityData } = useGetSensitivityQuery(undefined);
    const { data: conditionData } = useGetConditionQuery(undefined);
    const { data: bacteriaData } = useGetBacteriaQuery(undefined);
    console.log(testQueryData)
    const formRef: React.MutableRefObject<any> = useRef();
    const model = Schema.Model({
        duration: StringType().isRequired("This field is required."),
        temperatures: StringType().isRequired("This field is required."),
        condition: StringType().isRequired("This field is required."),

    });

    return (
        <div>
            <div>
                <Form
                    onChange={(data) => {
                        setMicrobiology({
                            duration: data.duration,
                            temperatures: data.temperatures,
                            conditions: data.conditions,
                            growth: growth,
                            colonyCount: data.colonyCount,
                            bacterias: data.bacterias,
                            sensitivityOptions: data.sensitivityOptions
                        })
                    }}
                    fluid
                    className="grid grid-cols-1 gap"
                    formValue={testQueryData.resultFields}
                    ref={formRef}
                    model={model}
                >
                    <div className="grid grid-cols-3 gap-5">
                        <Form.Group controlId="duration">
                            <Form.ControlLabel>Duration</Form.ControlLabel>
                            <Form.Control
                                name="duration"
                                text="text"

                                className="w-full"

                            />
                        </Form.Group>
                        <Form.Group controlId="temperatures">
                            <Form.ControlLabel>Temperatures</Form.ControlLabel>
                            <Form.Control
                                name="temperatures"
                                type="text"
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
                                <Form.Group controlId="colonyCount">
                                    <Form.ControlLabel>Colony Count</Form.ControlLabel>
                                    <Form.Control
                                        name="colonyCount"
                                        type="text"
                                        className="w-full"
                                    />
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
                                <Form.Group controlId="sensitivityOptions">
                                    <Form.ControlLabel>Sensitivity Option</Form.ControlLabel>
                                    <Form.Control
                                        name="sensitivityOptions"
                                        accepter={TagPicker}
                                        data={sensitivityData?.data.map((data: ISensitivity) => ({
                                            label: data.label,
                                            value: data._id,
                                        }))}
                                        className="w-full py-5"

                                    />
                                </Form.Group></>
                        )}
                    {/* <Button appearance="default" className='ml-5 mt-10' onClick={() => {
                        setReportGenerateModal(false);
                    }}>Submit</Button> */}
                </Form>
            </div>
        </div>
    );
};

export default TestReportBacterial;