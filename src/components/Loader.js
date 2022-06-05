import React from 'react';
import {Container, Grid} from "@mui/material";

const Loader = () => {
    return (
        <Container>
            <Grid container style={{height: window.innerHeight - 50}} alignItems={"center"} justify={"center"}>
                <Grid container alignItems={"center"} direction={"column"}>
                    <div className="loader-wrapper">
                        <div className="loader">
                            <div className="loader loader-inner"></div>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Loader;