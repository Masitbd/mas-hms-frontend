import { useGetDepartmentQuery } from '@/redux/api/department/departmentSlice';
import { useGetHospitalGroupQuery } from '@/redux/api/hospitalGroup/hospitalGroupSlice';
import { useGetSpecimenQuery } from '@/redux/api/specimen/specimenSlice';
import { useGetSingleTestQuery } from '@/redux/api/test/testSlice';
import { FormEvent, useRef } from 'react';
import { Input, Table } from 'rsuite';
import { ITestReportForm } from './TestReportForm';

const { Column, HeaderCell, Cell } = Table;


const TestReportParameter = ({ reportGenerate, setReportGenerate, setReportGenerateModal }: ITestReportForm) => {
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
        const value = e.currentTarget.name == "result" ? e.currentTarget.value : e.currentTarget.value

        console.log(value);

    }

    return (
        <div>
            <h1>hello parameter </h1>

            <Table
                height={420}
                data={testQueryData?.data?.resultFields}
                rowHeight={60}
                bordered
                cellBordered
            >
                <Column flexGrow={3} align="center" fixed>
                    <HeaderCell>Investigation</HeaderCell>
                    <Cell dataKey="title" />
                </Column>
                <Column flexGrow={4} width={100} fixed>
                    <HeaderCell>Test</HeaderCell>
                    <Cell dataKey="test" />
                </Column>
                <Column flexGrow={1} width={200}>
                    <HeaderCell>Unit</HeaderCell>
                    <Cell dataKey="unit" />
                </Column>
                <Column flexGrow={1} width={200}>
                    <HeaderCell>Normal Unit</HeaderCell>
                    <Cell dataKey="normalValue" />
                </Column>
                <Column flexGrow={3} width={200}>
                    <HeaderCell>Normal Unit</HeaderCell>
                    <Cell >{rowData => <Input type="text" name="result" defaultValue={rowData.result} onInput={(e) => handleSubmit(e, rowData._id)} />}</Cell>
                </Column>
                <Column flexGrow={3} width={200}>
                    <HeaderCell>Normal Unit</HeaderCell>
                    <Cell >{rowData => <Input type="text" name="comment" defaultValue={rowData.comment} onInput={(e) => handleSubmit(e, rowData._id)} />}</Cell>
                </Column>
            </Table>

        </div>
    );
};

export default TestReportParameter;