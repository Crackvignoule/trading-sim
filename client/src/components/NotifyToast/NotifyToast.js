import React from 'react';
import { useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './NotifyToast.styles';

function NotifyToast() {
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    // Définition de la variante pour l'animation avec framer-motion
    const snackbarVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <>
            <Button onClick={handleClick}>Open Snackbar</Button>
            <AnimatePresence>
                {open && (
                    <Snackbar
                        open={open}
                        autoHideDuration={5000}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        TransitionComponent={({ children }) => (
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={snackbarVariants}
                                transition={{ duration: 0.5 }}
                            >
                                {children}
                            </motion.div>
                        )}
                    >
                        <Alert
                            onClose={handleClose}
                            severity="success"
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            Ordre enregistré avec succès !
                        </Alert>
                    </Snackbar>
                )}
            </AnimatePresence>
        </>
    );
}

export default NotifyToast;
