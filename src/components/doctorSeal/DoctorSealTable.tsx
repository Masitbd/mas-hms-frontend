import { Button, Table } from "rsuite";

import { ENUM_MODE } from "@/enum/Mode";
import { useDeleteSealMutation, useGetSealQuery } from "@/redux/api/doctorSeal/doctorSealSlice";
import swal from "sweetalert";
import { IDoctorSeal, IPropsForTable } from "../comment/typesAdInitialData";

const DoctorSealTable = (props: IPropsForTable<IDoctorSeal>) => {
  const { data: sealData, isLoading: sealDataLoading } =
    useGetSealQuery(undefined);

  const { setData, setMode, setModalOpen } = props;
  const [deleteSeal] = useDeleteSealMutation();
  const { Column, HeaderCell, Cell } = Table;
  const viewAndEditButtonHandler = (data: IDoctorSeal, mode: string) => {
    const modifiedData = JSON.parse(JSON.stringify(data));
    setData(modifiedData);
    setMode(mode);
    setModalOpen(true);
  };

  const DeleteButtonHandler = async (props: IDoctorSeal) => {
    const confirm = await swal({
      text: "Are you sure you want to delete this doctor seal",
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

    if (confirm) {
      const result = await deleteSeal(props._id);
      const message = (result as { data: { message: string } })?.data.message;
      swal(`Success! ${message}!`, {
        icon: "success",
      })
    }
  };

  // Testing printing functionality

  return (
    <div>
      <Table
        height={600}
        bordered
        cellBordered
        rowHeight={65}
        loading={sealDataLoading}
        data={sealData?.data}
        className="text-md"
      >
        <Column flexGrow={2}>
          <HeaderCell>Title</HeaderCell>
          <Cell dataKey="title" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Seal</HeaderCell>
          <Cell>
            {(rowdata: IDoctorSeal) => (
              <>
                {rowdata?.seal ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: rowdata.seal }}
                  ></div>
                ) : (
                  ""
                )}
              </>
            )}
          </Cell>
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Action</HeaderCell>
          <Cell>
            {(rowdata: IDoctorSeal) => (
              <>
                <Button
                  className='ml-5'
                  appearance="primary"
                  color="blue"
                  onClick={() =>
                    viewAndEditButtonHandler(rowdata, ENUM_MODE.VIEW)
                  }
                >
                  View
                </Button>
                <Button
                  className='ml-5'
                  appearance="primary"
                  color="green"
                  onClick={() =>
                    viewAndEditButtonHandler(rowdata, ENUM_MODE.EDIT)
                  }
                >
                  Edit
                </Button>
                <Button
                  className='ml-5'
                  appearance="primary"
                  color="red"
                  onClick={() => DeleteButtonHandler(rowdata)}
                >
                  Delete
                </Button>
              </>
            )}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default DoctorSealTable;