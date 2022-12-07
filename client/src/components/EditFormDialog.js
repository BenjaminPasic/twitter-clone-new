import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { LoadingButton } from "@mui/lab";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import { updateUserProfile } from "../api/userApi";
import { useMutation } from "react-query";

const EditFormDialog = ({ user, handleClose, open, refetch }) => {
  const { isLoading, mutate } = useMutation(updateUserProfile, {
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const [form, setForm] = useState({
    bio: "",
    location: "",
  });
  const [formError, setFormError] = useState({
    bioError: undefined,
    locationError: undefined,
    emptyError: undefined,
  });

  const handleBioChange = (e) => {
    if (e.target.value.length < 180) {
      setForm((prevState) => ({ ...prevState, bio: e.target.value }));
    } else {
      setFormError((prevState) => ({
        ...prevState,
        bioError: "Character limit reached (180)",
      }));
    }
  };

  const handleLocationChange = (e) => {
    console.log(e.target.value.length);
    if (e.target.value.length < 32) {
      setForm((prevState) => ({ ...prevState, location: e.target.value }));
    } else {
      setFormError((prevState) => ({
        ...prevState,
        locationError: "Character limit reached (32)",
      }));
    }
  };

  const handleSubmit = () => {
    if (form.bio.length === 0 && form.location.length === 0) {
      setFormError({ emptyError: "You haven't made any changes" });
    } else {
      setFormError({
        bioError: undefined,
        emptyError: undefined,
        locationError: undefined,
      });
      mutate({ ...form, updateUserId: user.id });
    }
  };

  return (
    <div className="edit-dialog">
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ padding: "10px 100px 0 100px" }}>
          Edit Profile
        </DialogTitle>
        <DialogContent
          sx={{
            padding: "10px 100px 10px 100px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {formError.emptyError && (
            <DialogContentText sx={{ marginBottom: "3px", color: "red" }}>
              {formError.emptyError}
            </DialogContentText>
          )}
          <DialogContentText sx={{ marginBottom: "3px" }}>
            Update your bio
          </DialogContentText>
          <TextField
            sx={{ width: "300px", marginBottom: "10px" }}
            autoFocus
            id="outlined-multiline-flexible"
            label="Bio"
            multiline
            rows={3}
            value={form.bio}
            name="bio"
            size="small"
            onChange={handleBioChange}
            error={formError.bioError !== undefined ? true : false}
            helperText={formError.bioError ? formError.bioError : ""}
          />
          <DialogContentText sx={{ marginBottom: "3px" }}>
            Update your location
          </DialogContentText>
          <TextField
            autoFocus
            id="outlined-multiline-flexible"
            label="Location"
            multiline
            maxRows={4}
            size="small"
            value={form.location}
            name="location"
            onChange={handleLocationChange}
            error={formError.locationError ? true : false}
            helperText={formError.locationError ? formError.locationError : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {isLoading ? (
            <LoadingButton loading variant="outlined">
              Submit
            </LoadingButton>
          ) : (
            <Button onClick={handleSubmit}>Save</Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditFormDialog;
