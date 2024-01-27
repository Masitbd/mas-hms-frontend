"use client";
import ForMicroBiology from "@/components/Test/ForMicroBiology";
import ForDescriptive from "@/components/Test/TestForDescriptive";
import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  InputPicker,
  Modal,
  SelectPicker,
  Table,
  TagPicker,
  Toggle,
} from "rsuite";

const Test = () => {
  // Dummy value for input picker
  const dDataForInputPicker = [
    {
      label: "Radiology",
      value: "descriptive",
    },
    {
      label: "microbiology",
      value: "microbiology",
    },

    {
      label: "Gino",
      value: "some",
    },

    {
      label: "Gino",
      value: "some",
    },
  ];
  const dDataForSpecimen = [
    {
      label: "BLood",
      value: "blooeed",
    },
    {
      label: "BLood",
      value: "bloeod",
    },

    {
      label: "BLood",
      value: "bqlood",
    },
  ];

  const testCode = "1100de";
  const testType = [
    {
      label: "Signle",
      value: "single",
    },
    {
      label: "Group",
      value: "group",
    },
  ];
  const dDataForTestTube = [
    {
      label: "Red",
      value: "rede",
    },
    {
      label: "Red",
      value: "refd",
    },
    {
      label: "Red",
      value: "reed",
    },
  ];
  const dDataForReportGroup = [
    {
      label: "SOme Group",
      value: "Some veealue",
    },
    {
      label: "SOme Group",
      value: "Some valeeeue",
    },
    {
      label: "SOme Group",
      value: "Some vaeeeelue",
    },
    {
      label: "SOme Group",
      value: "Some vwwwalue",
    },
  ];
  const dDataForHospitalGroup = [
    {
      label: "SOme Group",
      value: "Some veealueee",
    },
    {
      label: "SOme Group",
      value: "Some valeeeue",
    },
    {
      label: "SOme Group",
      value: "Some vaeeefelue",
    },
    {
      label: "SOme Group",
      value: "Some vwwwaslue",
    },
  ];

  const initialData = {
    title: "",
    department: "",
    testCode: "",
    specimen: "",
    testType: "",
    hasTestTube: "",
    testTube: [],
    reportGroup: "",
    hospitalGroup: "",
    price: 0,
    vatRate: 0,
    processTime: 0,
  };
  const [formData, setfromData] = useState(initialData);
  console.log(formData);
  const { Column, Cell, HeaderCell } = Table;

  // For single test result values
  const [singleTestModalOpen, setSingleTestModalOpen] = useState(false);
  const [singleFormValue, setSIngleFromValue] = useState({
    investigation: "",
    test: "",
    unit: "",
    normalUnit: "",
    hasPdrv: "",
    values: "",
  });
  const [resultFieldvalues, setResultFIeldValues] = useState([]);
  const singleTestModalHandler = () => {
    setSingleTestModalOpen(!singleTestModalOpen);
    singleFormValue.id = resultFieldvalues.length + 1;

    setResultFIeldValues([...resultFieldvalues, singleFormValue]);
    setSIngleFromValue({
      investigation: "",
      test: "",
      unit: "",
      normalUnit: "",
      hasPdrv: "",
      values: "",
    });
  };
  const deleteHandler = (id) => {
    const newData = resultFieldvalues.filter((data) => data.id !== id);
    setResultFIeldValues(newData);
  };

  // For Patch
  const [pOpen, setPOpen] = useState(false);
  const [pdata, setPData] = useState();
  const patchOpenHandler = (data) => {
    setPData(data);
    setPOpen(!pOpen);
  };
  const [patchValue, setPatchValue] = useState();
  const patchHandler = () => {
    const newDate = resultFieldvalues.filter((data) => data.id !== pdata.id);
    setResultFIeldValues([...newDate, patchValue]);

    setPOpen(false);
  };
  return (
    <div>
      <div className="flex">
        <Form
          onChange={setfromData}
          // ref={forwardedRef}
          // model={model}
          className="grid grid-cols-3"
        >
          <Form.Group controlId="label">
            <Form.ControlLabel>Title</Form.ControlLabel>
            <Form.Control name="label" />
          </Form.Group>
          <Form.Group controlId="department">
            <Form.ControlLabel>Department</Form.ControlLabel>
            <Form.Control
              name="department"
              accepter={InputPicker}
              data={dDataForInputPicker}
            />
          </Form.Group>
          <Form.Group controlId="testCode">
            <Form.ControlLabel>Test Code</Form.ControlLabel>
            <Form.Control name="testCode" defaultValue={testCode} disabled />
          </Form.Group>
          <Form.Group controlId="specimen">
            <Form.ControlLabel>Specimen</Form.ControlLabel>
            <Form.Control
              name="specimen"
              accepter={TagPicker}
              data={dDataForSpecimen}
            />
          </Form.Group>
          <Form.Group controlId="type">
            <Form.ControlLabel>Test Type</Form.ControlLabel>
            <Form.Control name="type" accepter={InputPicker} data={testType} />
          </Form.Group>
          <Form.Group controlId="hasTestTube">
            <Form.ControlLabel>Include Test Tube</Form.ControlLabel>
            <Form.Control
              name="hasTestTube"
              accepter={Toggle}
              // value={!formData.hasTestTube}
            />
          </Form.Group>
          <Form.Group controlId="testTube">
            <Form.ControlLabel>Test Tube</Form.ControlLabel>
            <Form.Control
              name="testTube"
              accepter={TagPicker}
              data={dDataForTestTube}
              disabled={!formData.hasTestTube}
            />
          </Form.Group>
          <Form.Group controlId="reportGroup">
            <Form.ControlLabel>Report Group</Form.ControlLabel>
            <Form.Control
              name="reportGroup"
              accepter={InputPicker}
              data={dDataForReportGroup}
            />
          </Form.Group>
          <Form.Group controlId="hospitalGroup">
            <Form.ControlLabel>Hospital Group</Form.ControlLabel>
            <Form.Control
              name="hospitalGroup"
              accepter={InputPicker}
              data={dDataForHospitalGroup}
            />
          </Form.Group>
          <Form.Group controlId="price">
            <Form.ControlLabel>Price</Form.ControlLabel>
            <Form.Control name="price" type="number" />
          </Form.Group>
          <Form.Group controlId="vatRate">
            <Form.ControlLabel>Vat Rate</Form.ControlLabel>
            <Form.Control name="vatRate" type="number" />
          </Form.Group>
          <Form.Group controlId="processTime">
            <Form.ControlLabel>Process Time</Form.ControlLabel>
            <Form.Control name="processTime" type="number" />
          </Form.Group>
        </Form>
      </div>
      {/* For Group test */}
      {formData.type == "group" ? (
        <div>
          <h2>For Group Test</h2>
          <div>
            <Button appearance="primary" color="blue">
              Add Tests
            </Button>
          </div>
          <div>
            <Table height={420}>
              <Column width={50} align="center" fixed>
                <HeaderCell>Sl No.</HeaderCell>
                <Cell dataKey="id" />
              </Column>

              <Column width={100} fixed>
                <HeaderCell>Title</HeaderCell>
                <Cell dataKey="label" />
              </Column>

              <Column width={200}>
                <HeaderCell>Price</HeaderCell>
                <Cell dataKey="city" />
              </Column>
              <Column width={200} flexGrow={1}>
                <HeaderCell>Email</HeaderCell>
                <Cell dataKey="email" />
              </Column>
            </Table>
          </div>
        </div>
      ) : (
        ""
      )}

      {/* For single test */}
      <div>
        {formData.type === "single" ? (
          <div>
            <div>
              <Button
                appearance="primary"
                color="blue"
                onClick={() => setSingleTestModalOpen(true)}
              >
                Add Test Params
              </Button>
            </div>
            <Table height={420} data={resultFieldvalues}>
              <Column width={50} align="center" fixed>
                <HeaderCell>Investigation</HeaderCell>
                <Cell dataKey="investigation" />
              </Column>

              <Column width={100} fixed>
                <HeaderCell>Test</HeaderCell>
                <Cell dataKey="test" />
              </Column>

              <Column width={200}>
                <HeaderCell>Unit</HeaderCell>
                <Cell dataKey="unit" />
              </Column>
              <Column width={200} flexGrow={1}>
                <HeaderCell>Normal Unit</HeaderCell>
                <Cell dataKey="normalUnit" />
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
                        onClick={() => patchOpenHandler(rowdate)}
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
              <Modal open={singleTestModalOpen} size={"md"}>
                <Modal.Title>Add test Result</Modal.Title>
                <Modal.Body>
                  <Form onChange={setSIngleFromValue}>
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
                  <Button onClick={() => singleTestModalHandler()}></Button>
                </Modal.Body>
              </Modal>
            </div>
            <div>
              {/* PatchModal */}
              <Modal open={pOpen} size={"md"}>
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
              </Modal>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <div>
        {formData.department === "descriptive" ? (
          <ForDescriptive></ForDescriptive>
        ) : (
          ""
        )}
      </div>
      <div>
        {formData.department === "microbiology" ? (
          <ForMicroBiology></ForMicroBiology>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Test;
