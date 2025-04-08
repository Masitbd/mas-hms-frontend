import {
  useGetCompnayInofQuery,
  useGetDefaultQuery,
} from "@/redux/api/companyInfo/companyInfoSlice";
import { useLazyGetInvoiceQuery } from "@/redux/api/order/orderSlice";
import React from "react";
import { Button } from "rsuite";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ToWords } from "to-words";
import { printInvoice } from "./OrderHelper";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
const InvoiceGenerator = ({ id }: { id: string }) => {
  const {
    data: companyInfo,
    isLoading: companyInfoLoading,
    isFetching: companyInfoFetching,
  } = useGetDefaultQuery({ default: true });

  const numberToWord = new ToWords({
    localeCode: "en-BD",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
    },
  });
  const [
    getInvoice,
    { isLoading: invoiceDataLoading, isFetching: InvoiceFetching },
  ] = useLazyGetInvoiceQuery();

  const printHelper = async () => {
    const { data } = await getInvoice(id).unwrap();
    printInvoice({ companyInfo: companyInfo, data: data });
  };

  return (
    <div>
      <Button
        appearance="primary"
        color="blue"
        onClick={() => printHelper()}
        size="lg"
        loading={
          companyInfoLoading ||
          companyInfoFetching ||
          invoiceDataLoading ||
          InvoiceFetching
        }
      >
        Invoice
      </Button>
    </div>
  );
};

export default InvoiceGenerator;
