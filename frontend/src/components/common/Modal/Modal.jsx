import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

/**
 * Component Modal thông báo kết quả (Lỗi/Thành công)
 * @param {boolean} open - Trạng thái mở modal
 * @param {function} onClose - Hàm xử lý khi đóng modal
 * @param {string} title - Tiêu đề modal
 * @param {string} message - Nội dung thông báo
 * @param {'error'|'success'} type - Loại thông báo (để đổi màu/icon)
 */
export default function Modal({ open, onClose, title, message, type = 'error' }) {
  const isError = type === 'error';
  const color = isError ? 'error.main' : 'success.main';
  const Icon = isError ? ErrorOutlineRoundedIcon : CheckCircleOutlineRoundedIcon;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, textAlign: 'center', p: 1 }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Icon sx={{ fontSize: 64, color: color }} />
      </Box>
      
      <DialogTitle sx={{ color: color, fontWeight: 'bold', fontSize: '1.25rem' }}>
        {title || (isError ? 'Oops! Something went wrong' : 'Success')}
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button 
          variant="contained" 
          color={isError ? "error" : "primary"} 
          onClick={onClose}
          sx={{ minWidth: 120, borderRadius: 5 }}
        >
          {isError ? "Try Again" : "OK"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}