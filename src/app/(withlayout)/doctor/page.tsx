"use client";

import DoctorsTable from '@/components/doctor/DoctorsTable';
import NewDoctor from '@/components/doctor/NewDoctor';
import { useState } from 'react';

import { Button } from 'rsuite';

const Doctor = () => {
    const [postModelOpen, setPostModelOpen] = useState(false)
    return (
        <div className='my-5 px-5'>
            <div className="my-4">
                <Button appearance='primary' onClick={() => setPostModelOpen(!postModelOpen)}>
                    Add New Doctor
                </Button>
            </div>
            <div>
                <NewDoctor open={postModelOpen} setPostModelOpen={setPostModelOpen} />
                <DoctorsTable />
            </div>
        </div>
    );
};

export default Doctor;