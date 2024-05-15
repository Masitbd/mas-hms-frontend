'use client'

import { useGetSingleTestQuery } from '@/redux/api/test/testSlice';
import { usePostTestReportMutation } from '@/redux/api/testReport/testReportSlice';
import { useAppSelector } from '@/redux/hook';
import { ITest } from '@/types/allDepartmentInterfaces';

import { FormEvent, useRef, useState } from 'react';
import { Button, Input, Table } from 'rsuite';
import FileUpload from './FileUpload';
import { ITestReportForm } from './TestReportForm';

const { Column, HeaderCell, Cell } = Table;
const TestDescriptive = ({ reportGenerate, setReportGenerate, setReportGenerateModal }: ITestReportForm) => {
    const { data: testQueryData } = useGetSingleTestQuery(reportGenerate.id);
    const id = useAppSelector((state: { id: { id: string; }; }) => state.id.id);

    const formRef: React.MutableRefObject<any> = useRef();
    const [
        postTestReport
    ] = usePostTestReportMutation(); // post create a reportTest
    // const [formData, setFromData] = useState<>();
    console.log(testQueryData.data.resultFields, 'testData')


    const handleSubmit = async (e: FormEvent<HTMLInputElement>, data: ITest) => {

        const testId = reportGenerate.id;
        const type = reportGenerate.modeSingleType;
        const orderId = id;
        const resultDescripton = e.currentTarget.value
        const finalDataForSendBakcend = {
            testId,
            orderId,
            resultDescripton,
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
                    <Cell >{rowData => <Input type="text" name="resultresultDescripton" defaultValue={rowData.resultDescripton} onBlur={(e) => handleSubmit(e, rowData as ITest)} />}</Cell>
                </Column>

            </Table>
           
            <Button appearance="default" className='ml-5 mt-10' onClick={() => {
                setReportGenerateModal(false);

            }}>ok</Button>
        </div>
    );
};


export default TestDescriptive;