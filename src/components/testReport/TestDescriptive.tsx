import { useGetDepartmentQuery } from '@/redux/api/department/departmentSlice';
import { useGetHospitalGroupQuery } from '@/redux/api/hospitalGroup/hospitalGroupSlice';
import { useGetSpecimenQuery } from '@/redux/api/specimen/specimenSlice';
import { useGetSingleTestQuery } from '@/redux/api/test/testSlice';
import { FormEvent, useRef } from 'react';
import { Input, Table } from 'rsuite';
import { ITestReportForm } from './TestReportForm';


const { Column, HeaderCell, Cell } = Table;
const TestDescriptive = ({ reportGenerate, setReportGenerate, setReportGenerateModal }: ITestReportForm) => {
    const { data: testQueryData } = useGetSingleTestQuery(reportGenerate.id);
    const { data: departmentData } = useGetDepartmentQuery(undefined);
    const { data: specimenData } = useGetSpecimenQuery(undefined);
    const { data: hospitalData } = useGetHospitalGroupQuery(undefined);
    const formRef: React.MutableRefObject<any> = useRef();

    // const [formData, setFromData] = useState<>();
    console.log(testQueryData.data.resultFields, 'testData')

    const handleSubmit = (e: FormEvent<HTMLInputElement>, _id: string) => {
        // console.log(e.currentTarget, _id)
        // console.log(e.target.comment, _id)
        const value = e.currentTarget.value
        console.log(value);
    }

    return (
        <div>

            <Table
                height={420}
                data={testQueryData?.data?.resultFields}
                rowHeight={60}
                bordered
                cellBordered
            >
                <Column flexGrow={3} align="center" fixed>
                    <HeaderCell>Title</HeaderCell>
                    <Cell dataKey="title" />
                </Column>

                <Column flexGrow={3} width={200}>
                    <HeaderCell>Result</HeaderCell>
                    <Cell >{rowData => <Input type="text" name="resultresultDescripton" defaultValue={rowData.resultDescripton} onInput={(e) => handleSubmit(e, rowData._id)} />}</Cell>
                </Column>

            </Table>

        </div>
    );
};


export default TestDescriptive;