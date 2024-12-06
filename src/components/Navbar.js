import React from "react";
import { Button, Flex } from "@adobe/react-spectrum";

const Navbar = ({ resetToBookingPage, setIsBusinessPage, setIsBusinessOverviewPage, showButtons = true }) => {
  return (
    <nav className="navbar">
      <div className="logo" onClick={resetToBookingPage} style={{ cursor: "pointer" }}>
        Timy
      </div>
      {showButtons && (
        <Flex direction="row" alignItems="center" gap="size-200">
          <Button variant="primary" className="business-button" onPress={() => setIsBusinessPage(true)}>
            For business
          </Button>
          <Button variant="primary" className="customer-button" onPress={resetToBookingPage}>
            Customer
          </Button>
          <Button variant="primary" className="overview-button" onPress={() => setIsBusinessOverviewPage(true)}>
            Business Overview
          </Button>
        </Flex>
      )}
    </nav>
  );
};

export default Navbar;
