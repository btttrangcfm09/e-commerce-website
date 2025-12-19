import React, { useState } from "react";
import { styled } from "@mui/system";
import Grid from "@mui/material/Grid";
import FormLabel from "@mui/material/FormLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

const Container = styled("div")(() => ({
  padding: "16px",
  marginTop: "32px",
}));

const Title = styled("h2")(() => ({
  paddingLeft: "24px",
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "24px",
}));

const ProfileGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const ButtonGroup = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  marginLeft: "32px",
}));

const PublicProfile = () => {
  const [avatar, setAvatar] = useState(
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = () => {
    setAvatar("");
  };

  return (
    <Container>
      <Title>Public Profile</Title>
      <Grid container spacing={4} maxWidth="600px" margin="0 auto">
        <ProfileGrid item xs={12} sm={6}>
          <Avatar
            alt="Profile Picture"
            src={avatar}
            sx={{
              width: 160,
              height: 160,
              border: "2px solid #4F46E5",
              marginBottom: "16px",
            }}
          />
          <ButtonGroup>
            <Button
              variant="contained"
              component="label"
              sx={{
                backgroundColor: "#202142",
                color: "white",
                "&:hover": { backgroundColor: "#161831" },
              }}
            >
              Change Picture
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleImageChange}
              />
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#202142",
                color: "#202142",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
              onClick={handleDeleteImage}
            >
              Delete Picture
            </Button>
          </ButtonGroup>
        </ProfileGrid>
        <Grid item xs={12}>
          <FormLabel required>First Name</FormLabel>
          <OutlinedInput
            placeholder="Your first name"
            fullWidth
            sx={{ marginBottom: "16px" }}
          />
          <FormLabel required>Last Name</FormLabel>
          <OutlinedInput
            placeholder="Your last name"
            fullWidth
            sx={{ marginBottom: "16px" }}
          />
          <FormLabel required>Email</FormLabel>
          <OutlinedInput
            type="email"
            placeholder="Your email"
            fullWidth
            sx={{ marginBottom: "16px" }}
          />
          <FormLabel>Profession</FormLabel>
          <OutlinedInput
            placeholder="Your profession"
            fullWidth
            sx={{ marginBottom: "16px" }}
          />
          <FormLabel>Bio</FormLabel>
          <OutlinedInput
            placeholder="Write your bio here..."
            multiline
            rows={4}
            fullWidth
            sx={{ marginBottom: "16px" }}
          />
        </Grid>
        <Grid item xs={12} textAlign="right">
          <Button
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PublicProfile;
