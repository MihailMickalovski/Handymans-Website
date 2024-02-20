import React from "react";
import { Grid } from "@mui/material";

const Footer = () => {


    return (
        <Grid item xs={12} md={12} sm={12} textAlign="center" sx={{ my: 5 }}>
            <img
                alt='wrenchLogo'
                src="wrenchLogo.png"
                style={{ height: "243px", width: "257px" }}
            />
        </Grid>
    );
};

export default Footer;
