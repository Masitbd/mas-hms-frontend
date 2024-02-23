"use client";

import DoctorsTable from '@/components/doctor/DoctorsTable';
import NewDoctor from '@/components/doctor/NewDoctor';
import RModal2 from '@/components/ui/Model2';
import { IDoctor } from '@/types/allDepartmentInterfaces';

import { useEffect, useState } from 'react';

import { Button } from 'rsuite';

const Doctor = () => {
    const [postModelOpen, setPostModelOpen] = useState(false);
    const [patchData, setPatchData] = useState<IDoctor>({
        name: "",
        fatherName: "",
        email: "",
        designation: "",
        phone: "",
        image: "",
    });

    const [mode, setMode] = useState("new");
    useEffect(() => {
        if (mode === 'new') {
            setPatchData({
                name: "",
                fatherName: "",
                email: "",
                designation: "",
                phone: "",
                image: "",
            });
        }
    }, [mode, setPatchData]);
    return (
        <div className='my-5 px-5'>
            <div className="my-4">
                <Button appearance='primary' onClick={() => setPostModelOpen(!postModelOpen)}>
                    Add New Doctor
                </Button>
            </div>
            <div>
                <RModal2
                    open={postModelOpen}
                    size="md"
                    title={mode === "new" ? "Add New Doctor" : mode === "patch" ? "Edit Doctor's Fields" : "Doctor's Details"}
                >
                    <NewDoctor defaultData={patchData} setMode={setMode} mode={mode} open={postModelOpen} setPostModelOpen={setPostModelOpen} />
                </RModal2>
                <DoctorsTable open={postModelOpen} setPostModelOpen={setPostModelOpen} setPatchData={setPatchData} setMode={setMode} mode={mode} />
            </div>
        </div>
    );
};

export default Doctor;