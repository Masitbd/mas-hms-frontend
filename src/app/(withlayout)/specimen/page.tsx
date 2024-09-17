"use client";
import NewSpecimenModel from '@/components/specimen/NewSpecimenModel';
import SpecimenTable from '@/components/specimen/SpecimenTable';
import RModal from '@/components/ui/Modal';
import { ISpecimen } from '@/types/allDepartmentInterfaces';
import { useEffect, useState } from 'react';

import { Button } from 'rsuite';

const initialDataOfSpecimen = {
    label: "",
    description: "",
    value: "",
} as ISpecimen;


const Specimen = () => {
    const [postModelOpen, setPostModelOpen] = useState(false)
    const [patchData, setPatchData] = useState<ISpecimen>(initialDataOfSpecimen);
    const [mode, setMode] = useState("new");
    useEffect(() => {
        if (mode === 'new') {
            setPatchData(initialDataOfSpecimen);
        }
    }, [mode, setPatchData]);

    const cancelHandler = () => {
        setMode("new");
        setPostModelOpen(!postModelOpen);
        setPatchData(initialDataOfSpecimen);
    };
    return (
        <div className='my-5 px-5'>
            <div className="my-4">
                <Button appearance='primary' onClick={() => setPostModelOpen(!postModelOpen)}>
                    Add New Specimen
                </Button>
            </div>
            <div>
                <RModal
                    open={postModelOpen}
                    size="xs"
                    cancelHandler={cancelHandler}
                    title={mode === "new" ? "Add New Specimen" : mode === "patch" ? "Edit Specimen Fields" : "Specimen Details"}
                >
                    <NewSpecimenModel defaultData={patchData} setMode={setMode} mode={mode} open={postModelOpen} setPostModelOpen={setPostModelOpen} />
                </RModal>
                <SpecimenTable setPatchData={setPatchData} setMode={setMode} open={postModelOpen} setPostModelOpen={setPostModelOpen} />
            </div>
        </div>
    );
};

export default Specimen;