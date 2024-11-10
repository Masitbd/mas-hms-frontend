
import { useRef, useState } from 'react';
import { Button, SelectPicker, Table } from 'rsuite';
import { ISensitivityData } from './TestReportBacterial';



const { Column, HeaderCell, Cell } = Table;



type ISensitivityKey = {
    id: string;
    name: string;
    A: string;
    B: string;
    C: string;
}

const TestSensitivity = ({ setSensitivityData, setSensitivityModal, sensitivityStatusData, sensitivityData }: {
    setSensitivityData: (data: ISensitivityData) => void,
    setSensitivityModal: (data: boolean) => void,
    sensitivityStatusData: ISensitivityData,
    sensitivityData: ISensitivityData
}) => {


    const formRef: React.MutableRefObject<any> = useRef();

    const [formData, setFormData] = useState<ISensitivityData>(sensitivityData);


    const handleInputChange = (value: string, key: keyof ISensitivityKey, id: string) => {
        const newData = formData.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    [key]: value
                };
            }
            return item;
        });
        setFormData(newData);
    };

    const handleSubmit = () => {
        setSensitivityData(formData);
        console.log(formData, 'finalData')
        setSensitivityModal(false);
        console.log(sensitivityData)
    };

    const type = [
        {
            label: `M`,
            value: `M`,
        },
        {
            label: `R`,
            value: `R`,
        },
        {
            label: `S`,
            value: `S`,
        },
        {
            label: `(+)`,
            value: `(+)`,
        },
        {
            label: `(++)`,
            value: `(++)`,
        },
        {
            label: `(+++)`,
            value: `(+++)`,
        },


    ];

    return (
        <div>

            <Table
                height={420}
                rowHeight={60}
                bordered
                cellBordered
                data={formData}
                autoHeight
            >
                <Table.Column flexGrow={4} width={100} fixed>
                    <Table.HeaderCell>ID</Table.HeaderCell>
                    <Table.Cell dataKey="id" />
                </Table.Column>
                <Table.Column flexGrow={4} width={100} fixed>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.Cell dataKey="name" />
                </Table.Column>
                <Table.Column flexGrow={2} width={100} fixed>
                    <Table.HeaderCell>A</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (
                            <SelectPicker
                                name="A"
                                data={type}
                                onChange={(value) => handleInputChange(value as string, "A", rowData.id)}

                                className="w-full"

                            />
                        )}
                    </Table.Cell>
                </Table.Column>
                <Table.Column flexGrow={2} width={100} fixed>
                    <Table.HeaderCell>B</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (
                            <SelectPicker
                                name="B"
                                data={type}
                                onChange={(value) => handleInputChange(value as string, "B", rowData.id)}
                                className="w-full"

                            />
                        )}
                    </Table.Cell>
                </Table.Column>
                <Table.Column flexGrow={2} width={100} fixed>
                    <Table.HeaderCell>C</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (
                            <SelectPicker
                                name="C"
                                data={type}
                                onChange={(value) => handleInputChange(value as string, "C", rowData.id)}
                                className="w-full"

                            />
                        )}
                    </Table.Cell>
                </Table.Column>
            </Table>

            <Button appearance="default" className='ml-5 mt-10' onClick={handleSubmit}>OK</Button>
            {/* <Button appearance="default" className='ml-5 mt-10' onClick={()}>Cancel</Button> */}
        </div>
    );
};

export default TestSensitivity;