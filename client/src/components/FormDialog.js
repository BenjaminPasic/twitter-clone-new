import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "../components/TextField";
import Comment from "./Comment";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const FormDialog = ({ handleClose, open, dialogData }) => {
  return (
    <div>
      <Dialog open={open} fullWidth>
        <DialogTitle sx={{ backgroundColor: "black" }}>Reply</DialogTitle>
        <DialogContent sx={{ backgroundColor: "black" }}>
          {dialogData ? <Comment comment={dialogData} /> : null}
          <TextField />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "black" }}>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FormDialog;