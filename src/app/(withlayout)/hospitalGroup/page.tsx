"use client";
import HospitalGroupTable from '@/components/hospitalGroup/HospitalGroupTable';
import NewHospitalGroup from '@/components/hospitalGroup/NewHospitalGroup';
import RModal from '@/components/ui/Modal';
import { IHospitalGroup } from '@/types/allDepartmentInterfaces';
import { useEffect, useState } from 'react';

import { Button } from 'rsuite';

const HospitalGroup = () => {
    const [postModelOpen, setPostModelOpen] = useState(false)
    const [patchData, setPatchData] = useState<IHospitalGroup>({
        label: "",
        description: "",
        value: "",
    });
    const [mode, setMode] = useState("new");
    useEffect(() => {
        if (mode === 'new') {
            setPatchData({
                label: "",
                description: "",
                value: "",
            });
        }
    }, [mode, setPatchData]);
    // 
    return (
        <div className='my-5 px-5'>
            <div className="my-4">
                <Button appearance='primary' onClick={() => setPostModelOpen(!postModelOpen)}>
                    Add New Hospital Group
                </Button>
            </div>
            <div>
                <RModal
                    open={postModelOpen}
                    size="xs"
                    title={mode === "new" ? "Add New Hospital Group" : mode === "patch" ? "Edit Hospital Group Fields" : "Hospital Group Details"}
                >

                    <NewHospitalGroup defaultData={patchData} setMode={setMode} mode={mode} open={postModelOpen} setPostModelOpen={setPostModelOpen} />
                </RModal>
                <HospitalGroupTable setPatchData={setPatchData} setMode={setMode} open={postModelOpen} setPostModelOpen={setPostModelOpen} />
            </div>
        </div>
    );
};

export default HospitalGroup;