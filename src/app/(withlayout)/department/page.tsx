"use client";

import DepartmentTable from '@/components/department/DepartmentTable';
import NewDepartment from '@/components/department/NewDepartment';
import RModal from '@/components/ui/Modal';
import { IDepartment } from '@/types/allDepartmentInterfaces';
import { useEffect, useState } from 'react';

import { Button } from 'rsuite';

const Department = () => {
    const [postModelOpen, setPostModelOpen] = useState(false)
    const [mode, setMode] = useState("new");
    const [patchData, setPatchData] = useState<IDepartment>({
        label: "",
        description: "",
        value: "",
        commissionParcentage: 0,
        fixedCommission: 0,
        isCommissionFiexed: false,
    });
    useEffect(() => {
        if (mode === 'new') {
            setPatchData({
                label: "",
                description: "",
                value: "",
                commissionParcentage: 0,
                fixedCommission: 0,
                isCommissionFiexed: false,
            });
        }
    }, [mode, setPatchData]);
    return (
        <div className='my-5 px-5'>
            <div className="my-4">
                <Button appearance='primary' onClick={() => setPostModelOpen(!postModelOpen)}>
                    Add New Department
                </Button>
            </div>
            <div>
                <RModal
                    open={postModelOpen}
                    size="xs"
                    title={mode === "new" ? "Add New Department" : mode === "patch" ? "Edit Department Fields" : "Department Details"}
                >
                    <NewDepartment defaultData={patchData} setMode={setMode} mode={mode} open={postModelOpen} setPostModelOpen={setPostModelOpen} />
                </RModal>
                <DepartmentTable setPatchData={setPatchData} setMode={setMode} open={postModelOpen} setPostModelOpen={setPostModelOpen} />
            </div>
        </div>
    );
};

export default Department;
