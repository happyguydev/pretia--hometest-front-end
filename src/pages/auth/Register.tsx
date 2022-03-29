import React from "react";
import { useNavigate } from "react-router";
import {
  Container,
  Box,
  Typography,
  TextField,
  Grid,
  FormControl,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  IconButton,
  Alert,
  AlertTitle,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import AuthContext from "../../services/AuthProvider";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const { register } = React.useContext(AuthContext);

  const [username, setUsername] = React.useState<string>("");
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [password, setPassword] = React.useState<string>("");
  const [error, setError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);
    const response = await register(username, password);
    setLoading(false);
    if (response.status === "success") return navigate("/");
    else {
      setError(true);
      setErrorMessage(response.message);
    }
  };

  const handleErrorAlertClose = () => {
    setError(false);
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Typography fontWeight="bold" variant="h4" align="center" sx={{ mb: 4 }}>
        Register
      </Typography>
      {error && (
        <Alert onClose={handleErrorAlertClose} severity="error" sx={{ mb: 4 }}>
          <AlertTitle>Error</AlertTitle>
          {errorMessage}
        </Alert>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
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
        <Grid item xs={12} md={12}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
        </Grid>
      </Grid>
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <LoadingButton
          loading={loading}
          variant="contained"
          color="success"
          onClick={handleSubmit}
        >
          Submit
        </LoadingButton>
      </Box>
    </Container>
  );
};

export default Login;
