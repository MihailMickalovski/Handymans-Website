import React from "react";
import { Typography, Grid } from "@mui/material";
import "./WelcomePage.css";
import Footer from "../footer/Footer";
import Navbar from "../navbar/NavBar";
import { useTranslation } from "react-i18next";

const WelcomePage = () => {
    const { t } = useTranslation(["welcome", "common"]);
    return (
        <Grid
            container
            sx={{ backgroundColor: 'black' }}
        >
            <Navbar />
            <Grid item  sm={true}  sx={{height: '475px', marginTop: '100px', width: 'inherit', display: 'flex',flexDirection:'column', alignContent: 'center'}}>
                <Typography
                    fontFamily="Bartender SmCond Serif Pressed"
                    sx={{ letterSpacing: 1, color: "#00FF00" }}
                    variant="h1"
                    textAlign="center"
                >
                    {t("common:taglinePart1")}
                </Typography>
                <Typography
                    fontFamily="Bartender SmCond Serif Pressed"
                    sx={{ letterSpacing: 1, color: "#ccc" }}
                    variant="h6"
                    textAlign="center"
                >
                    {t("common:taglinePart2")}
                </Typography>
                <Typography
                    fontFamily="Bartender SmCond Serif Pressed"
                    sx={{ letterSpacing: 1, color: "#00FF00" }}
                    variant="h1"
                    textAlign="center"
                >
                    {t("common:taglinePart3")}
                </Typography>
            </Grid>

            {/* Footer */}
            <Footer />
        </Grid>
    );
};

export default WelcomePage;
