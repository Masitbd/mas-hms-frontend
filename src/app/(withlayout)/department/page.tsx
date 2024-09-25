"use client";

import DepartmentTable from '@/components/department/DepartmentTable';
import NewDepartment from '@/components/department/NewDepartment';
import { useState } from 'react';

import { Button, Message, toaster } from 'rsuite';

const Department = () => {
    const [postModelOpen, setPostModelOpen] = useState(false)
    return (
        <div className='my-5 px-5'>
            <div className="my-4">
                <Button appearance='primary' onClick={() => setPostModelOpen(!postModelOpen)}>
                    Add New Department
                </Button>
            </div>
            <div>
                <NewDepartment open={postModelOpen} setPostModelOpen={setPostModelOpen} />
                <DepartmentTable />
            </div>
        </div>
    );
};

export default Department;
