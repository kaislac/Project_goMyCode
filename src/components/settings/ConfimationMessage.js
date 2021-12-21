import React from 'react'
import { Modal, Form, Button } from 'react-bootstrap'

const ConfirmationMessage = ({ show, message, title, action, state }) => {
  return (
    <>
      <Modal
        centered
        show={show}
        onHide={() => show(false)}
        dialogClassName={'modal-project-small'}
        aria-labelledby='example-custom-modal-styling-title'
      >
        <Modal.Header closeButton>
          <Modal.Title id='example-custom-modal-styling-title'>
            {title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>{message}</h6>
        </Modal.Body>
        <Modal.Footer>
          <Form className='action-button'>
            <Form.Row>
              <Button
                size='sm'
                className='filter-column-button'
                onClick={() => {
                  action(state)
                  show(false)
                }}
                variant='outline-success'
              >
                Confirm
              </Button>
              <Button
                size='sm'
                className='filter-column-button'
                onClick={() => show(false)}
                variant='outline-danger'
              >
                Cancel
              </Button>
            </Form.Row>
          </Form>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ConfirmationMessage
