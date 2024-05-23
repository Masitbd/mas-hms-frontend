import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "@rsuite/icons/Search";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputGroup,
  InputPicker,
  Message,
  Modal,
  Schema,
  Table,
  toaster,
} from "rsuite";
import RModal from "../ui/Modal";
import {
  useGetTestsQuery,
  useLazyGetTestQuery,
  useLazyGetTestsQuery,
} from "@/redux/api/test/testSlice";
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
  deliveryTime: Date;
  remark: string;
  pirceAfterDiscount: number;
  discountAmount: number;
};
const initialFromData = {
  test: {} as ITest,
  hasDiscount: false,
  discount: 0,
  deliveryTime: new Date(),
  remark: "",
  pirceAfterDiscount: 0,
  discountAmount: 0,
};

const TestInformation = (params: IParams) => {
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
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setHours(
      estimatedDeliveryDate.getHours() + Number(rowData.processTime)
    );

    const newObject = {
      ...params.formData,
    };

    const tests = newObject.tests ? newObject.tests : [];
    var sl = Number(tests.length) + 1;
    const testDataForOrder = {
      test: rowData,
      deliveryTime: estimatedDeliveryDate,
      status: "pending",
      remark: "",
      discount: 0,
      SL: sl,
    };

    const newTestArray = [...tests, testDataForOrder];

    newObject.tests = newTestArray;

    params.setFormData(newObject);
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
      deliveryTime: formValue.deliveryTime,
      discount: formValue.discount,
      hasDiscount: formValue.hasDiscount,
      remark: formValue.remark,
      test: data.test,
      pirceAfterDiscount: data.pirceAfterDiscount,
      discountAmount: data.discountAmount,
    });
  };

  const okHandlerForOrderInfo = () => {
    if (mode === "view") {
      setFormData(initialFromData);
      toggleTestOrderInfo();
      return;
    }
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
    deliveryTime: ObjectType().isRequired("This field is required."),
    discount: NumberType().addRule((value: string | number): boolean => {
      const discount = Number(value);
      if (discount < 0 || discount > 99) {
        return false;
      }
      return true;
    }, "Discount Cannot be more then 99%"),
  });

  // For handeling searching the single tests
  const [
    search,
    {
      data: testSearchData,
      isLoading: testSearchLoading,
      isError: testSearchError,
    },
  ] = useLazyGetTestsQuery();
  const handleTestSearch = async (value: string) => {
    const data = await search({ searchTerm: value });
  };

  // editable Cell
  const [state, setState] = useState("");
  const EditableCell = ({ rowData, dataKey, onChange, type, ...props }) => {
    return (
      <Cell {...props}>
        <input
          type={type}
          className="rs-input"
          defaultValue={rowData[dataKey]}
          onChange={(event) => {
            onChange && onChange(rowData, dataKey, event.target.value);
          }}
        />
      </Cell>
    );
  };
  const handleCellEdit = (id, key, value) => {
    params.formData.tests.find((testInfo) => testInfo.SL === id.SL)[key] =
      value;
    setState("1");
  };
  // useEffect(() => {
  //   alert("c");
  // }, [params.formData.tests]);

  return (
    <div>
      <h2 className="font-bold text-xl">Test Information</h2>
      <div>
        <div>
          {/* <Button
            onClick={toggleTestModal}
            appearance="primary"
            color="green"
            className="my-2"
          >
            Add Tests
          </Button> */}
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
              {/* <div>
                <InputPicker
                  searchable={true}
                  data={testSearchData?.data?.data.map((test) => {
                    return { label: test.label, value: test };
                  })}
                  onSearch={(value, event) => {
                    handleTestSearch(value);
                  }}
                  onSelect={(value, event) => {
                    setMode("new");
                    handleAddTest(value);
                    okHandlerForOrderInfo();
                  }}
                />
              </div> */}
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
                  <Form.Group controlId="deliveryTime">
                    <Form.ControlLabel>Delivery Date </Form.ControlLabel>
                    <Form.Control
                      value={new Date(data.deliveryTime)}
                      name="deliveryTime"
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
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-3">
            <Table
              data={params?.formData?.tests}
              className="w-full"
              bordered
              cellBordered
              rowHeight={100}
              wordWrap={"break-word"}
              height={500}
            >
              <Column align="center" resizable flexGrow={0.5}>
                <HeaderCell>SL.</HeaderCell>
                <Cell dataKey="SL" />
              </Column>
              <Column align="center" resizable flexGrow={1}>
                <HeaderCell>Test ID</HeaderCell>
                <Cell dataKey="test.testCode" />
              </Column>
              <Column align="center" resizable flexGrow={2}>
                <HeaderCell>Title</HeaderCell>
                <Cell dataKey="test.label" />
              </Column>
              <Column align="center" resizable flexGrow={1}>
                <HeaderCell>Original Price</HeaderCell>
                <Cell dataKey="test.price" />
              </Column>
              <Column align="center" resizable flexGrow={1}>
                <HeaderCell>Discount %</HeaderCell>
                <EditableCell
                  dataKey={"discount"}
                  onChange={handleCellEdit}
                  type={"number"}
                />
              </Column>
              <Column align="center" resizable flexGrow={1}>
                <HeaderCell>Discounted Price</HeaderCell>
                <Cell>
                  {(rowData) => {
                    const priceAfterDiscount =
                      rowData.discount > 0
                        ? rowData.test.price -
                          (rowData.test.price * rowData.discount) / 100
                        : rowData.test.price;

                    return `${priceAfterDiscount}`;
                  }}
                </Cell>
              </Column>
              <Column align="center" resizable flexGrow={1.5}>
                <HeaderCell>Delivery Date</HeaderCell>
                <Cell>
                  {(rowData) => {
                    return (
                      <>
                        <DatePicker
                          value={new Date(rowData.deliveryTime)}
                          onChange={(event, value) =>
                            handleCellEdit(rowData, "deliveryTime", event)
                          }
                        />
                      </>
                    );
                  }}
                </Cell>
              </Column>
              <Column align="center" resizable flexGrow={1}>
                <HeaderCell>Remark</HeaderCell>
                <Cell>
                  <Input as="textarea" style={{ scrollbarWidth: "none" }} />
                </Cell>
              </Column>
              <Column align="center" resizable flexGrow={1}>
                <HeaderCell>Action</HeaderCell>
                <Cell>
                  {(rowData) => (
                    <>
                      <Button
                        onClick={() =>
                          deleteButtonHandler(rowData as IFormData)
                        }
                        appearance="primary"
                        color="red"
                      >
                        Delete
                      </Button>
                      {/* <Button
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
                  </Button> */}
                    </>
                  )}
                </Cell>
              </Column>
            </Table>
          </div>
          <div className=" p-2 bg-stone-100 rounded-lg">
            <h3 className="text-center font-bold text-2xl">Available Tests</h3>
            <div className="mt-5">
              <InputPicker
                onSearch={async (value, event) => {
                  await search({ searchTerm: value });
                }}
                data={testSearchData?.data?.data.map((test: ITest) => ({
                  label: test.label,
                  value: test,
                }))}
                onSelect={(value, event) => {
                  handleAddTest(value);
                }}
                placeholder={"Search"}
                className="w-full"
                caretAs={SearchIcon}
                loading={testSearchLoading}
                block={true}
              />
            </div>
            <Table
              height={500}
              rowHeight={60}
              bordered
              cellBordered
              data={testSetData?.data?.data}
              wordWrap={"break-all"}
            >
              <Column align="center" resizable flexGrow={2}>
                <HeaderCell>Test ID</HeaderCell>
                <Cell dataKey="testCode" />
              </Column>
              <Column align="center" resizable flexGrow={2}>
                <HeaderCell>Title</HeaderCell>
                <Cell dataKey="label" />
              </Column>
              <Column align="center" resizable flexGrow={2}>
                <HeaderCell>Price</HeaderCell>
                <Cell dataKey="price" />
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestInformation;
