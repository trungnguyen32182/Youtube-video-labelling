"use client";
import React from "react";
import Link from "next/link";

const ScrollToTopButton = () => {
    return (
      <div className=" right-5 top-5">
        <Link href="#">
            <button className="scroll-to-top">^</button>
        </Link>
      </div>
    );
};

export default ScrollToTopButton;
