import { IBacteria } from "@/app/(withlayout)/bacteria/page";
import { useGetBacteriaQuery } from "@/redux/api/bacteria/bacteriaSlice";
import { useGetConditionQuery } from "@/redux/api/condition/conditionSlice";
import { useGetSingleTestReportQuery } from "@/redux/api/testReport/testReportSlice";
import { ICondition } from "@/types/allDepartmentInterfaces";
import { Button, Form, TagPicker } from "rsuite";
import { ITestReportForm } from "../TestReportForm";

const TestViewB = ({ reportGenerate, setReportGenerate, setReportGenerateModal }: ITestReportForm) => {

    const { data: reportData } = useGetSingleTestReportQuery(reportGenerate.id);
    const { data: conditionData } = useGetConditionQuery(undefined);
    const { data: bacteriaData } = useGetBacteriaQuery(undefined);
    console.log(reportData)




    return (
        <div>
            <div>
                <Form
                    fluid
                    formValue={reportData?.data?.microbiology[0]}
                    className="grid grid-cols-1 gap"
                    readOnly={true}
                >
                    <div className="grid grid-cols-3 gap-5">
                        <Form.Group controlId="duration">
                            <Form.ControlLabel>Duration</Form.ControlLabel>
                            <Form.Control
                                name="duration"
                                type="text"

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

                    </div>
                    {
                        reportData?.data?.microbiology?.growth && (
                            <>
                                <Form.Group controlId="colonyCount">
                                    <Form.ControlLabel>Colony Count</Form.ControlLabel>
                                    1X <div style={{ display: 'inline-flex' }}
                                    ><Form.Control
                                            name="colonyCount.thenType"
                                            style={{ width: 224, }}
                                        /></div> 10 <sup style={{
                                            verticalAlign: 'super',
                                            fontSize: 'smaller',
                                        }}><div style={{ display: 'inline-flex' }}><Form.Control
                                            name="colonyCount.powerType"
                                            style={{
                                                width: 224,
                                            }}

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
                                <Form.Group controlId="sensitivityOptions">
                                    <Form.ControlLabel>Sensitivity Option</Form.ControlLabel>
                                </Form.Group>
                            </>
                        )}
                </Form>
                <Button appearance="default" className='ml-5 mt-10' onClick={() => {
                    setReportGenerateModal(false);
                }}>ok</Button>
            </div>
        </div>
    );
};

export default TestViewB;