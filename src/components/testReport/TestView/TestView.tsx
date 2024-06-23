import { ITestGenerateType } from "@/components/order/TestInformation";
import { useGetDepartmentQuery } from "@/redux/api/department/departmentSlice";
import { useGetHospitalGroupQuery } from "@/redux/api/hospitalGroup/hospitalGroupSlice";
import { useGetSpecimenQuery } from "@/redux/api/specimen/specimenSlice";
import { useGetSingleTestQuery } from "@/redux/api/test/testSlice";
import { useGetSingleTestReportPrintMutation, useGetSingleTestReportQuery } from "@/redux/api/testReport/testReportSlice";
import {
  IDepartment,
  IHospitalGroup,
  ISpecimen,
} from "@/types/allDepartmentInterfaces";
import axios from "axios";
import { Button, Form, InputPicker, SelectPicker, TagPicker } from "rsuite";
import TestViewB from "./TestViewB";
import TestViewD from "./TestViewD";
import TestViewP from "./TestViewP";

export type ITestReportView = {
  reportGenerate: ITestGenerateType;
  setReportGenerate: (data: ITestGenerateType) => void;
  setReportGenerateModal: (modal: boolean) => void;
};

const TestView = ({
  reportGenerate,
  setReportGenerate,
  setReportGenerateModal,
}: ITestReportView) => {
  const { data: testQueryData, isLoading } = useGetSingleTestQuery(
    reportGenerate.id
  );
  const { data: reportData } = useGetSingleTestReportQuery(reportGenerate.id);
  const { data: departmentData } = useGetDepartmentQuery(undefined);
  const { data: specimenData } = useGetSpecimenQuery(undefined);
  const { data: hospitalData } = useGetHospitalGroupQuery(undefined);
  const [
    getSingleTestReportPrint
  ] = useGetSingleTestReportPrintMutation();

  if (isLoading) {
    return <div>Loading ....</div>;
  }
  // const [formData, setFromData] = useState<>();


  console.log(testQueryData, "testData", reportGenerate.modeSingleType);
  const handlePrint = async (id: string) => {
    // const data = await getSingleTestReportPrint(id)
    // console.log(data)
    // console.log(data)
    try {
      const newWindow = window.open("", "_blank");
      const response = await axios.post(
        `http://localhost:3001/api/v1/testReport/print`
        , JSON.stringify({ id: id }), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      if (newWindow) {
        newWindow.document.write(decodeURIComponent(response.data.data));
        newWindow.document.title = "Managed By HMS system";
        newWindow?.print();

      }



    } catch (error) {
      console.log(error)
    }
  };
  console.log(reportGenerate.modeSingleType)
  console.log('87', reportData?.data?.descriptiveDataDocs?.docsContent)

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
          <Form.Control name="type" className="w-full" />
        </Form.Group>
        <Form.Group controlId="testResultType">
          <Form.ControlLabel>Test ResultType</Form.ControlLabel>
          <Form.Control name="testResultType" className="w-full" />
        </Form.Group>
        <Form.Group controlId="department">
          <Form.ControlLabel>Department</Form.ControlLabel>
          <Form.Control
            name="department"
            accepter={InputPicker}
            data={departmentData?.data.map((data: IDepartment) => ({
              label: data.label,
              value: data._id,
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
            {reportGenerate.modeType == "single" ? (
              reportGenerate.modeSingleType == "bacterial" ? (
                <>
                  <TestViewB
                    reportGenerate={reportGenerate}
                    setReportGenerate={setReportGenerate}
                    setReportGenerateModal={setReportGenerateModal}
                  />
                </>
              ) : reportGenerate.modeSingleType == "parameter" ? (
                <>
                  <TestViewP
                    reportGenerate={reportGenerate}
                    setReportGenerate={setReportGenerate}
                    setReportGenerateModal={setReportGenerateModal}
                  />
                </>
              ) : (
                <>
                  <TestViewD
                    reportGenerate={reportGenerate}
                    setReportGenerate={setReportGenerate}
                    setReportGenerateModal={setReportGenerateModal}
                  />
                </>
              )
            ) : (
              <>
                <h1></h1>
              </>
            )}
            {
              reportGenerate.modeSingleType == "descriptive" ? reportData?.data?.descriptiveDataDocs?.docsContent === undefined ? "" : <Button
                className="ml-5 mt-10"
                onClick={() => {
                  handlePrint(testQueryData.data._id);
                }}
                appearance="ghost"
                color="blue"
              >
                Print
              </Button> : <Button
                className="ml-5 mt-10"
                onClick={() => {
                  handlePrint(testQueryData.data._id);
                }}
                appearance="ghost"
                color="blue"
              >
                Print
              </Button>
            }


          </div>
        </div>
      </div>
    </div>
  );
};

export default TestView;
