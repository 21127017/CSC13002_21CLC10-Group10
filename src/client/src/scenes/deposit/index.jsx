import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Typography,
} from "@mui/material";
import { Formik, resetForm } from "formik";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "scenes/navbar";

const depositSchema = yup.object().shape({
  amount: yup.number().positive("Amount must be positive").required("Amount is required"),
});

const Deposit = () => {
  const [depositAmount, setDepositAmount] = useState('');
  //const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);

  const initialValuesDeposit = {
    //id: userId,
    amount: "",
  };

  const handleDeposit = async (values) => {
    const { amount } = values;
    try {
      const response = await fetch(`http://localhost:3001/users/${_id}/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Đảm bảo bạn có token
        },
        body: JSON.stringify({ amount }),
      });

      if (response.ok) {
        // Xử lý sau khi thành công
        setSnackbarMessage("Deposit request added to queue, please wait for the admin check.");
        setShowSnackbar(true);
        setTimeout(() => {
          navigate("/wallet/:userId");
        }, 3000); // 3000 milliseconds = 3 seconds
      } else {
        // Xử lý khi có lỗi
      }
    } catch (error) {
      console.error('Error depositing money:', error);
    }
  };

  return (
    <Box>
      <Navbar/>
      <Box padding="2rem 6%">
            <h2>Depposit Money</h2>
        <Formik
          onSubmit={handleDeposit}
          initialValues={initialValuesDeposit}
          validationSchema={depositSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            resetForm,
          }) => (
            <form onSubmit={handleSubmit}>
              <TextField
                label="Amount"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.amount}
                name="amount"
                type="number"
                error={Boolean(touched.amount) && Boolean(errors.amount)}
                helperText={touched.amount && errors.amount}
                fullWidth
                margin="normal"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Deposit
              </Button>
              <Snackbar
          open={showSnackbar}
          onClose={() => setShowSnackbar(false)}
          message={snackbarMessage}
          action={ // Thêm nút "Back to Homepage" vào action của Snackbar
            <Button
              color="secondary"
              size="small"
              onClick={() => {
                resetForm(); // Đặt lại form sau khi đóng thông báo
                navigate("/home");
              }} // Điều hướng về homepage
            >
              Back to Homepage
            </Button>
          }
          autoHideDuration={3000}
        />
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default Deposit;
