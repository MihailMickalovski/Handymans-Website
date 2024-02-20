import React from "react";
import { Card, Grid, Typography, Button } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./swiper.css";

const ItemCard = (props) => {
    const { menuItem, handleOpenDeleteDialog, isAdmin } = props;
    const navigate = useNavigate();
    const { t } = useTranslation(["common"]);

    const handleEdit = (menuId) => {
        navigate("/menu/add", {
            state: { edit: true, menuId: menuId, menuItem: menuItem },
        });
    };

    return (
        <Card elevation={4}>
            <Grid container>
                <Grid item xs={10} sm={10} md={10} sx={{ pl: 2, py: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                        {menuItem.name}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={12} sm={12}>
                        <Swiper className="mySwiper">
                            {menuItem.images.map((imageSrc) => (
                                <SwiperSlide key={imageSrc}>
                                    <img
                                        src={imageSrc}
                                        style={{
                                            height: "200px",
                                            width: "100%",
                                        }}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                </Grid>

                <Grid item xs={12} md={12} sm={12} sx={{ pl: 2, py: 1 }}>
                    <Button variant="contained" size="small" sx={{ mx: 1 }}>
                        ₹{menuItem.price}/-
                    </Button>

                    {/* Only if the user is admin */}
                    {isAdmin && (
                        <React.Fragment>
                            <Button
                                variant="contained"
                                size="small"
                                sx={{ backgroundColor: "#9c9828", mx: 1 }}
                            >
                                <Typography
                                    fontFamily="Bartender SmCond Serif Pressed"
                                    onClick={() => handleEdit(menuItem._id)}
                                >
                                    {t("common:edit")}
                                </Typography>
                            </Button>
                            <Button
                                variant="contained"
                                size="small"
                                sx={{ backgroundColor: "#962721", mx: 1 }}
                            >
                                <Typography
                                    fontFamily="Bartender SmCond Serif Pressed"
                                    onClick={() =>
                                        handleOpenDeleteDialog(menuItem._id)
                                    }
                                >
                                    {t("common:delete")}
                                </Typography>
                            </Button>
                        </React.Fragment>
                    )}
                </Grid>

                <Grid item xs={12} md={12} sm={12} sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2">
                        {`${menuItem.description.slice(0, 120)}...`}
                    </Typography>
                </Grid>
            </Grid>
        </Card>
    );
};

export default ItemCard;
