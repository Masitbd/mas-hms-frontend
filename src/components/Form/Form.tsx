// import React from "react";
// import { Form } from "rsuite";

// const RForm = ({
//   defaultValue,
//   setFormData,
//   model,
//   forwardedRef,
//   children,
// }) => {
//   return (
//     <Form
//       formDefaultValue={defaultValue !== undefined ? defaultValue : {}}
//       onChange={(formValue, event) => {
//         setFormData({
//           label: formValue.label || "",
//           description: formValue.description || "",
//           value: formValue.value || "",
//         });

//         // Additional logic if needed
//       }}
//       ref={forwardedRef}
//       model={model}
//     >
//       <Form.Group controlId="label">
//         <Form.ControlLabel>Title</Form.ControlLabel>
//         <Form.Control name="label" />
//       </Form.Group>
//       <Form.Group controlId="description">
//         <Form.ControlLabel>Description</Form.ControlLabel>
//         <Form.Control name="description" />
//       </Form.Group>
//     </Form>
//   );
// };

// export default RForm;
