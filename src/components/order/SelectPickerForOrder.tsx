import { useLazyGetTestsQuery } from "@/redux/api/test/testSlice";
import { ITest } from "@/types/allDepartmentInterfaces";
import React, { ReactNode, useEffect, useState } from "react";
import { Placeholder, SelectPicker } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import { IParamsForTestInformation } from "./initialDataAndTypes";
import { ITestsFromOrder } from "../generateReport/initialDataAndTypes";

const SelectPickerForOrder = (
  params: IParamsForTestInformation & { addTestHanlder: (test: ITest) => void }
) => {
  // For handeling searching the single tests
  const [tests, setTests] = useState([]);
  const [
    search,
    {
      isLoading: testSearchLoading,
      isError: testSearchError,
      data: testSearchData,
      isFetching,
    },
  ] = useLazyGetTestsQuery();
  const handleTestSearch = async (value: string) => {
    if (value?.length == 0) {
      return;
    }
    const data = await search({ searchTerm: value, flag: "o" });
    if ("data" in data) {
    }
  };

  const Menu = (menu: ReactNode) => {
    if (testSearchLoading || isFetching) {
      return <Placeholder.Grid rows={10} columns={1} active />;
    } else return menu;
  };

  useEffect(() => {
    if (testSearchData?.data?.data) {
      // Delay the update to ensure smoother re-render

      setTests(testSearchData.data.data);
      // Delay of 100ms
    }
  }, [testSearchData]);
  return (
    <div>
      <SelectPicker
        key={1500}
        onSearch={(value, event) => {
          handleTestSearch(value);
        }}
        data={tests?.map(
          (
            test: ITest,
            index
          ): { label: string; value: string; index: number } =>
            ({
              label: test?.label + "-" + `(${test?.testCode})`,
              value: test?._id as string,
              children: test,
              index: index,
            } as { label: string; value: string; index: number })
        )}
        placeholder={"Search"}
        caretAs={SearchIcon}
        loading={testSearchLoading}
        block
        renderMenu={(menu) => Menu(menu)}
        onSelect={(v, item) =>
          params?.addTestHanlder(item?.children as unknown as ITest)
        }
        name="testOption"
        renderMenuItem={(lable: ReactNode, data) => {
          const item = data as unknown as { index: number; value: ITest };
          return (
            <>
              <div
                className={`grid grid-cols-6 py-1 ${
                  item?.index % 2 == 0 ? "bg-gray-200" : "bg-white"
                }`}
              >
                <div className="col-span-5 overflow-ellipsis text-sm">
                  {lable}
                </div>
              </div>
            </>
          );
        }}
        disabledItemValues={
          params.formData.tests.length
            ? params.formData.tests.map(
                (test: ITestsFromOrder) => test?.test?._id
              )
            : []
        }
        menuAutoWidth
      />
    </div>
  );
};

export default SelectPickerForOrder;
