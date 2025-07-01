import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { marked } from "marked";
import Button from "./Button";

function Tutorial() {
  const [tutorialContent, setTutorialContent] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve gameId and isJoinRoute from query parameters
  const searchParams = new URLSearchParams(location.search);
  const gameId = searchParams.get("gameId");
  const isJoinRoute = searchParams.get("isJoinRoute") === "true";

  useEffect(() => {
    // Fetch the Markdown file
    fetch("/assets/CardClash_Tutorial.md")
      .then((response) => {
        if (!response.ok) throw new Error("Tutorial file not found");
        return response.text();
      })
      .then((text) => {
        const htmlContent = marked(text);
        setTutorialContent(htmlContent);
      })
      .catch((error) => {
        console.error("Error loading tutorial:", error);
        setTutorialContent(
          "<p>Error loading tutorial. Please try again later.</p>"
        );
      });
  }, []);

  const handleBackToJoin = () => {
    if (gameId) {
      navigate(isJoinRoute ? `/join/${gameId}` : `/lobby/${gameId}`);
    } else {
      navigate("/join");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white p-4">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-4">
            CARDCLASH Tutorial
          </h1>
          <div
            className="prose prose-invert text-sm sm:text-base max-w-none"
            dangerouslySetInnerHTML={{ __html: tutorialContent }}
          />
          <Button
            onClick={handleBackToJoin}
            className="w-full py-3 mt-4 text-base font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Back to Join
          </Button>
        </div>
        <footer className="mt-4 text-gray-400 text-sm">
          CARDCLASH by @muzecaka | Discord kanmiNFT
        </footer>
      </div>
    </div>
  );
}

export default Tutorial;
