/* eslint-disable react/no-children-prop */
import React, { useState } from "react";
import { Button, Table, Tag } from "rsuite";
import {
  DefaultCompanyData,
  dummyData,
  ICompanyInfo,
} from "./TypesAndDefaults";
import NewAndPatch from "./NewAndPatch";
import { ENUM_MODE } from "@/enum/Mode";
import swal from "sweetalert";
import {
  useDeleteCompanyInfoMutation,
  useGetCompnayInofQuery,
} from "@/redux/api/companyInfo/companyInfoSlice";

const CompnayInfoTable = () => {
  const {
    data: companyInfoData,
    isLoading: companyInfoLoading,
    isFetching: companyInfoFeatching,
  } = useGetCompnayInofQuery(undefined);
  const [deleteCompanyInfo, { isLoading: deleteLoading }] =
    useDeleteCompanyInfoMutation();
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;

  const [formData, setFormData] = useState(DefaultCompanyData);
  const [mode, setMode] = useState(ENUM_MODE.NEW);
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState("");
  const hanldeDelete = async (props: ICompanyInfo) => {
    const willDelete = await swal({
      text: "Are you sure you want to delete this company Information ?",
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
      const result = await deleteCompanyInfo(props._id).unwrap();
      if ("data" in result) {
        swal("Success", "Company info deleted successfully", "success");
      }
      console.log(result);
    }
  };
  return (
    <div>
      <div className="grid grid-cols-12 gap-5 my-5">
        <Button
          appearance="primary"
          color="blue"
          onClick={() => {
            setOpen(true);
            setMode(ENUM_MODE.NEW);
          }}
        >
          Add New
        </Button>
      </div>
      <div>
        <NewAndPatch
          data={formData}
          mode={mode}
          open={open}
          setData={setFormData}
          setOpen={setOpen}
        />
      </div>
      <Table
        data={companyInfoData?.data}
        autoHeight
        rowHeight={65}
        loading={companyInfoLoading || companyInfoFeatching || deleteLoading}
      >
        <Column flexGrow={2}>
          <HeaderCell children="name" />
          <Cell dataKey="name" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell children="Address" />
          <Cell dataKey="address" />
        </Column>
        <Column flexGrow={1}>
          <HeaderCell children="Phone" />
          <Cell dataKey="phone" />
        </Column>
        <Column>
          <HeaderCell children="Default" />
          <Cell>
            {(rowData: ICompanyInfo) => {
              const isDefault = rowData.default;
              const tag = <Tag color="blue">Default</Tag>;
              return <>{isDefault ? tag : null}</>;
            }}
          </Cell>
        </Column>
        <Column flexGrow={1.5}>
          <HeaderCell children="Default" />
          <Cell>
            {(rowData: ICompanyInfo) => {
              return (
                <>
                  <div className="grid grid-cols-4 gap-5">
                    <Button
                      appearance="primary"
                      color="blue"
                      onClick={() => {
                        setMode(ENUM_MODE.EDIT);
                        setFormData(rowData);
                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      appearance="primary"
                      color="blue"
                      onClick={() => {
                        setMode(ENUM_MODE.VIEW);
                        setFormData(rowData);
                        setOpen(true);
                      }}
                    >
                      View
                    </Button>
                    <Button
                      appearance="primary"
                      color="red"
                      disabled={rowData?.default}
                      title={
                        rowData?.default
                          ? "It is Set as Default. You can not delete it"
                          : ""
                      }
                      onClick={() => hanldeDelete(rowData)}
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

export default CompnayInfoTable;
