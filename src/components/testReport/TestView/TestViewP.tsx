
import { useRef } from 'react';
import { Button, Form, Table } from 'rsuite';

import { useGetSingleTestReportQuery } from '@/redux/api/testReport/testReportSlice';
import { useAppSelector } from '@/redux/hook';
import { ITestReportForm } from '../TestReportForm';




const { Column, HeaderCell, Cell } = Table;



const TestViewP = ({ reportGenerate, setReportGenerate, setReportGenerateModal, setUpdateReportGenerate, updateReportGenerate }: ITestReportForm) => {
    const id = useAppSelector((state) => state.id.id);
    // console.log(id, "order id");
    // console.log(reportGenerate.modeSingleType);
    const { data: reportData } = useGetSingleTestReportQuery(reportGenerate.id);
    const formRef: React.MutableRefObject<any> = useRef();


    // const [formData, setFromData] = useState<>();
    console.log(reportData)


    return (
        <>
            <div>
                <Form>
                    <Table
                        height={420}
                        data={reportData?.data?.parameterBased}
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
                            <Cell dataKey="result" />
                        </Column>
                        <Column flexGrow={3} width={200}>
                            <HeaderCell>Comment</HeaderCell>
                            <Cell dataKey="comment" />
                        </Column>
                    </Table>
                </Form>
                <Button appearance="default" className='ml-5 mt-10' onClick={() => {
                    setReportGenerateModal(false);
                }}>ok</Button>
            </div>

        </>
    );
};

export default TestViewP;