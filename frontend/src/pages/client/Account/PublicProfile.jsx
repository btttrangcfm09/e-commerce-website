import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import Grid from "@mui/material/Grid";
import FormLabel from "@mui/material/FormLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import {
  deleteMyProfileImage,
  getMyProfile,
  updateMyProfile,
  uploadMyProfileImage,
} from "@/services/profile";

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
  const fallbackAvatar =
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60";

  const [avatar, setAvatar] = useState("");
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    profession: "",
    bio: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    // 1) Pre-fill nhanh từ localStorage profile (lúc login trả về)
    const cached = localStorage.getItem("profile");
    if (cached) {
      try {
        const p = JSON.parse(cached);
        setForm((prev) => ({
          ...prev,
          username: p?.username || "",
          firstName: p?.firstName || "",
          lastName: p?.lastName || "",
          email: p?.email || "",
        }));
        setAvatar(p?.image || "");
      } catch {
        // ignore
      }
    }

    // 2) Lấy profile thật từ backend (source of truth)
    (async () => {
      try {
        setIsLoading(true);
        setStatus({ type: "", message: "" });
        const p = await getMyProfile();
        setForm((prev) => ({
          ...prev,
          username: p?.username || "",
          firstName: p?.firstName || "",
          lastName: p?.lastName || "",
          email: p?.email || "",
        }));
        setAvatar(p?.image || "");
        localStorage.setItem("profile", JSON.stringify(p));
      } catch (e) {
        setStatus({
          type: "error",
          message: e?.response?.data?.message || e?.message || "Không tải được profile",
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStatus({ type: "", message: "" });
      setIsLoading(true);
      // optimistic preview
      setAvatar(URL.createObjectURL(file));
      uploadMyProfileImage(file)
        .then((p) => {
          setAvatar(p?.image || "");
          localStorage.setItem("profile", JSON.stringify(p));
        })
        .catch((err) => {
          setStatus({
            type: "error",
            message: err?.response?.data?.message || err?.message || "Upload ảnh thất bại",
          });
        })
        .finally(() => setIsLoading(false));
    }
  };

  const handleDeleteImage = () => {
    setStatus({ type: "", message: "" });
    setIsLoading(true);
    deleteMyProfileImage()
      .then((p) => {
        setAvatar("");
        localStorage.setItem("profile", JSON.stringify(p));
      })
      .catch((err) => {
        setStatus({
          type: "error",
          message: err?.response?.data?.message || err?.message || "Xóa ảnh thất bại",
        });
      })
      .finally(() => setIsLoading(false));
  };

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      setStatus({ type: "", message: "" });
      setIsLoading(true);

      // Backend hiện support các field này. (profession/bio đang chỉ là UI, chưa có cột DB)
      const p = await updateMyProfile({
        username: form.username,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
      });

      localStorage.setItem("profile", JSON.stringify(p));
    } catch (e) {
      setStatus({
        type: "error",
        message: e?.response?.data?.message || e?.message || "Lưu profile thất bại",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Title>Public Profile</Title>
      <Grid container spacing={4} maxWidth="600px" margin="0 auto">
        {status.message ? (
          <Grid item xs={12}>
            <div
              style={{
                fontSize: 14,
                color: status.type === "error" ? "#b91c1c" : "#166534",
              }}
            >
              {status.message}
            </div>
          </Grid>
        ) : null}
        <ProfileGrid item xs={12} sm={6}>
          <Avatar
            alt="Profile Picture"
            src={avatar || fallbackAvatar}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
            value={form.firstName}
            onChange={handleChange("firstName")}
          />
          <FormLabel required>Last Name</FormLabel>
          <OutlinedInput
            placeholder="Your last name"
            fullWidth
            sx={{ marginBottom: "16px" }}
            value={form.lastName}
            onChange={handleChange("lastName")}
          />
          <FormLabel>User Name</FormLabel>
          <OutlinedInput
            placeholder="Your username"
            fullWidth
            sx={{ marginBottom: "16px" }}
            value={form.username}
            onChange={handleChange("username")}
          />
          <FormLabel required>Email</FormLabel>
          <OutlinedInput
            type="email"
            placeholder="Your email"
            fullWidth
            sx={{ marginBottom: "16px" }}
            value={form.email}
            onChange={handleChange("email")}
          />
          {/* <FormLabel>Profession</FormLabel>
          <OutlinedInput
            placeholder="Your profession"
            fullWidth
            sx={{ marginBottom: "16px" }}
            value={form.profession}
            onChange={handleChange("profession")}
          /> */}
          <FormLabel>Bio</FormLabel>
          <OutlinedInput
            placeholder="Write your bio here..."
            multiline
            rows={4}
            fullWidth
            sx={{ marginBottom: "16px" }}
            value={form.bio}
            onChange={handleChange("bio")}
          />
        </Grid>
        <Grid item xs={12} textAlign="right">
          <Button
            variant="contained"
            color="primary"
            disabled={isLoading}
            onClick={handleSave}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PublicProfile;
