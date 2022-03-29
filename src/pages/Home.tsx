import React from "react";
import { Navigate } from "react-router";
import {
  Container,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  Snackbar,
  Alert,
  Slide,
  SlideProps
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridSelectionModel,
} from "@mui/x-data-grid";
import LoadingButton from "@mui/lab/LoadingButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

type TransitionProps = Omit<SlideProps, 'direction'>;

import jwtAPI from "../services/jwtApi";
import AuthContext from "../services/AuthProvider";
import { AppModel } from "../constants/appModel";

function TransitionLeft(props: TransitionProps) {
  return <Slide {...props} direction="left" />;
}

const Home: React.FC = () => {
  const { user } = React.useContext(AuthContext);

  const [rows, setRows] = React.useState<AppModel[]>([]);
  const [pageSize, setPageSize] = React.useState<number>(5);
  const [selectionModel, setSelectionModel] =
    React.useState<GridSelectionModel>([]);

  const [newUpdate, setNewUpdate] = React.useState<string>("");
  const [showForm, setShowForm] = React.useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = React.useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = React.useState<boolean>(false);
  const [formData, setFormData] = React.useState<AppModel>({
    id: "",
    title: "",
    description: "",
    type: "Static",
  });
  const [alert, setAlert] = React.useState({
    open: false,
    state: "",
    message: "",
  });
  const [transition, setTransition] = React.useState<
    React.ComponentType<TransitionProps> | undefined
  >(undefined);

  if (!user && showForm) return <Navigate to="/login" />;

  const columns: GridColDef[] = React.useMemo(
    () => [
      { field: "title", headerName: "Title", type: "string", width: 150 },
      {
        field: "type",
        headerName: "Type",
        type: "singleSelect",
        valueOptions: [
          "Static",
          "Dynamic",
          "SPA",
          "MPA",
          "Animated",
          "CMS",
          "Ecommerce",
          "Portal",
          "PWA",
        ],
        flex: 0.3,
        minWidth: 100,
      },
      {
        field: "description",
        headerName: "Description",
        type: "string",
        flex: 1,
        minWidth: 200,
      },
    ],
    []
  );

  const initForm = () => {
    setSelectionModel([]);
    setFormData({
      id: "",
      title: "",
      description: "",
      type: "Static",
    });
    setLoadingSubmit(false);
    setLoadingDelete(false);
  };

  const handleNewClick = () => {
    setNewUpdate("New");
    initForm();
    setShowForm(true);
  };

  const handleAppClick = (rowData: GridRowParams) => {
    if (!user) return;
    setNewUpdate("Edit");
    setFormData({
      id: rowData.row?.id,
      title: rowData.row?.title,
      description: rowData.row?.description,
      type: rowData.row?.type,
    });
    setShowForm(true);
  };

  const handleBackClick = () => {
    setShowForm(false);
    initForm();
  };

  const handleNewEditSubmit = async () => {
    setLoadingSubmit(true);
    const res = await jwtAPI.createEditApp(formData);
    setLoadingSubmit(false);
    setTransition(() => TransitionLeft);
    if (res.result.message !== "ok") {
      setAlert({
        open: true,
        state: "error",
        message: res?.message,
      });
      return;
    }

    if (newUpdate === "New") setRows([res.result.applist, ...rows]);
    else
      setRows((prev) =>
        prev.map((row) =>
          row.id === res.result.applist.id ? res.result.applist : row
        )
      );

    setAlert({
      open: true,
      state: "success",
      message: "Success",
    });

    initForm();
    setShowForm(false);
  };

  const handleDeleteClick = async () => {
    setLoadingDelete(true);
    const res = await jwtAPI.deleteApp(
      selectionModel.map((row) => row.toString())
    );
    setLoadingDelete(false);
    setTransition(() => TransitionLeft);
    if (res.result.message !== "ok") {
      setAlert({
        open: true,
        state: "error",
        message: res?.message,
      });
      return;
    }

    setRows((prev) =>
      prev.filter((item) => {
        if (!selectionModel.includes(item.id)) return item;
      })
    );

    setAlert({
      open: true,
      state: "success",
      message: "Success",
    });
  };

  const handleAlertClose = () => {
    setAlert({
      open: false,
      state: "",
      message: "",
    });
  };

  React.useEffect(() => {
    const getAppList = async () => {
      const res = await jwtAPI.getAppList();
      if (res?.result) setRows(res?.result.applist);
    };
    getAppList();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleAlertClose}
        TransitionComponent={transition}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleAlertClose} severity={alert.state === "success" ? "success" : "error"}>
          {alert.message}
        </Alert>
      </Snackbar>
      {user && !showForm && (
        <Box textAlign={"right"} sx={{ mb: 1 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleNewClick}
          >
            New
          </Button>
          <LoadingButton
            loading={loadingDelete}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{ ml: 1 }}
            onClick={handleDeleteClick}
            disabled={selectionModel.length === 0 ? true : false}
          >
            Delete
          </LoadingButton>
        </Box>
      )}
      {showForm ? (
        <>
          <Typography
            fontWeight="bold"
            variant="h4"
            align="center"
            sx={{ mt: 2, mb: 4 }}
          >
            {`${newUpdate} App`}
          </Typography>
          <Grid container spacing={2} maxWidth="sm" mx={"auto"}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  label="Title"
                  variant="outlined"
                  value={formData.title}
                  disabled={newUpdate === "Edit"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                  sx={{ mb: 1 }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  variant="outlined"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  sx={{ mb: 1 }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="app-type-label">Type</InputLabel>
                <Select
                  labelId="app-type-label"
                  id="type"
                  value={formData.type}
                  label="Type"
                  onChange={(e: SelectChangeEvent) =>
                    setFormData({
                      ...formData,
                      type: e.target.value,
                    })
                  }
                >
                  <MenuItem value={"Static"}>Static</MenuItem>
                  <MenuItem value={"Dynamic"}>Dynamic</MenuItem>
                  <MenuItem value={"SPA"}>SPA</MenuItem>
                  <MenuItem value={"MPA"}>MPA</MenuItem>
                  <MenuItem value={"Animated"}>Animated</MenuItem>
                  <MenuItem value={"CMS"}>CMS</MenuItem>
                  <MenuItem value={"Ecommerce"}>Ecommerce</MenuItem>
                  <MenuItem value={"Portal"}>Portal</MenuItem>
                  <MenuItem value={"PWA"}>PWA</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Box textAlign={"center"} mt={2}>
            <Button
              sx={{ mr: 2 }}
              variant="outlined"
              startIcon={!showForm ? <AddIcon /> : ""}
              onClick={handleBackClick}
            >
              Cancel
            </Button>
            <LoadingButton
              loading={loadingSubmit}
              variant="contained"
              color="success"
              onClick={handleNewEditSubmit}
            >
              Submit
            </LoadingButton>
          </Box>
        </>
      ) : (
        <>
          <Box
            sx={{
              height: "371px",
              width: "100%",
              "& .table-theme--login": {
                cursor: "pointer",
              },
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={pageSize}
              rowsPerPageOptions={[5, 10, 20]}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              pagination
              onSelectionModelChange={(newSelectionModel) => {
                setSelectionModel(newSelectionModel);
              }}
              getRowClassName={() => (user ? "table-theme--login" : "")}
              selectionModel={selectionModel}
              checkboxSelection={user ? true : false}
              onRowClick={(params: GridRowParams) => handleAppClick(params)}
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default Home;
