import React, { useRef, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Box, Typography, FormControlLabel, Checkbox, IconButton, ImageList, ImageListItem } from '@mui/material';
import { fetchPOST, uploadFile } from '../services/api';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Categories } from '../services/enums';
import { bannerData } from '../assets/images/banners';
import { Show } from '../services/types';

interface FormValues {
  topic: string;
  joiningDate: Dayjs | null;
  votingTime: Dayjs | null;
  maxParticipantsNumber: number | null;
  banner: string;
  creatorId: number;
}

interface ShowPayload {
    topic: string;
    joiningDate: string | null;
    votingTime: string | null;
    maxParticipantsNumber: number | null;
    banner: string;
    creatorId: number;
  }
  

interface CreateShowDialogProps {
  open: boolean;
  onClose: () => void;
  creatorId: number;
}



const CreateShowDialog: React.FC<CreateShowDialogProps> = ({ open, onClose, creatorId }) => {

    const initialValues: FormValues = {
        topic: '',
        joiningDate: null,
        votingTime: null,
        maxParticipantsNumber: null,
        banner: '',
        creatorId: creatorId
      };
    
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [helperText, setHelperText] = useState<string>('');
  const [step, setStep] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedBanner, setUploadedBanner] = useState<string | null>(null);
  const [joiningDateError, setJoiningDateError] = useState<string>('');
  const [votingTimeError, setVotingTimeError] = useState<string>('');
  const [bannerError, setBannerError] = useState<string>('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  


  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Wybrany plik:', file);
      const url = URL.createObjectURL(file);
      setUploadedBanner(url);
      setBannerFile(file);
      setFormValues(prev => ({ ...prev, banner: file.name }));
      setBannerError("");
    }
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };
  

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const category = e.target.name;
    const isChecked = e.target.checked;
    setCategories(prevCategories =>
      isChecked
        ? [...prevCategories, category]
        : prevCategories.filter(cat => cat !== category)
    );
  };

  const handleCreateShow = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    let bannerPath = formValues.banner;
    if (bannerFile) {
      try {
        bannerPath = await uploadFile(bannerFile);
      } catch (error) {
        console.error("Error uploading banner:", error);
        setError(true);
        setHelperText("Error uploading banner. Please try again.");
        return;
      }
    }
  
    const payload: ShowPayload = {
        ...formValues,
        banner: bannerPath,
        joiningDate: formValues.joiningDate ? formValues.joiningDate.toISOString() : null,
        votingTime: formValues.votingTime ? formValues.votingTime.toISOString() : null,
      };
      
  
    try {
      const newShow = await fetchPOST<ShowPayload, Show>('/shows', payload);

      console.log('Created show:', newShow);
      const showId = newShow.id;
  
      for (const category of categories) {
        await fetchPOST('/categories', { name: category, showId: showId });
      }
        
      setError(false);
      setHelperText('');
      onClose();
    } catch (error) {
      console.error('Error creating show:', error);
      setError(true);
      setHelperText('Error creating show. Please try again.');
    }
  };
  
  

  const validateStep1 = (): boolean => {
    let isValid = true;
    
    if (!formValues.topic.trim()) {
      setHelperText("Topic is required");
      isValid = false;
    } else {
      setHelperText("");
    }
    
    if (formValues.joiningDate === null) {
      setJoiningDateError("Joining deadline is required");
      isValid = false;
    } else {
      setJoiningDateError("");
    }
    
    if (formValues.votingTime === null) {
      setVotingTimeError("Voting deadline is required");
      isValid = false;
    } else {
      setVotingTimeError("");
    }
    
    if (!formValues.banner.trim()) {
      setBannerError("Banner is required");
      isValid = false;
    } else {
      setBannerError("");
    }
    
    return isValid;
  };
  
  const handleNextClick = () => {
    if (validateStep1()) {
      setStep(2);
      setError(false);
      setHelperText("");
    } else {
      setError(true);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth
      slotProps={{
        paper: { className: "h-full max-h-screen" }
      }}>
      <IconButton 
        onClick={onClose} 
        sx={{ position: 'absolute', right: 8, top: 8 }}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle
        variant="h4"
        gutterBottom
        color="secondary"
        className="flex flex-col justify-center items-center"
      >
        <div className="flex items-center">
          <AutoAwesomeIcon />
          Create New Show
          <AutoAwesomeIcon sx={{ transform: 'scaleX(-1)' }} />
        </div>
        {step === 2 && (
          <Typography variant="h5" component="div">
            Summary
          </Typography>
        )}
      </DialogTitle>
      <form onSubmit={handleCreateShow}>
        <DialogContent>
          {step === 1 ? ( 
            <>
              <div className="mb-4">
                <TextField
                  required
                  id="topic"
                  name="topic"
                  margin="dense"
                  label="Topic"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formValues.topic}
                  onChange={handleChange}
                  error={error}
                  helperText={error ? helperText : ''}
                />
              </div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="mb-4">
                    <DatePicker
                    label="Joining deadline"
                    value={formValues.joiningDate}
                    minDate={dayjs()}
                    onChange={(newValue) => {
                        setFormValues(prev => ({ ...prev, joiningDate: newValue }));
                        if (formValues.votingTime && newValue && !formValues.votingTime.isAfter(newValue)) {
                            setJoiningDateError("Joining deadline must be befour voting deadline.");
                        } else {
                            setJoiningDateError("");
                        }
                    }}
                    slotProps={{
                        textField: {
                        fullWidth: true,
                        margin: 'dense',
                        required: true,
                        className: 'w-full',
                        error: Boolean(joiningDateError),
                        helperText: joiningDateError,
                        },
                    }}
                    />
                </div>
                <div className="mb-4">
                    <DatePicker
                    label="Voting deadline"
                    value={formValues.votingTime}
                    minDate={dayjs()}
                    onChange={(newValue) => {
                        setFormValues(prev => ({ ...prev, votingTime: newValue }));
                        if (formValues.joiningDate && !newValue?.isAfter(formValues.joiningDate)) {
                        setVotingTimeError("Voting deadline must be later than joining deadline.");
                        } else {
                        setVotingTimeError("");
                        }
                    }}
                    slotProps={{
                        textField: {
                        fullWidth: true,
                        margin: 'dense',
                        required: true,
                        className: 'w-full',
                        error: Boolean(votingTimeError),
                        helperText: votingTimeError,
                        },
                    }}
                    />
                </div>
                </LocalizationProvider>

              <div className="mb-4">
                <TextField
                  id="maxParticipantsNumber"
                  name="maxParticipantsNumber"
                  margin="dense"
                  label="Max participants number"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formValues.maxParticipantsNumber || ''}
                  onChange={handleChange}
                  error={
                    formValues.maxParticipantsNumber !== null &&
                    Number(formValues.maxParticipantsNumber) <= 5
                  }
                  helperText={
                    formValues.maxParticipantsNumber !== null &&
                    Number(formValues.maxParticipantsNumber) <= 5
                      ? "Max participants number must be greater than 5"
                      : ""
                  }
                />
              </div>
              <div className="mb-4 p-1">
                <Typography variant="body1" gutterBottom color="textSecondary">
                  Select categories:
                </Typography>
                <Box className="grid grid-cols-2 gap-2">
                  {Object.values(Categories).map((category) => (
                    <FormControlLabel
                      key={category}
                      control={
                        <Checkbox
                          checked={categories.includes(category)}
                          onChange={handleCategoryChange}
                          name={category}
                        />
                      }
                      label={category}
                    />
                  ))}
                </Box>
              </div>
              <div className="mb-4 p-1">
                <Typography variant="body1" gutterBottom color={bannerError ? "error" : "textSecondary"}>
                    Select banner *:
                </Typography>
                <ImageList
                  sx={{ width: '100%', height: 300, position: 'relative', zIndex: 1 }}
                  cols={3}
                  rowHeight={164}
                >
                  {bannerData.map((item) => (
                    <ImageListItem
                    key={item.title}
                    onClick={() => {
                      setUploadedBanner(null);
                      setFormValues(prev => ({
                        ...prev,
                        banner: prev.banner === item.title ? '' : item.title,
                      }));
                      setBannerError("");
                    }}
                    sx={(theme) => ({
                      cursor: 'pointer',
                      border: formValues.banner === item.title ? `3px solid ${theme.palette.primary.main}` : 'none',
                    })}
                  >
                    <img src={item.img} alt={item.title} loading="lazy" />
                  </ImageListItem>
                  
                  ))}
                </ImageList>
                <div className="flex justify-center mt-3">
                  <Button variant="outlined" className="gap-2" onClick={handleButtonClick}>
                    Upload from device
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                </div>
                {uploadedBanner && (
                    <>
                    <Typography variant="body1" gutterBottom color="textSecondary">
                    Selected from device:
                </Typography>
                <Box className="mt-3 relative">
                    <img
                    src={uploadedBanner}
                    alt="Uploaded Banner"
                    className="w-full object-cover"
                    />
                    <IconButton
                    onClick={() => {
                        setUploadedBanner(null);
                        setFormValues(prev => ({ ...prev, banner: '' }));
                    }}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
                    }}
                    aria-label="remove image"
                    >
                    <DeleteIcon />
                    </IconButton>
                </Box>
                </>
                )}
                {bannerError && (
                <Typography variant="body2" color="error">
                    {bannerError}
                </Typography>
                )}
              </div>
            </>
          ) : (
            <>
              <Typography variant="h6" gutterBottom color="textSecondary">
                Topic: {formValues.topic}
              </Typography>
              <Typography variant="h6" gutterBottom color="textSecondary">
                Joining deadline: {formValues.joiningDate?.format('YYYY-MM-DD HH:mm')}
              </Typography>
              <Typography variant="h6" gutterBottom color="textSecondary">
                Voting deadline: {formValues.votingTime?.format('YYYY-MM-DD HH:mm')}
              </Typography>
              <Typography variant="h6" gutterBottom color="textSecondary">
                Max participants number: {formValues.maxParticipantsNumber}
              </Typography>
              <Typography variant="h6" gutterBottom color="textSecondary">
                Categories: {categories.join(', ')}
              </Typography>
              <Typography variant="h6" gutterBottom color="textSecondary">
                Banner:
              </Typography>
              <Box className="mt-2">
              {uploadedBanner ? (
                  <img
                  src={uploadedBanner}
                  alt="Uploaded Banner"
                  className="w-full object-cover"
                  />
              ) : (
                  <img
                  src={bannerData.find((item) => item.title === formValues.banner)?.img}
                  alt="Selected Banner"
                  className="w-full object-cover"
                  />
              )}
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions className="flex justify-center">
          <Box width="100%" display="flex" justifyContent="center">
            {step === 1 ? ( 
              <Button variant="contained" onClick={handleNextClick}>
                Next 
              </Button>
            ) : (
              <div className="flex gap-4">
                <Button variant="outlined" className="flex-1" onClick={() => setStep(1)}>
                  Back 
                </Button>
                <Button type="submit" variant="contained" className="flex-1">
                  Create
                </Button>
              </div>
            )}
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateShowDialog;
