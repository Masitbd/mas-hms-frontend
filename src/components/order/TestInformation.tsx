import React, { useRef, useState } from "react";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Message,
  Schema,
  Table,
  toaster,
} from "rsuite";
import RModal from "../ui/Modal";
import { useGetTestsQuery } from "@/redux/api/test/testSlice";
import { ITest } from "@/types/allDepartmentInterfaces";

const { Cell, Column, HeaderCell } = Table;

type IParams = {
  formData: any;
  setFormData: (params: any) => void;
};

type IFormData = {
  test: ITest;
  hasDiscount: boolean;
  discount: number;
  deliveryDate: Date;
  remark: string;
  pirceAfterDiscount: number;
  discountAmount: number;
};
const initialFromData = {
  test: {} as ITest,
  hasDiscount: false,
  discount: 0,
  deliveryDate: new Date(),
  remark: "",
  pirceAfterDiscount: 0,
  discountAmount: 0,
};

const TestInformation = (params: IParams) => {
  console.log(params.formData);
  const ref: React.MutableRefObject<any> = useRef();
  const { StringType, NumberType, ObjectType } = Schema.Types;
  const [isTestModalOpen, setTestModalOpen] = useState(false);
  const [isTestOrderInfoOpen, setTestOrderInfoOpen] = useState(false);
  const [mode, setMode] = useState("new");
  const [data, setFormData] = useState<IFormData>(initialFromData);

  const { data: testSetData } = useGetTestsQuery(undefined);

  const toggleTestModal = () => setTestModalOpen(!isTestModalOpen);
  const toggleTestOrderInfo = () => setTestOrderInfoOpen(!isTestOrderInfoOpen);

  const handleAddTest = (rowData: ITest) => {
    setMode("new");
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setHours(
      estimatedDeliveryDate.getHours() + Number(rowData.processTime)
    );
    setFormData({
      ...data,
      pirceAfterDiscount: rowData.price,
      test: rowData,
      deliveryDate: estimatedDeliveryDate,
    });

    toggleTestOrderInfo();
  };

  const handleDiscountChange = (value: string) => {
    const discountValue = Number(value);
    if (discountValue >= 0 && discountValue < 100) {
      const oldPrice = Number(data.test.price);
      const discountAmount = Math.ceil((discountValue / 100) * oldPrice);
      const newPrice = Math.ceil(oldPrice - discountAmount);
      setFormData({
        ...data,
        pirceAfterDiscount: newPrice,
        discountAmount,
      });
    }
  };

  const handleFormChange = (formValue: any) => {
    setFormData({
      deliveryDate: formValue.deliveryDate,
      discount: formValue.discount,
      hasDiscount: formValue.hasDiscount,
      remark: formValue.remark,
      test: data.test,
      pirceAfterDiscount: data.pirceAfterDiscount,
      discountAmount: data.discountAmount,
    });
  };

  const okHandlerForOrderInfo = () => {
    if (ref.current.check()) {
      if (mode === "new") {
        const newObject = {
          ...params.formData,
        };

        const tests = newObject.tests ? newObject.tests : [];
        const newTestArray = [...tests, data];

        //   : 0 + data.pirceAfterDiscount;
        newObject.tests = newTestArray;

        params.setFormData(newObject);
      }
      if (mode === "view") {
        setFormData(initialFromData);
      }
      if (mode === "delete") {
        const newObject = { ...params.formData };
        const updatedTest = newObject.tests.filter(
          (fdata: IFormData) => fdata.test._id !== data.test._id
        );

        newObject.tests = updatedTest;
        params.setFormData(newObject);
      }
      if (mode === "edit") {
        const newObject = { ...params.formData };
        const updatedTest = newObject.tests.filter(
          (fdata: IFormData) => fdata.test._id !== data.test._id
        );
        const newTestArray = [...updatedTest, data];
        newObject.tests = newTestArray;
        params.setFormData(newObject);
      }
      toggleTestOrderInfo();
      setFormData(initialFromData);
    } else {
      toaster.push(<Message type="error">Fill out all the fields</Message>);
    }
  };
  const cancelHandlerForOrderInfo = () => {
    setFormData(initialFromData);
    toggleTestOrderInfo();
  };

  const viewButtonHandler = (data: IFormData) => {
    setFormData(data);
    setMode("view");
    toggleTestOrderInfo();
  };
  const deleteButtonHandler = (data: IFormData) => {
    setFormData(data);
    setMode("delete");
    toggleTestOrderInfo();
  };
  const editButtonHandler = (data: IFormData) => {
    setFormData(data);
    setMode("edit");
    toggleTestOrderInfo();
  };

  const singleTestModel = Schema.Model({
    deliveryDate: ObjectType().isRequired("This field is required."),
    discount: NumberType().addRule((value: string | number): boolean => {
      const discount = Number(value);
      if (discount < 0 || discount > 99) {
        return false;
      }
      return true;
    }, "Discount Cannot be more then 99%"),
  });

  return (
    <div>
      <h2 className="font-bold text-xl">Test Information</h2>
      <div>
        <div>
          <Button
            onClick={toggleTestModal}
            appearance="primary"
            color="green"
            className="my-2"
          >
            Add Tests
          </Button>
          <RModal
            open={isTestModalOpen}
            size="lg"
            title=""
            okHandler={toggleTestModal}
            cancelHandler={toggleTestModal}
          >
            <>
              <div>
                <h2 className="mb-5 text-center text-xl font-bold">
                  All Availabel Tests
                </h2>
              </div>
              <Table
                height={500}
                rowHeight={60}
                bordered
                cellBordered
                data={testSetData?.data?.data}
              >
                <Column align="center" resizable flexGrow={2}>
                  <HeaderCell>Test ID</HeaderCell>
                  <Cell dataKey="testCode" />
                </Column>
                <Column align="center" resizable flexGrow={2}>
                  <HeaderCell>Test ID</HeaderCell>
                  <Cell dataKey="label" />
                </Column>
                <Column align="center" resizable flexGrow={2}>
                  <HeaderCell>Test ID</HeaderCell>
                  <Cell dataKey="price" />
                </Column>
                <Column align="center" resizable flexGrow={2}>
                  <HeaderCell>Test ID</HeaderCell>
                  <Cell dataKey="testCode" />
                </Column>
                <Column align="center" resizable flexGrow={2}>
                  <HeaderCell>Actions</HeaderCell>
                  <Cell>
                    {(rowdata) => (
                      <>
                        <Button
                          onClick={() => handleAddTest(rowdata as ITest)}
                          color="green"
                          appearance="primary"
                          //   disabled={
                          //     rowdata?.test?.testCode ===
                          //     params.formData?.tests?.find(
                          //       (tdata) =>
                          //         tdata.test._id === rowdata.test.testCode
                          //     )
                          //   } for next
                        >
                          Add
                        </Button>
                      </>
                    )}
                  </Cell>
                </Column>
              </Table>
            </>
          </RModal>
        </div>
        <div>
          <RModal
            open={isTestOrderInfoOpen}
            okHandler={okHandlerForOrderInfo}
            cancelHandler={cancelHandlerForOrderInfo}
            size="lg"
            title={
              mode == "edit"
                ? "Edit Test Info"
                : mode == "view"
                ? "View Test Info"
                : "Add new test"
            }
          >
            <>
              <div className="my-5">
                <div>
                  <h3 className="text-2xl font-bold">Test Information</h3>
                  <hr />
                </div>
                <div className="grid grid-cols-3">
                  {[
                    ["Title", data.test.label],
                    ["Price", data.test.price],
                    [
                      "Specimen",
                      data.test?.specimen
                        ?.map((specimen) => specimen.value + ",")
                        .join(""),
                    ],
                    data.pirceAfterDiscount > 0 && [
                      "Discount Parcent",
                      <span className="text-red-600" key={1}>
                        {data.discount} %
                      </span>,
                    ],
                    data.pirceAfterDiscount > 0 && [
                      "Discount Amount",
                      <span className="text-red-600" key={2}>
                        {data.discountAmount}
                      </span>,
                    ],
                    data.pirceAfterDiscount > 0 && [
                      "Price After Discount",
                      <span className="text-green-600" key={3}>
                        {data.pirceAfterDiscount}
                      </span>,
                    ],
                  ]
                    .filter((item) => item)
                    .map(([label, value], index) => (
                      <div key={index} className={` mt-4`}>
                        <h2 className="text-md font-bold mb-[-20px]">
                          {label}
                        </h2>
                        <br />
                        <span>{value}</span>
                      </div>
                    ))}
                </div>
                <div>
                  <h2 className="text-md font-bold mb-[-20px] mt-4">
                    Description
                  </h2>
                  <br />
                  <span>{data.test?.description}</span>
                </div>
              </div>
              <div className="mt-10 mb-2">
                <h3 className="text-2xl font-bold">Other Information</h3>
                <hr />
              </div>
              <Form
                onChange={handleFormChange}
                fluid
                model={singleTestModel}
                readOnly={mode === "view"}
                formValue={data}
                ref={ref}
              >
                <div className="grid grid-cols-2">
                  <Form.Group controlId="hasDiscount">
                    <Form.Control
                      name="hasDiscount"
                      value={data.hasDiscount}
                      accepter={Checkbox}
                      onChange={(value, event) =>
                        setFormData({
                          ...data,
                          hasDiscount: event as unknown as boolean,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="discount">
                    <Form.Control
                      name="discount"
                      disabled={!data.hasDiscount}
                      type="number"
                      max={100}
                      onChange={(value, event) => handleDiscountChange(value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="deliveryDate">
                    <Form.ControlLabel>Delivery Date </Form.ControlLabel>
                    <Form.Control
                      name="deliveryDate"
                      accepter={DatePicker}
                      format="dd MMM yyyy hh:mm aa"
                      showMeridian
                      cleanable
                    />
                  </Form.Group>
                  <Form.Group controlId="remark">
                    <Form.ControlLabel>Remark</Form.ControlLabel>
                    <Form.Control name="remark" />
                  </Form.Group>
                </div>
              </Form>
            </>
          </RModal>
        </div>
        <Table
          height={200}
          data={params?.formData?.tests}
          className="w-full"
          bordered
          cellBordered
          rowHeight={60}
        >
          <Column align="center" resizable flexGrow={2}>
            <HeaderCell>Test ID</HeaderCell>
            <Cell dataKey="test.testCode" />
          </Column>
          <Column align="center" resizable flexGrow={3}>
            <HeaderCell>Title</HeaderCell>
            <Cell dataKey="test.label" />
          </Column>
          <Column align="center" resizable flexGrow={1.5}>
            <HeaderCell>Original Price</HeaderCell>
            <Cell dataKey="test.price" />
          </Column>
          <Column align="center" resizable flexGrow={1.5}>
            <HeaderCell>Discount %</HeaderCell>
            <Cell dataKey="discount" />
          </Column>
          <Column align="center" resizable flexGrow={1.5}>
            <HeaderCell>Discounted Price</HeaderCell>
            <Cell dataKey="pirceAfterDiscount" />
          </Column>
          <Column align="center" resizable flexGrow={3.5}>
            <HeaderCell>Action</HeaderCell>
            <Cell>
              {(rowData) => (
                <>
                  <Button
                    onClick={() => deleteButtonHandler(rowData as IFormData)}
                    appearance="primary"
                    color="red"
                  >
                    Delete
                  </Button>
                  <Button
                    appearance="primary"
                    color="blue"
                    onClick={() => editButtonHandler(rowData as IFormData)}
                    className="mx-4"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => viewButtonHandler(rowData as IFormData)}
                    appearance="primary"
                    color="green"
                  >
                    View
                  </Button>
                </>
              )}
            </Cell>
          </Column>
        </Table>
      </div>
    </div>
  );
};

export default TestInformation;
