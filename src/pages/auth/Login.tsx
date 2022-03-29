import React from "react";
import { useNavigate } from "react-router";
import {
  Container,
  Alert,
  AlertTitle,
  Typography,
  Grid,
  TextField,
  Box,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import AuthContext from "../../services/AuthProvider";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = React.useContext(AuthContext);

  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleErrorSnackbarClose = () => {
    setError("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    const response = await login(username, password);
    setLoading(false);
    if (response.status === "success") navigate("/");
    else setError(response.message);
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Typography fontWeight="bold" variant="h4" align="center" sx={{ mb: 4 }}>
        Login
      </Typography>
      {error && (
        <Alert onClose={handleErrorSnackbarClose} severity="error" sx={{ mb: 4 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="User Name"
            variant="outlined"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
            sx={{ mb: 1 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="password"
            label="Password"
            variant="outlined"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
        </Grid>
      </Grid>
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <LoadingButton
          loading={loading}
          variant="contained"
          color="success"
          onClick={handleSubmit}
        >
          Login
        </LoadingButton>
      </Box>
    </Container>
  );
};

export default Login;
