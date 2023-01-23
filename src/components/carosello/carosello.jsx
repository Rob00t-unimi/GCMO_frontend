import React from "react";
import { Carousel } from "react-bootstrap";

export default function Carosello(){

    return (
        <Carousel>
            <Carousel.Item interval={2000}></Carousel.Item>
            <Carousel.Item interval={1000}></Carousel.Item>
        </Carousel>
    )
    
}