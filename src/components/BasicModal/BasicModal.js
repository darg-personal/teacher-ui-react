import { Button, Modal } from "react-bootstrap";
function BasicModal({ isModalOpen, handleModal, body }) {
  return (
    <>
      <Modal show={isModalOpen} onHide={handleModal}>
        {body}
      </Modal>
    </>
  );
}
export default BasicModal;
