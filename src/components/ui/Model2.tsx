
import React from "react";
import { Modal } from "rsuite";

const RModal2 = ({
    size,
    open,
    title,
    children,
}: {
    size: string;
    open: boolean;
    title: string;
    children: React.ReactElement;
}) => {

    return (
        <div>
            <Modal size={size} open={open}>
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-5">{children}</Modal.Body>
            </Modal>
        </div>
    );
};

export default RModal2;