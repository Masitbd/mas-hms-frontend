/* eslint-disable react/no-children-prop */
import React, { FormEventHandler, useState } from "react";
import {
  IEmployeeRegistration,
  IPropsForEmployeeRegistration,
} from "./TypesAndDefaults";
import { Button, Input, InputGroup, Table } from "rsuite";
import { ENUM_MODE } from "@/enum/Mode";
import swal from "sweetalert";
import {
  useDeleteEmployeeMutation,
  useGetEmployeeQuery,
} from "@/redux/api/employee/employeeSlice";
import SearchPeopleIcon from "@rsuite/icons/SearchPeople";

const EmployeeTable = (props: Partial<IPropsForEmployeeRegistration>) => {
  const { data, modalOpen, mode, setData, setModalOpen, setMode } = props;
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;
  const [searchParam, setSearchParam] = useState({});

  const {
    data: employeeData,
    isLoading: dataLoading,
    isFetching: dataFeatching,
  } = useGetEmployeeQuery(searchParam);
  const [deleteEmployee, { isLoading: deleteLoading }] =
    useDeleteEmployeeMutation();

  const editHandler = (params: IEmployeeRegistration) => {
    setMode && setMode(ENUM_MODE.EDIT),
      setData && setData(params),
      setModalOpen && setModalOpen(true);
  };
  const viewHandler = (params: IEmployeeRegistration) => {
    setMode && setMode(ENUM_MODE.VIEW),
      setData && setData(params),
      setModalOpen && setModalOpen(true);
  };
  const deleteHandler = async (params: IEmployeeRegistration) => {
    const willDelete = await swal({
      text: "Are you sure you want to delete this Employee Information ?",
      title: "Warning",
      icon: "error",
      buttons: {
        cancel: {
          closeModal: true,
          text: "Cancel",
          value: true,
          visible: true,
          className: "btn btn-primary",
        },
        confirm: {
          closeModal: true,
          text: "Ok",
          value: true,
          visible: true,
          className: "btn btn-danger",
        },
      },
    });

    if (willDelete) {
      const result = await deleteEmployee(params._id).unwrap();
      if (result.success == true) {
        const message = (result as { message: string })?.message;
        swal(`Success! ${message}!`, {
          icon: "success",
        });
      } else {
        const message = (result as { message: string })?.message;
        console.error(
          `Failed to delete employee with id: ${params._id}. Error: ${message}`
        );
      }
    }
  };

  console.log(searchParam);
  return (
    <div className="mx-2">
      <div className="grid grid-cols-2">
        <InputGroup
          onChange={(event: React.FormEvent<HTMLInputElement>) => {
            if (
              event?.target &&
              typeof (event.target as HTMLInputElement).value === "string"
            ) {
              setSearchParam({
                ...searchParam,
                searchTerm: (event.target as HTMLInputElement).value,
              });
            }
          }}
        >
          <Input placeholder="Search" />
          <InputGroup.Addon>
            <SearchPeopleIcon />
          </InputGroup.Addon>
        </InputGroup>
      </div>
      <Table
        loading={dataLoading || dataFeatching || deleteLoading}
        data={employeeData?.data?.data}
        rowHeight={65}
        autoHeight
      >
        <Column flexGrow={2}>
          <HeaderCell children="Name" />
          <Cell dataKey="name" />
        </Column>
        <Column flexGrow={1}>
          <HeaderCell children="Phone" />
          <Cell dataKey="phoneNo" />
        </Column>
        <Column flexGrow={1}>
          <HeaderCell children="Email" />
          <Cell dataKey="email" />
        </Column>
        <Column flexGrow={1.5}>
          <HeaderCell children="..." />
          <Cell>
            {(rowData: IEmployeeRegistration) => {
              return (
                <>
                  <div className="grid grid-cols-6 gap-5">
                    <Button
                      appearance="primary"
                      color="blue"
                      onClick={() => editHandler(rowData)}
                    >
                      Edit
                    </Button>
                    <Button
                      appearance="primary"
                      color="green"
                      onClick={() => viewHandler(rowData)}
                    >
                      View
                    </Button>
                    <Button
                      appearance="primary"
                      color="red"
                      onClick={() => deleteHandler(rowData)}
                    >
                      Delete
                    </Button>
                  </div>
                </>
              );
            }}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default EmployeeTable;
