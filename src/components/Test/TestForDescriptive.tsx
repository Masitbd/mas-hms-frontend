import React, { useState } from "react";
import { Button, Form, Modal, Table } from "rsuite";

const ForDescriptive = () => {
  const { Column, HeaderCell, Cell } = Table;
  const [dOpen, setDopen] = useState(false);
  const [resultFieldvalues, setResultFIeldValues] = useState([]);
  const [resultFieldvalue, setResultFieldvalue] = useState();
  const newModalHandler = () => {
    resultFieldvalue.id = resultFieldvalues.length + 1;
    setResultFIeldValues([...resultFieldvalues, resultFieldvalue]);
    setDopen(!dOpen);
  };

  const deleteHandler = (id) => {
    const newData = resultFieldvalues.filter((data) => data.id !== id);
    setResultFIeldValues(newData);
  };

  return (
    <div>
      <div>
        <div>
          <Button
            appearance="primary"
            color="blue"
            onClick={() => setDopen(true)}
          >
            Add Test Params
          </Button>
        </div>
        <Table height={420} data={resultFieldvalues}>
          <Column width={100} fixed>
            <HeaderCell>SL</HeaderCell>
            <Cell dataKey="id" />
          </Column>

          <Column width={200}>
            <HeaderCell>Title</HeaderCell>
            <Cell dataKey="titel" />
          </Column>
          <Column width={200} flexGrow={1}>
            <HeaderCell>Description</HeaderCell>
            <Cell dataKey="description" />
          </Column>
          <Column flexGrow={2}>
            <HeaderCell>Action</HeaderCell>
            <Cell align="center">
              {(rowdate) => (
                <>
                  <Button
                    appearance="ghost"
                    color="red"
                    onClick={() => deleteHandler(rowdate.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    appearance="ghost"
                    color="blue"
                    className="ml-2"
                    // onClick={() => patchOpenHandler(rowdate)}
                  >
                    Edit
                  </Button>
                </>
              )}
            </Cell>
          </Column>
        </Table>
        <div>
          {/* New Modal */}
          <Modal open={dOpen} size={"md"}>
            <Modal.Title>Add test Result</Modal.Title>
            <Modal.Body>
              <Form onChange={setResultFieldvalue}>
                <Form.Group controlId="titel">
                  <Form.ControlLabel>Title</Form.ControlLabel>
                  <Form.Control name="titel" />
                </Form.Group>
                <Form.Group controlId="description">
                  <Form.ControlLabel>Description</Form.ControlLabel>
                  <Form.Control name="description" />
                </Form.Group>
              </Form>
              <Button onClick={() => newModalHandler()}>Add</Button>
            </Modal.Body>
          </Modal>
        </div>
        <div>
          {/* PatchModal */}
          {/* <Modal open={pOpen} size={"md"}>
            <Modal.Title>Add test Result</Modal.Title>
            <Modal.Body>
              <Form onChange={setPatchValue} formDefaultValue={pdata}>
                <Form.Group controlId="investigation">
                  <Form.ControlLabel>Investigation</Form.ControlLabel>
                  <Form.Control name="investigation" />
                </Form.Group>
                <Form.Group controlId="test">
                  <Form.ControlLabel>Test</Form.ControlLabel>
                  <Form.Control name="test" />
                </Form.Group>
                <Form.Group controlId="unit">
                  <Form.ControlLabel>Unit</Form.ControlLabel>
                  <Form.Control name="unit" />
                </Form.Group>
                <Form.Group controlId="normalUnit">
                  <Form.ControlLabel>Normal Unit</Form.ControlLabel>
                  <Form.Control name="normalUnit" />
                </Form.Group>
                <Form.Group controlId="hasPdrv">
                  <Form.ControlLabel>Result Values</Form.ControlLabel>
                  <Form.Control name="hasPdrv" accepter={Checkbox} />
                </Form.Group>
                <Form.Group controlId="pdrvValues">
                  <Form.ControlLabel>Values</Form.ControlLabel>
                  <Form.Control name="values" accepter={SelectPicker} />
                </Form.Group>
              </Form>
              <Button onClick={() => patchHandler()}></Button>
            </Modal.Body>
          </Modal> */}
        </div>
      </div>
    </div>
  );
};

export default ForDescriptive;
