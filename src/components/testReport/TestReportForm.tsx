
import { useGetDepartmentQuery, useGetSingleDepartmentQuery } from "@/redux/api/department/departmentSlice";
import { useGetHospitalGroupQuery } from "@/redux/api/hospitalGroup/hospitalGroupSlice";
import { useGetSpecimenQuery } from "@/redux/api/specimen/specimenSlice";
import { useGetSingleTestQuery } from "@/redux/api/test/testSlice";
import { IDepartment, IHospitalGroup, ISpecimen } from "@/types/allDepartmentInterfaces";
import { Form, InputPicker, SelectPicker, TagPicker } from "rsuite";
import { ITestGenerateType } from "../order/TestInformation";
import TestDescriptive from "./TestDescriptive";
import TestReportBacterial from "./TestReportBacterial";
import TestReportGroup from "./TestReportGroup";
import TestReportParameter from "./TestReportParameter";


export type ITestReportForm = {
    reportGenerate: ITestGenerateType,
    setReportGenerate: (data: ITestGenerateType) => void,
    setReportGenerateModal: (modal: boolean) => void,
    updateReportGenerate?: (modal: boolean) => void,
    setUpdateReportGenerate?: boolean;
}


const TestReportForm = ({ reportGenerate, setReportGenerate, setReportGenerateModal }: ITestReportForm) => {
    const { data: testQueryData, isLoading } = useGetSingleTestQuery(reportGenerate.id);
    const { data: departmentData } = useGetDepartmentQuery(undefined);
    const { data: specimenData } = useGetSpecimenQuery(undefined);
    const { data: hospitalData } = useGetHospitalGroupQuery(undefined);
    if (isLoading) {
        return <div>Loading ....</div>
    }
    let departmentQueryData: IDepartment | null = null;
    if (testQueryData?.department) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { data } = useGetSingleDepartmentQuery(testQueryData?.department);
        departmentQueryData = data
    }

    console.log(departmentQueryData);

    // const [formData, setFromData] = useState<>();
    console.log(reportGenerate.id, "departemt")
    console.log(testQueryData, "departemt")
    console.log(testQueryData, 'testData', reportGenerate.status)

    return (
        <div>
            <Form
                className="grid grid-cols-3 gap-5 justify-center w-full"
                fluid
                formValue={testQueryData?.data}
            >
                <Form.Group controlId="label">
                    <Form.ControlLabel>Test Name</Form.ControlLabel>
                    <Form.Control name="label" htmlSize={100} />
                </Form.Group>
                <Form.Group controlId="description">
                    <Form.ControlLabel>Description</Form.ControlLabel>
                    <Form.Control name="description" htmlSize={100} />
                </Form.Group>
                <Form.Group controlId="type">
                    <Form.ControlLabel>Test Type</Form.ControlLabel>
                    <Form.Control
                        name="type"
                        className="w-full"
                    />
                </Form.Group>
                <Form.Group controlId="testResultType">
                    <Form.ControlLabel>Test ResultType</Form.ControlLabel>
                    <Form.Control
                        name="testResultType"
                        className="w-full"
                    />
                </Form.Group>
                <Form.Group controlId="department">
                    <Form.ControlLabel>Department</Form.ControlLabel>
                    <Form.Control
                        name="department"
                        accepter={InputPicker}
                        data={departmentData?.data.map((data: IDepartment) => ({
                            label: data.label,
                            value: data._id
                        }))}
                        className="w-full"
                    />
                </Form.Group>
                <Form.Group controlId="specimen">
                    <Form.ControlLabel>Specimen</Form.ControlLabel>
                    <Form.Control
                        className="w-full"
                        name="specimen"
                        accepter={TagPicker}
                        data={specimenData?.data.map((data: ISpecimen) => ({
                            label: data.label,
                            value: data._id,
                        }))}
                    />
                </Form.Group>
                <Form.Group controlId="reportGroup">
                    <Form.ControlLabel>Report Group</Form.ControlLabel>
                    <Form.Control name="reportGroup" />
                </Form.Group>
                <Form.Group controlId="hospitalGroup">
                    <Form.ControlLabel>Hospital Group</Form.ControlLabel>
                    <Form.Control
                        className="w-full"
                        name="hospitalGroup"
                        accepter={SelectPicker}
                        data={hospitalData?.data.map((data: IHospitalGroup) => ({
                            label: data.label,
                            value: data._id,
                        }))}
                    />
                </Form.Group>
                <Form.Group controlId="processTime">
                    <Form.ControlLabel>Process Time</Form.ControlLabel>
                    <Form.Control name="processTime" type="number" />
                </Form.Group>
            </Form>
            <div>
                <div>
                    <div className="my-5">
                        <h1 className="font-bold text-2xl">Test Result Information</h1>
                        <hr></hr>
                    </div>
                    <div>
                        {
                            // reportGenerate.status === "completed" ?
                            //     (reportGenerate.modeType == "single" ? reportGenerate.modeSingleType == "bacterial" ? (<>
                            //         <TestViewB reportGenerate={reportGenerate} setReportGenerate={setReportGenerate} setReportGenerateModal={setReportGenerateModal} setUpdateReportGenerate={setUpdateReportGenerate} updateReportGenerate={updateReportGenerate} />
                            //     </>)
                            //         : reportGenerate.modeSingleType == "parameter" ? (<>
                            //             <TestViewP reportGenerate={reportGenerate} setReportGenerate={setReportGenerate} setReportGenerateModal={setReportGenerateModal} setUpdateReportGenerate={setUpdateReportGenerate} updateReportGenerate={updateReportGenerate} />
                            //         </>) : (<>
                            //             <TestViewD reportGenerate={reportGenerate} setReportGenerate={setReportGenerate} setReportGenerateModal={setReportGenerateModal} setUpdateReportGenerate={setUpdateReportGenerate} updateReportGenerate={updateReportGenerate} />
                            //         </>) : (<>
                            //             <h1></h1>
                            //         </>))
                            //     :
                            (reportGenerate.modeType == "single" ? reportGenerate.modeSingleType == "bacterial" ? (<>
                                <TestReportBacterial reportGenerate={reportGenerate} setReportGenerate={setReportGenerate} setReportGenerateModal={setReportGenerateModal} />
                            </>) : reportGenerate.modeSingleType == "parameter" ? (<>
                                <TestReportParameter reportGenerate={reportGenerate} setReportGenerate={setReportGenerate} setReportGenerateModal={setReportGenerateModal} />
                            </>) : (<>
                                <TestDescriptive reportGenerate={reportGenerate} setReportGenerate={setReportGenerate} setReportGenerateModal={setReportGenerateModal} />
                            </>) : (<>
                                <TestReportGroup reportGenerate={reportGenerate} setReportGenerate={setReportGenerate} setReportGenerateModal={setReportGenerateModal} />
                            </>))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestReportForm;