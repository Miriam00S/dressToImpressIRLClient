import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import { FormEvent, useRef, useState } from "react";
import defaultImage from "../assets/images/defaultStyling.png";
import { Show, Styling, User } from "../services/types";
import { fetchPOST, uploadFile } from "../services/api";

interface FormValues {
    name: string;
    description: string;
    photo: string;
}

interface Payload {
    name: string;
    description: string;
    photo: string;
    showId: number;
    userId: number;
}

interface JoinShowDialogProps {
    open: boolean;
    onClose: () => void;
    show: Show;
    user: User
}

const JoinShowDialog: React.FC<JoinShowDialogProps> = ({ open, onClose, show, user }) => {
    const initialValues: FormValues = {
        name: '',
        description: '',
        photo: ''
    };

    const [formValues, setFormValues] = useState<FormValues>(initialValues);
    const [error, setError] = useState<boolean>(false);
    const [photoError, setPhotoError] = useState<string>('');
    const [helperText, setHelperText] = useState<string>('');
    const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(defaultImage);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement>(null);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setUploadedPhoto(url);
            setPhotoFile(file);
            setFormValues((prev) => ({ ...prev, photo: file.name }));
            setPhotoError('');
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmitStyling = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting || !validate()) return;

        setIsSubmitting(true); // Block form submission during processing
        setError(false);
        setHelperText("");

        console.log('twice')

        let photoPath = formValues.photo;
        if (photoFile) {
            try {
                photoPath = await uploadFile(photoFile);
            } catch (error) {
                console.error("Error uploading photo:", error);
                setError(true);
                setHelperText("Error uploading photo. Please try again.");
                setIsSubmitting(false);
                return;
            }
        }

        if (user && user.id) {
            const payload: Payload = {
                name: formValues.name,
                description: formValues.description,
                photo: photoPath,
                showId: show.id,
                userId: user.id
            };

            try {
                const newStyling = await fetchPOST<Payload, Styling>('/shows/stylings', payload);
                console.log('Created styling:', newStyling);

                setError(false);
                setHelperText('');
                onClose();
            } catch (error) {
                console.error('Error creating styling:', error);
                setError(true);
                setHelperText('Error creating styling. Please try again.');
            } finally {
                setIsSubmitting(false); // Unblock the form after submission
            }
        } else {
            setError(true);
            setHelperText('Error creating styling. Please try again.');
            setIsSubmitting(false); // Unblock the form after error
        }
    };

    const validate = (): boolean => {
        let isValid = true;

        if (!formValues.name.trim()) {
            setHelperText("Name is required");
            isValid = false;
        } else {
            setHelperText("");
        }

        if (!formValues.photo.trim()) {
            setPhotoError("Styling is required");
            isValid = false;
        } else {
            setPhotoError("");
        }

        return isValid;
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth slotProps={{ paper: { className: "h-full max-h-screen" } }}>
            <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }} aria-label="close">
                <CloseIcon />
            </IconButton>
            <DialogTitle variant="h4" gutterBottom color="secondary" className="flex flex-col justify-center items-center">
                <div className="flex items-center">
                    <CheckroomIcon />
                    Join Show
                    <CheckroomIcon sx={{ transform: 'scaleX(-1)' }} />
                </div>
            </DialogTitle>
            <div className="mx-6">
                <Typography variant="h6" gutterBottom>
                    Topic: {show.topic}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Joining deadline: {show.joiningDate}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Voting deadline: {show.votingTime}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Participants: {show.stylings.length}
                </Typography>
            </div>
            <form onSubmit={handleSubmitStyling} noValidate>
                <DialogContent>
                    <div className="mb-4">
                        <TextField
                            required
                            id="name"
                            name="name"
                            margin="dense"
                            label="Name of outfit"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={formValues.name}
                            onChange={handleChange}
                            error={error}
                            helperText={error ? helperText : ''}
                        />
                    </div>
                    <div className="mb-4">
                        <TextField
                            id="description"
                            name="description"
                            margin="dense"
                            label="Description"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={formValues.description}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4 p-1">
                        <Typography variant="body1" gutterBottom color={photoError ? "error" : "textSecondary"}>
                            Styling *:
                        </Typography>
                        <div className="relative flex justify-center items-center">
                            <div className="relative group">
                                <img
                                    src={uploadedPhoto || defaultImage}
                                    alt="Selected styling"
                                    className="w-60 h-80 object-cover rounded-lg transition duration-300 group-hover:opacity-50"
                                />
                                <div className="absolute inset-0 flex justify-center items-center transition-opacity duration-300 group-hover:opacity-100" style={{ top: '80%' }}>
                                    <Button variant="outlined" color="primary" onClick={handleButtonClick}>
                                        Upload from device
                                    </Button>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                        {photoError && <Typography variant="body2" color="error">{photoError}</Typography>}
                    </div>
                </DialogContent>
                <DialogActions className="flex justify-center">
                    <Box width="100%" display="flex" justifyContent="center">
                        <Button type="submit" variant="contained" disabled={isSubmitting}>
                            Submit styling
                        </Button>
                    </Box>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default JoinShowDialog;
