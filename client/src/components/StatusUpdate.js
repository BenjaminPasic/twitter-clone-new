import "../css/StatusUpdate.css";
import Button from "@mui/material/Button";

export default function StatusUpdate() {
  return (
    <div className="status-update">
      <textarea type="text" placeholder="What's on your mind?" />
      <Button variant="contained" type="submit" className="button">
        Post
      </Button>
    </div>
  );
}
