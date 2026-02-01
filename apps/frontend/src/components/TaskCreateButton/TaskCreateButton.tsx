import AddIcon from "@mui/icons-material/Add";
import {Button} from "@mui/material";

export interface IProps {
    onClick?: () => void;
}

export default function TaskCreateButton({onClick}: IProps) {
    return (
        <Button
            variant="contained"
            startIcon={<AddIcon/>}
            onClick={onClick}
        >
            Create task
        </Button>
    )
}