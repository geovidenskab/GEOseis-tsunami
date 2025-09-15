import React, { useState } from "react";
import Header from "./components/Header";
import GeoTsunamiWatch from "./components/GeoTsunamiWatch";
import IntroductionPage from "./components/IntroductionPage";

function App() {
  const [teamData, setTeamData] = useState(null);
  const [showIntroduction, setShowIntroduction] = useState(true);

  const handleIntroductionComplete = (data) => {
    setTeamData(data);
    setShowIntroduction(false);
  };

  const handleBackToIntroduction = () => {
    setShowIntroduction(true);
    setTeamData(null);
  };

  const handleBackToPrevious = () => {
    // This will be handled by GeoTsunamiWatch component
    // We need to pass this function to GeoTsunamiWatch
  };

  return (
    <div className="geoseis-app">
      {!showIntroduction && <Header onBackToIntro={handleBackToIntroduction} />}
      <main className="main-content">
        {showIntroduction ? (
          <IntroductionPage onComplete={handleIntroductionComplete} />
        ) : (
          <GeoTsunamiWatch teamData={teamData} />
        )}
      </main>
    </div>
  );
}

export default App;
