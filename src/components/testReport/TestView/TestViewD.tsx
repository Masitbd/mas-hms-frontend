

import { Button, Table } from 'rsuite';

import { useGetSingleTestReportQuery } from '@/redux/api/testReport/testReportSlice';
import { ITestReportForm } from '../TestReportForm';

const { Column, HeaderCell, Cell } = Table;
const TestViewD = ({ reportGenerate, setReportGenerate, setReportGenerateModal }: ITestReportForm) => {
    const { data: reportData } = useGetSingleTestReportQuery(reportGenerate.id);


    console.log(reportData);


    return (
        <div>

            <Table
                height={420}
                data={reportData?.data?.descriptive}
                rowHeight={60}
                bordered
                cellBordered
            >
                <Column flexGrow={3} align="center" fixed>
                    <HeaderCell>Title</HeaderCell>
                    <Cell dataKey="title" />
                </Column>

                <Column flexGrow={3} width={200}>
                    <HeaderCell>Description</HeaderCell>
                    <Cell dataKey="resultDescripton" />
                </Column>

            </Table>
            <Button appearance="default" className='ml-5 mt-10' onClick={() => {
                setReportGenerateModal(false);
            }}>ok</Button>
        </div>
    );
};


export default TestViewD;