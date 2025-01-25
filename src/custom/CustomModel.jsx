import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';

const ModalBox = styled(Box)(()=> ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  background: '#adadff',
  transition: 'transform 0.3s ease-in-out',
  padding:'40px'
}));

const CloseButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: '10px',
  right: '10px',
}));

const CustomModal = ({ open, onClose, message }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalBox>
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
        <Typography variant="h6" style={{ marginBottom: '20px', fontWeight: 'bold' }}>
          {message}
        </Typography>
        <Button variant="contained" color="primary" onClick={onClose}>
          Close
        </Button>
      </ModalBox>
    </Modal>
  );
};

export default CustomModal;