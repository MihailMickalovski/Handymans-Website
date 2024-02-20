import React, { useState, useEffect } from "react";
import {
    Grid,
    Card,
    Typography,
    Button,
    FormControl,
    Divider,
    Chip,
    FormGroup,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import TextInput from "../shared/TextInput";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import axios from "axios";
import { useSnackbar } from "notistack";
import "./MenuForm.css";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../navbar/NavBar";
import HelperText from "../shared/HelperText";
import { useTranslation } from "react-i18next";

const initialFormValues = {
    name: "",
    description: "",
    category: "",
    price: "",
    available: false,

};


const MenuForm = () => {
    const [formValues, setFormValues] = useState(initialFormValues);
    const [formErrors, setFormErrors] = useState({});
    const [hasErrors, setHasErrors] = useState(true);

    const [categoryList, setCategoryList] = useState([]);

    const [allImages, setAllImages] = useState([]);
    const [editMode, setEditMode] = useState(false);

    const { enqueueSnackbar } = useSnackbar();
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation(["item", "home", "common"]);

    const fetchAllCategories = () => {
        axios
            .get(`http://localhost:5001/category/all`)
            .then((response) => {
                setCategoryList(response.data.categories);
            })
            .catch((err) => {
                console.log("Error loading categories!", err?.response);
            });
    };

    const verifyCurrentUser = async () => {
        try {
            let response = await axios.get(
                `http://localhost:5001/user/auth/currentuser`,
                {
                    headers: {
                        authorization: window.localStorage.getItem("bearer"),
                    },
                }
            );
            if (!response.data.user.is_admin) {
                enqueueSnackbar("Unauthorized access", { variant: "warning" });
                return navigate("/home");
            }
            return;
        } catch (error) {
            console.error("Error fetching current user in home:", error);
            enqueueSnackbar("Please login to view home page!", {
                variant: "error",
            });
            return navigate("/login");
        }
    };

    useEffect(() => {
        verifyCurrentUser();
        fetchAllCategories();

        // If form is opened for editing
        if (location.state === null) {
            return;
        }

        let { edit, menuItem } = location.state;
        setEditMode(edit ?? false);
        setFormValues({ ...(menuItem ?? initialFormValues) });
    }, []);

    const validateInputs = (name, value) => {
        if ((name === "name" || name === "description") && value.length < 3) {
            return `Invalid ${name}`;
        }

        if (
            (name === "price") &&
            (!/[0-9]/i.test(value) || parseFloat(value) < 0)
        ) {
            return `Invalid ${name}`;
        }

        if (name === "value" && value.length === 0) {
            return `Invalid ${name}`;
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormValues({
            ...formValues,
            [name]: value,
        });

        setFormErrors({
            ...formErrors,
            [name]: validateInputs(name, value),
        });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;

        setFormValues({
            ...formValues,
            [name]: checked,
        });
    };

    useEffect(() => {
        setHasErrors(Object.keys(formErrors).some((key) => !!formErrors[key]));
    }, [formErrors]);

    const handleUploadChange = (e) => {
        let { name, value, files } = e.target;

        const imagesFormData = new FormData();
        Object.keys(files).map((key) => {
            imagesFormData.append("itemImage", files[key]);
        });

        axios
            .post(`http://localhost:5001/upload/cache`, imagesFormData, {
                headers: {
                    "Content-type": "multipart/form-data",
                    authorization: window.localStorage.getItem("bearer"),
                },
            })
            .then((response) => {
                let someArr = [];

                Object.keys(files).forEach((key, idx) => {
                    let tempList2 = {};
                    tempList2 = {
                        fileData: files[key],
                        filename: files[key].name,
                        cacheFile: response.data.filesNames[idx],
                    };
                    someArr.push(tempList2);
                    
                    if (
                        Object.keys(someArr).length ===
                        response.data.filesNames.length
                    ) {
                        setAllImages([...allImages, ...someArr]);
                    }
                });
            })
            .catch((error) => {
                console.error("Error from cache upload:", error?.response);
            });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (editMode) {
            axios
                .put(
                    `http://localhost:5001/menu/edit/${formValues._id}`,
                    {
                        ...formValues,
                        images: allImages.map((file) => file.cacheFile),
                        existingImages: [...formValues.images],
                    },
                    {
                        headers: {
                            authorization:
                                window.localStorage.getItem("bearer"),
                        },
                    }
                )
                .then((editResp) => {
                    enqueueSnackbar("Menu item edited successfully!", {
                        variant: "success",
                    });
                    return navigate("/home");
                })
                .catch((editErr) => {
                    console.error("Error in Edit:", editErr?.response?.data);
                    return enqueueSnackbar(
                        editErr?.response?.data?.message ??
                            "Please try again in a while!",
                        { variant: "error" }
                    );
                });
        } else {
            axios
                .post(
                    `http://localhost:5001/menu/add`,
                    {
                        ...formValues,
                        images: allImages.map((file) => file.cacheFile),
                    },
                    {
                        headers: {
                            authorization:
                                window.localStorage.getItem("bearer"),
                        },
                    }
                )
                .then((response) => {
                    enqueueSnackbar("Menu item added successfully!", {
                        variant: "success",
                    });
                    return navigate("/home");
                })
                .catch((err) => {
                    console.error(
                        "Error in adding menu item:",
                        err?.response?.data
                    );
                    return enqueueSnackbar(
                        err?.response?.data?.message ??
                            "Please try again in a while!",
                        { variant: "error" }
                    );
                });
        }
    };

    const handleImageDelete = (idx, mode = 0) => {
        if (mode === 0) {
            let tempImages = allImages;
            tempImages.splice(idx, 1);
            setAllImages([...tempImages]);
        } else {
            let tempImages = formValues.images;
            tempImages.splice(idx, 1);
            setFormValues({
                ...formValues,
                images: [...tempImages],
            });
        }
    };

    return (
        <Grid container>
            <Navbar />
            <Grid item xs={12} md={12} sm={12} my={1} sx={{ px: 2 }}>
                <Typography
                    variant="h4"
                    fontFamily="Bebas Neue"
                    textAlign="center"
                >
                    {editMode
                        ? t("item:formTitleEdit")
                        : t("item:formTitleAdd")}
                </Typography>
                <Divider sx={{ my: 1 }}>
                    <Chip label={t("item:formSubtitle")} />
                </Divider>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
                <form method="POST" onSubmit={handleFormSubmit}>
                    {/* Main Form */}
                    <Grid container>
                        <Grid item xs={2} md={2} sm={2}></Grid>
                        <Grid item xs={8} md={8} sm={8} my={2} sx={{ px: 2 }}>
                            <FormControl fullWidth sx={{ my: 1 }}>
                                <TextInput
                                    placeholder={t("item:itemName")}
                                    label={t("item:itemName")}
                                    name="name"
                                    value={formValues.name}
                                    onChange={handleInputChange}
                                    error={!!formErrors.name}
                                />
                                <HelperText text={formErrors?.name} />
                            </FormControl>
                            <FormControl fullWidth sx={{ my: 1 }}>
                                <TextInput
                                    placeholder={t("item:description")}
                                    label={t("item:description")}
                                    name="description"
                                    value={formValues.description}
                                    onChange={handleInputChange}
                                    error={!!formErrors.description}
                                />
                                <HelperText text={formErrors?.description} />
                            </FormControl>

                            <FormControl fullWidth sx={{ my: 1 }}>
                                <TextInput
                                    placeholder={t("item:price")}
                                    label={t("item:price")}
                                    name="price"
                                    type="number"
                                    value={formValues.price}
                                    onChange={handleInputChange}
                                    error={!!formErrors.price}
                                />
                                <HelperText text={formErrors?.price} />
                            </FormControl>

                            <Divider sx={{ my: 1 }} />

                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formValues.available}
                                        />
                                    }
                                    name="available"
                                    label={t("home:available")}
                                    onChange={handleCheckboxChange}
                                />
                            </FormGroup>

                            <Divider sx={{ my: 1 }} />

                            {/* Images section */}
                            <Typography variant="h6" my={1}>
                                {t("item:images")}
                            </Typography>

                            <input
                                id="itemImagesUploadInput"
                                type="file"
                                accept=".png, .jpg, .jpeg"
                                style={{ visibility: "hidden" }}
                                multiple={true}
                                onChange={handleUploadChange}
                            />

                            <Button
                                variant="outlined"
                                onClick={() =>
                                    document
                                        .getElementById("itemImagesUploadInput")
                                        .click()
                                }
                            >
                                <CameraAltRoundedIcon />
                            </Button>

                            <Grid container>
                                {editMode &&
                                    formValues?.images?.map((imageUrl, idx) => (
                                        <Card
                                            className="container"
                                            key={idx}
                                            elevation={3}
                                            sx={{ m: 2 }}
                                        >
                                            <img
                                                src={imageUrl}
                                                key={idx}
                                                className="uploadedImage"
                                                style={{
                                                    height: "200px",
                                                    width: "200px",
                                                }}
                                            />
                                            <div className="overlay">
                                                <Button
                                                    className="text"
                                                    size="large"
                                                    sx={{ fontSize: "30px" }}
                                                    onClick={() =>
                                                        handleImageDelete(
                                                            idx,
                                                            1
                                                        )
                                                    }
                                                >
                                                    ❌
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                {allImages.map((imageData, idx) => (
                                    <Card
                                        className="container"
                                        key={idx}
                                        elevation={3}
                                        sx={{ m: 2 }}
                                    >
                                        <img
                                            src={URL.createObjectURL(
                                                imageData.fileData
                                            )}
                                            key={idx}
                                            className="uploadedImage"
                                            style={{
                                                height: "200px",
                                                width: "200px",
                                            }}
                                        />
                                        <div className="overlay">
                                            <Button
                                                className="text"
                                                size="large"
                                                sx={{ fontSize: "30px" }}
                                                onClick={() =>
                                                    handleImageDelete(idx, 0)
                                                }
                                            >
                                                ❌
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </Grid>

                            <Divider sx={{ my: 1 }} />
                        </Grid>
                        <Grid item xs={2} md={2} sm={2}></Grid>

                        <Grid
                            item
                            xs={12}
                            md={12}
                            sm={12}
                            sx={{ mt: 2, mb: 2 }}
                            textAlign="center"
                        >
                            <Button
                                variant="contained"
                                sx={{ mx: 2 }}
                                size="large"
                                type="submit"
                                disabled={hasErrors}
                            >
                                {t(
                                    `common:${(editMode
                                        ? "Edit"
                                        : "Add"
                                    ).toLowerCase()}`
                                )}
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ mx: 2 }}
                                size="large"
                                onClick={() => navigate("/home")}
                            >
                                {t("common:cancel")}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    );
};

export default MenuForm;
