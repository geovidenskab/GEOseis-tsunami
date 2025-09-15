import React, { useState, useEffect } from "react";
import Header from "./Header";

const IntroductionPage = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [teamData, setTeamData] = useState({
    teamName: "",
    members: ["", "", "", ""], // Max 4 medlemmer
    dedication: false,
  });
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(30);
  const [showTimerSetup, setShowTimerSetup] = useState(false);

  // Quiz spørgsmål - kompakte og lidt sjove
  const quizQuestions = [
    {
      id: 1,
      question: "Hvad er en tsunami?",
      options: [
        "En stor bølge fra jordskælv under havet",
        "En storm med stærk vind",
        "En vulkan under vandet",
        "En meteor i havet",
      ],
      correct: 0,
      explanation:
        "En tsunami er store bølger fra jordskælv under havet - ikke bare almindelig storm!",
    },
    {
      id: 2,
      question: "Hvilke bølger rejser hurtigst gennem jorden?",
      options: [
        "P-bølger (primære)",
        "S-bølger (sekundære)",
        "Overfladebølger",
        "Alle lige hurtigt",
      ],
      correct: 0,
      explanation:
        "P-bølger er hurtigst (6 km/s) - de kommer først til stationen!",
    },
    {
      id: 3,
      question: "Hvad bruger vi tidsforskellen P-S til?",
      options: [
        "Beregne afstand til jordskælv",
        "Bestemme styrke",
        "Forudsige tsunami størrelse",
        "Finde dybde",
      ],
      correct: 0,
      explanation:
        "Tidsforskellen P-S = afstand til jordskælvet. Jo længere væk, jo større forskel!",
    },
    {
      id: 4,
      question: "Hvad måler magnitude?",
      options: [
        "Jordskælvets energi/styrke",
        "Afstand til jordskælv",
        "Dybde af jordskælv",
        "Antal døde",
      ],
      correct: 0,
      explanation:
        "Magnitude = energi og styrke. Hver enhed = 10x større amplitude!",
    },
  ];

  // Scenarier - 7 forskellige cases
  const scenarios = [
    { id: 1, title: "Scenarie 1" },
    { id: 2, title: "Scenarie 2" },
    { id: 3, title: "Scenarie 3" },
    { id: 4, title: "Scenarie 4" },
    { id: 5, title: "Scenarie 5" },
    { id: 6, title: "Scenarie 6" },
    { id: 7, title: "Scenarie 7" },
  ];

  const handleTeamMemberChange = (index, value) => {
    const newMembers = [...teamData.members];
    newMembers[index] = value;
    setTeamData({ ...teamData, members: newMembers });
  };

  const handleQuizAnswer = (questionId, answerIndex) => {
    setQuizAnswers({ ...quizAnswers, [questionId]: answerIndex });
  };

  const checkQuiz = () => {
    setQuizCompleted(true);
  };

  const spinWheel = () => {
    setWheelSpinning(true);
    setTimeout(() => {
      // Bedre tilfældig generering
      const scenarios = [1, 2, 3, 4, 5, 6, 7];
      const randomIndex = Math.floor(Math.random() * scenarios.length);
      const randomScenario = scenarios[randomIndex];
      setSelectedScenario(randomScenario);
      setWheelSpinning(false);
    }, 3000);
  };

  const proceedToMain = () => {
    const activeMembers = teamData.members.filter((m) => m.trim() !== "");
    const finalTeamData = {
      ...teamData,
      members: activeMembers,
      selectedScenario: selectedScenario,
    };
    onComplete(finalTeamData);
  };

  const renderStep1 = () => (
    <div
      style={{
        textAlign: "center",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      {/* Combined Hero and Team Registration Section */}
      <div
        style={{
          position: "relative",
          backgroundImage:
            "url('https://cdn1.internationalsos.com/-/jssmedia/main-site/t/tsunami-desktop-hero.png?h=1080&iar=0&w=1920&rev=38f38fa7af9c47c38b6a5aa77f83743d&hash=FAE8A28D19F95D14C71F2C5DBA6CF59B')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: "15px",
          marginBottom: "2rem",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          overflow: "hidden",
        }}
      >
        {/* Overlay for better text readability */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.7) 100%)",
            borderRadius: "15px",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            color: "#2c3e50",
            padding: "2rem",
          }}
        >
          {/* Hero Title */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h1
              style={{
                fontSize: "3.5rem",
                margin: "0 0 1rem 0",
                fontWeight: "700",
                letterSpacing: "-0.02em",
              }}
            >
              Teamregistrering
            </h1>
          </div>

          {/* Important Instructions */}
          <div
            className="info-box"
            style={{
              backgroundColor: "#fff3cd",
              borderColor: "#ffeaa7",
              marginBottom: "2rem",
              padding: "1.5rem",
            }}
          >
            <h3
              style={{
                margin: "0 0 1rem 0",
                color: "#856404",
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              Vigtige instruktioner før I starter
            </h3>

            <div style={{ marginBottom: "1rem" }}>
              <h4
                style={{
                  color: "#856404",
                  margin: "0 0 0.5rem 0",
                  fontSize: "1rem",
                }}
              >
                Tekniske krav:
              </h4>
              <div
                style={{
                  margin: "0 0 1rem 0",
                  color: "#856404",
                }}
              >
                <p style={{ margin: "0.5rem 0" }}>
                  <strong>Minimum 2 computere</strong> - I skal arbejde på flere
                  enheder samtidigt
                </p>
                <p style={{ margin: "0.5rem 0" }}>
                  <strong>Udleverede materialer</strong> - I har fået udleveret
                  materialer som I skal bruge
                </p>
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <h4
                style={{
                  color: "#856404",
                  margin: "0 0 0.5rem 0",
                  fontSize: "1rem",
                }}
              >
                Præcision versus hastighed:
              </h4>
              <p style={{ margin: "0 0 0.5rem 0", color: "#856404" }}>
                <strong>Hastighed:</strong> I kompendiet finder I information om
                hvor langt tsunami-bølger kan nå at rejse i forhold til jeres
                arbejdstid.
              </p>
              <p style={{ margin: "0 0 1rem 0", color: "#856404" }}>
                <strong>Præcision:</strong> Vær opmærksom på at præcisionen er
                afgørende - forkerte data kan føre til forkerte varsler med
                alvorlige konsekvenser.
              </p>
            </div>
          </div>

          {/* Team Registration Form */}
          <div
            className="info-card"
            style={{
              backgroundColor: "transparent",
              boxShadow: "none",
              border: "none",
            }}
          >
            <div className="form-group">
              <label className="form-label">Team navn:</label>
              <input
                type="text"
                className="form-input"
                value={teamData.teamName}
                onChange={(e) =>
                  setTeamData({ ...teamData, teamName: e.target.value })
                }
                placeholder="Indtast jeres team navn..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Team medlemmer (op til 4):</label>
              <div className="grid grid-2">
                {teamData.members.map((member, index) => (
                  <input
                    key={index}
                    type="text"
                    className="form-input"
                    value={member}
                    onChange={(e) =>
                      handleTeamMemberChange(index, e.target.value)
                    }
                    placeholder={`Medlem ${index + 1} navn...`}
                  />
                ))}
              </div>
            </div>

            <div
              className="info-box"
              style={{
                backgroundColor: "#e3f2fd",
                borderColor: "#bbdefb",
                padding: "1rem",
              }}
            >
              <h3
                style={{
                  margin: "0 0 0.5rem 0",
                  color: "#1565c0",
                  fontSize: "1.1rem",
                }}
              >
                Team forpligtelse
              </h3>
              <p
                style={{
                  margin: "0 0 0.5rem 0",
                  color: "#1565c0",
                  fontSize: "0.9rem",
                }}
              >
                Vi forpligter os til at arbejde sammen som et professionelt team
                og grine af lærerens far-jokes når det er nødvendigt!
              </p>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={teamData.dedication}
                  onChange={(e) =>
                    setTeamData({ ...teamData, dedication: e.target.checked })
                  }
                  style={{ marginRight: "0.5rem" }}
                />
                <span style={{ fontWeight: "bold", color: "#1565c0" }}>
                  Vi accepterer!
                </span>
              </label>
            </div>

            <div style={{ textAlign: "center" }}>
              <button
                className="btn btn-primary"
                onClick={() => setCurrentStep(2)}
                disabled={
                  !teamData.teamName.trim() ||
                  !teamData.dedication ||
                  teamData.members.every((m) => !m.trim())
                }
              >
                Fortsæt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => {
    // Calculate quiz result only once when quiz is completed
    const quizResult = quizCompleted
      ? (() => {
          let correct = 0;
          quizQuestions.forEach((q) => {
            if (quizAnswers[q.id] === q.correct) correct++;
          });
          return { correct, total: quizQuestions.length };
        })()
      : null;

    return (
      <div
        style={{
          textAlign: "center",
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "2rem",
        }}
      >
        <div className="info-card">
          <h2 className="card-title">Videnstest</h2>
          <p style={{ margin: "0 0 1rem 0", color: "#6c757d" }}>
            Test jeres viden om seismologi og tsunami-fænomener
          </p>

          <div
            style={{
              textAlign: "center",
              marginBottom: "2rem",
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            <button
              className="btn btn-secondary"
              onClick={() => setCurrentStep(3)}
            >
              Spring videnstest over
            </button>
          </div>

          {!quizCompleted ? (
            <div style={{ textAlign: "left" }}>
              {quizQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="info-box"
                  style={{ marginBottom: "1rem" }}
                >
                  <h3 style={{ margin: "0 0 1rem 0", color: "#2c3e50" }}>
                    {index + 1}. {question.question}
                  </h3>
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      style={{
                        display: "block",
                        padding: "0.75rem",
                        margin: "0.5rem 0",
                        backgroundColor:
                          quizAnswers[question.id] === optionIndex
                            ? "#e3f2fd"
                            : "#f8f9fa",
                        border: `1px solid ${
                          quizAnswers[question.id] === optionIndex
                            ? "#007bff"
                            : "#e1e5e9"
                        }`,
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        checked={quizAnswers[question.id] === optionIndex}
                        onChange={() =>
                          handleQuizAnswer(question.id, optionIndex)
                        }
                        style={{ marginRight: "0.5rem" }}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              ))}

              <div
                style={{
                  textAlign: "center",
                  marginTop: "2rem",
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                }}
              >
                <button
                  className="btn btn-primary"
                  onClick={checkQuiz}
                  disabled={
                    Object.keys(quizAnswers).length < quizQuestions.length
                  }
                >
                  Afslut videnstest
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setCurrentStep(3)}
                >
                  Spring videnstest over
                </button>
              </div>
            </div>
          ) : (
            <div
              className="info-box"
              style={{ backgroundColor: "#d4edda", borderColor: "#c3e6cb" }}
            >
              <h3 style={{ margin: "0 0 1rem 0", color: "#155724" }}>
                Videnstest afsluttet
              </h3>
              <p style={{ margin: "0 0 1rem 0", color: "#155724" }}>
                {teamData.teamName} - Resultat: {quizResult.correct} ud af{" "}
                {quizResult.total} spørgsmål korrekte
              </p>
              <div
                className="info-box"
                style={{ backgroundColor: "white", marginBottom: "1rem" }}
              >
                <p style={{ margin: "0", color: "#2c3e50" }}>
                  {quizResult.correct === quizResult.total
                    ? "Perfekt! I er klar til professionel seismisk analyse."
                    : quizResult.correct >= quizResult.total * 0.75
                    ? "Meget godt! I har solid viden om seismologi."
                    : "Godt startet! I vil udvide jeres viden undervejs."}
                </p>
              </div>

              <div style={{ marginTop: "1.5rem" }}>
                <h4 style={{ margin: "0 0 1rem 0", color: "#2c3e50" }}>
                  Detaljerede Svar
                </h4>
                {quizQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className="info-box"
                    style={{
                      backgroundColor: "#f8f9fa",
                      marginBottom: "0.75rem",
                      border: `1px solid ${
                        quizAnswers[question.id] === question.correct
                          ? "#d4edda"
                          : "#f8d7da"
                      }`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          color:
                            quizAnswers[question.id] === question.correct
                              ? "#28a745"
                              : "#dc3545",
                          marginRight: "0.5rem",
                          fontWeight: "bold",
                        }}
                      >
                        {quizAnswers[question.id] === question.correct
                          ? "Korrekt"
                          : "Forkert"}
                      </span>
                      <strong style={{ color: "#2c3e50" }}>
                        {index + 1}. {question.question}
                      </strong>
                    </div>
                    <p
                      style={{
                        color: "#6c757d",
                        margin: "0",
                        fontSize: "0.9rem",
                      }}
                    >
                      {question.explanation}
                    </p>
                  </div>
                ))}
              </div>

              <div
                style={{
                  textAlign: "center",
                  marginTop: "1.5rem",
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                }}
              >
                <button
                  className="btn btn-primary"
                  onClick={() => setCurrentStep(3)}
                >
                  Fortsæt til scenarie-valg
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setCurrentStep(3)}
                >
                  Spring til scenarie-valg
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div
      style={{
        textAlign: "center",
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <div className="info-card">
        <h2 className="card-title">Scenarie-valg</h2>
        <p style={{ margin: "0 0 1rem 0", color: "#6c757d" }}>
          Lad systemet tilfældigt vælge jeres seismiske undersøgelsescase
        </p>

        <div className="info-box">
          {!selectedScenario ? (
            <div>
              <div
                style={{
                  width: "250px",
                  height: "250px",
                  border: "4px solid #007bff",
                  borderRadius: "50%",
                  margin: "0 auto 2rem auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: wheelSpinning ? "#ffc107" : "#007bff",
                  color: "white",
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  animation: wheelSpinning ? "spin 3s linear infinite" : "none",
                  boxShadow: "0 8px 25px rgba(0,123,255,0.3)",
                }}
              >
                {wheelSpinning ? "Vælger scenarie..." : "Klik for at vælge"}
              </div>

              <button
                className="btn btn-primary"
                onClick={spinWheel}
                disabled={wheelSpinning}
              >
                {wheelSpinning ? "Vælger scenarie..." : "Vælg Scenarie"}
              </button>
            </div>
          ) : (
            <div
              className="info-box"
              style={{ backgroundColor: "#d1ecf1", borderColor: "#bee5eb" }}
            >
              <h3 style={{ margin: "0 0 1rem 0", color: "#0c5460" }}>
                Scenarie valgt
              </h3>
              <p style={{ margin: "0 0 1rem 0", color: "#0c5460" }}>
                Systemet har tilfældigt valgt jeres seismiske undersøgelsescase
              </p>

              <div
                className="info-box"
                style={{
                  backgroundColor: "white",
                  border: "2px solid #17a2b8",
                  marginBottom: "1rem",
                }}
              >
                <h4 style={{ margin: "0 0 0.5rem 0", color: "#17a2b8" }}>
                  {scenarios[selectedScenario - 1].title}
                </h4>
              </div>

              <p style={{ margin: "0 0 1rem 0", color: "#0c5460" }}>
                Dette er det seismiske eventyr I skal undersøge i detaljer med
                professionelle seismiske analysemetoder.
              </p>

              <div style={{ textAlign: "center" }}>
                <button className="btn btn-primary" onClick={proceedToMain}>
                  Start seismisk analyse
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f6fa" }}>
      <Header />
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default IntroductionPage;
