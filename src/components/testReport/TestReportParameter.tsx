
import { useGetSingleTestQuery } from '@/redux/api/test/testSlice';
import { FormEvent, useRef } from 'react';
import { Button, Form, Input, SelectPicker, Table } from 'rsuite';

import { useGetSingleDepartmentQuery } from '@/redux/api/department/departmentSlice';
import { usePostTestReportMutation } from '@/redux/api/testReport/testReportSlice';
import { useAppSelector } from '@/redux/hook';
import { ITest } from '@/types/allDepartmentInterfaces';
import { ITestReportForm } from './TestReportForm';


const { Column, HeaderCell, Cell } = Table;



const TestReportParameter = ({ reportGenerate, setReportGenerate, setReportGenerateModal }: ITestReportForm) => {
    const id = useAppSelector((state) => state.id.id);
    // console.log(id, "order id");
    console.log(reportGenerate.modeSingleType);
    const { data: testQueryData } = useGetSingleTestQuery(reportGenerate.id);

    const formRef: React.MutableRefObject<any> = useRef();
    const [
        postTestReport
    ] = usePostTestReportMutation(); // post create a reportTest

    console.log(testQueryData.data.department)
    const { data: departmentQueryData } = useGetSingleDepartmentQuery(testQueryData.data.department);
    console.log(departmentQueryData)

    // const [formData, setFromData] = useState<>();
    // console.log(testQueryData.data.resultFields, 'testData')

    const handleSubmit = async (e: FormEvent<HTMLInputElement>, data: ITest) => {
        console.log(e)

        const testId = reportGenerate.id;
        const type = reportGenerate.modeSingleType;
        const orderId = id;
        const result =
            e.currentTarget.name === "result"
            && e.currentTarget.value
        const comment =
            e.currentTarget.name === "comment"
            && e.currentTarget.value

        const finalDataForSendBakcend = {
            testId,
            orderId,
            result,
            comment,
            type,
            data
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

    const handleImmonulogy = async (e: string | null, data: ITest) => {
        const testId = reportGenerate.id;
        const type = reportGenerate.modeSingleType;
        const orderId = id;
        const result = e;

        const finalDataForSendBakcend = {
            testId,
            orderId,
            result,
            type,
            data
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



    const testType = [
        {
            label: "Positive",
            value: "positive",
        },
        {
            label: "Negative",
            value: "negative",
        },
    ];

    console.log(departmentQueryData?.data?.value === 'immunology')

    return (
        <div>
            <Form>

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
                        <HeaderCell>Result</HeaderCell>
                        <Cell >{rowData =>
                            departmentQueryData?.data?.value === 'immunology report' ? (<SelectPicker
                                data={testType}
                                searchable={false}
                                style={{ width: 224 }}
                                name="result"
                                onChange={(e) => handleImmonulogy(e, rowData as ITest)}
                            />) : (<Input ref={formRef} type="text" name="result" defaultValue={rowData.result} onBlur={(e) => handleSubmit(e, rowData as ITest)} />)}</Cell>
                    </Column>
                    {
                        departmentQueryData?.data?.value === 'haematological report' && (
                            <Column flexGrow={3} width={200}>
                                <HeaderCell>Comment</HeaderCell>
                                <Cell >{rowData => <Input ref={formRef} type="text" name="comment" defaultValue={rowData.comment} onBlur={(e) => handleSubmit(e, rowData as ITest)} />}</Cell>
                            </Column>
                        )
                    }
                </Table>
            </Form>
            <Button appearance="default" className='ml-5 mt-10' onClick={() => {
                setReportGenerateModal(false);
            }}>ok</Button>
        </div>
    );
};

export default TestReportParameter;