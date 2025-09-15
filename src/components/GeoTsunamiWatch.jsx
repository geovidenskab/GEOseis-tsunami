import React, { useState, useEffect } from "react";

const GeoTsunamiWatch = ({ teamData }) => {
  const [activePhase, setActivePhase] = useState(1);
  const [groupName, setGroupName] = useState(teamData?.teamName || "");
  const [scenario, setScenario] = useState(teamData?.selectedScenario || "");
  const [startTime, setStartTime] = useState("");
  const [expandedFormulas, setExpandedFormulas] = useState({
    magnitude: false,
    distance: false,
  });

  // Simple deadline state
  const [deadlineMinutes, setDeadlineMinutes] = useState(45);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isCountdownActive, setIsCountdownActive] = useState(false);

  // Communication state
  const [showCommunication, setShowCommunication] = useState(false);

  // Checkbox states for considerations
  const [checkedConsiderations, setCheckedConsiderations] = useState({});

  // Phase 3 dropdown states
  const [magnitudeRisk, setMagnitudeRisk] = useState("");
  const [depthRisk, setDepthRisk] = useState("");
  const [locationRisk, setLocationRisk] = useState("");
  const [faultTypeRisk, setFaultTypeRisk] = useState("");

  // Phase 1 - Seismic Analysis
  const [stations, setStations] = useState([
    {
      id: "A",
      name: "",
      lat: "",
      lon: "",
      pTime: "",
      sTime: "",
      amplitude: "",
      spTime: 0,
      distance: 0,
      magnitude: 0,
      useCustomDistance: false,
      customDistance: "",
      isAdvancedCalculation: false,
      timeUncertainty: "",
      distanceUncertainty: 0,
      magnitudeUncertainty: 0,
    },
    {
      id: "B",
      name: "",
      lat: "",
      lon: "",
      pTime: "",
      sTime: "",
      amplitude: "",
      spTime: 0,
      distance: 0,
      magnitude: 0,
      useCustomDistance: false,
      customDistance: "",
      isAdvancedCalculation: false,
      timeUncertainty: "",
      distanceUncertainty: 0,
      magnitudeUncertainty: 0,
    },
    {
      id: "C",
      name: "",
      lat: "",
      lon: "",
      pTime: "",
      sTime: "",
      amplitude: "",
      spTime: 0,
      distance: 0,
      magnitude: 0,
      useCustomDistance: false,
      customDistance: "",
      isAdvancedCalculation: false,
      timeUncertainty: "",
      distanceUncertainty: 0,
      magnitudeUncertainty: 0,
    },
    {
      id: "D",
      name: "",
      lat: "",
      lon: "",
      pTime: "",
      sTime: "",
      amplitude: "",
      spTime: 0,
      distance: 0,
      magnitude: 0,
      useCustomDistance: false,
      customDistance: "",
      isAdvancedCalculation: false,
      timeUncertainty: "",
      distanceUncertainty: 0,
      magnitudeUncertainty: 0,
    },
  ]);

  // Phase 2 - Epicenter
  const [epicenter, setEpicenter] = useState({
    lat: "",
    lon: "",
    quality: "",
    location: "",
    distanceToCoast: "",
  });
  const [extraInfo, setExtraInfo] = useState({
    depth: "",
    faultType: "",
    oceanDepth: "",
    historicalData: "",
  });

  // Phase 3 - Risk Assessment
  const [riskScores, setRiskScores] = useState({
    magnitude: 0,
    depth: 0,
    location: 0,
    faultType: 0,
  });

  const [decision, setDecision] = useState({
    level: "",
    warning: false,
    justification: "",
    area: "",
  });

  useEffect(() => {
    const now = new Date();
    setStartTime(now.toTimeString().slice(0, 5));
  }, []);

  const calculateDistance = (spTime) => {
    return spTime * 8.1 - 5.0; // More precise formula from your materials
  };

  const calculateMagnitude = (amplitude, distance) => {
    if (!amplitude || !distance) return 0;
    return Math.log10(amplitude) + 1.66 * Math.log10(distance) + 1.6;
  };

  // Function to add a new station
  const addStation = () => {
    const newStationId = String.fromCharCode(65 + stations.length); // A, B, C, D, E, F, etc.
    const newStation = {
      id: newStationId,
      name: "",
      lat: "",
      lon: "",
      pTime: "",
      sTime: "",
      amplitude: "",
      spTime: 0,
      distance: 0,
      magnitude: 0,
      useCustomDistance: false,
      customDistance: "",
      isAdvancedCalculation: false,
      timeUncertainty: "",
      distanceUncertainty: 0,
      magnitudeUncertainty: 0,
    };
    setStations((prev) => [...prev, newStation]);
  };

  // Function to remove a station
  const removeStation = (stationId) => {
    if (stations.length > 1) {
      // Keep at least one station
      setStations((prev) => prev.filter((station) => station.id !== stationId));
    }
  };

  const updateStation = (stationId, field, value) => {
    setStations((prev) =>
      prev.map((station) => {
        if (station.id === stationId) {
          const updated = { ...station, [field]: value };

          // Auto-calculate derived values
          if (field === "pTime" || field === "sTime") {
            const pTime = parseFloat(field === "pTime" ? value : station.pTime);
            const sTime = parseFloat(field === "sTime" ? value : station.sTime);
            if (!isNaN(pTime) && !isNaN(sTime)) {
              updated.spTime = sTime - pTime;
              // Only auto-calculate distance if not using custom distance
              if (!updated.useCustomDistance) {
                const distanceResult = calculateAdvancedDistance(
                  updated.spTime
                );
                updated.distance = distanceResult.distance;
                updated.isAdvancedCalculation = distanceResult.isAdvanced;
              }
              // Calculate uncertainties
              calculateUncertainties(updated);
            }
          }

          // Handle time uncertainty input
          if (field === "timeUncertainty") {
            updated.timeUncertainty = value;
            calculateUncertainties(updated);
          }

          // Handle custom distance
          if (field === "customDistance") {
            const customDist = parseFloat(normalizeDecimalInput(value));
            if (!isNaN(customDist) && updated.useCustomDistance) {
              updated.distance = customDist;
            }
          }

          // Handle toggle between auto and custom distance
          if (field === "useCustomDistance") {
            if (value === true) {
              // Switch to custom distance - keep current distance as custom
              updated.customDistance = updated.distance.toString();
              updated.isAdvancedCalculation = false; // Custom distance doesn't use advanced calculation
            } else {
              // Switch to auto calculation
              const pTime = parseFloat(updated.pTime);
              const sTime = parseFloat(updated.sTime);
              if (!isNaN(pTime) && !isNaN(sTime)) {
                updated.spTime = sTime - pTime;
                const distanceResult = calculateAdvancedDistance(
                  updated.spTime
                );
                updated.distance = distanceResult.distance;
                updated.isAdvancedCalculation = distanceResult.isAdvanced;
              }
            }
          }

          if (
            (field === "amplitude" || updated.distance > 0) &&
            updated.amplitude &&
            updated.distance
          ) {
            updated.magnitude = calculateMagnitude(
              parseFloat(updated.amplitude),
              updated.distance
            );
          }

          return updated;
        }
        return station;
      })
    );
  };

  const getAverageMagnitude = () => {
    const magnitudes = stations
      .map((station) => station.magnitude)
      .filter((mag) => mag > 0);

    return magnitudes.length > 0
      ? (magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length).toFixed(1)
      : "0.0";
  };

  const calculateTotalRiskScore = () => {
    return Object.values(riskScores).reduce((sum, score) => sum + score, 0);
  };

  const getDecisionLevel = (score) => {
    if (score >= 10)
      return {
        level: "RØDT ALARM",
        color: "text-red-600",
        bg: "bg-red-50 border-red-200",
        desc: "Øjeblikkelig regional tsunamivarsel",
      };
    if (score >= 7)
      return {
        level: "ORANGE ALARM",
        color: "text-orange-600",
        bg: "bg-orange-50 border-orange-200",
        desc: "Lokal tsunamivarsel og overvågning",
      };
    if (score >= 4)
      return {
        level: "GUL ADVARSEL",
        color: "text-yellow-600",
        bg: "bg-yellow-50 border-yellow-200",
        desc: "Øget overvågning, ingen varsel endnu",
      };
    if (score >= 1)
      return {
        level: "GRØN OVERVÅGNING",
        color: "text-green-600",
        bg: "bg-green-50 border-green-200",
        desc: "Fortsæt normal overvågning",
      };
    return {
      level: "INGEN RISIKO",
      color: "text-green-600",
      bg: "bg-green-50 border-green-200",
      desc: "Ingen tsunamirisiko",
    };
  };

  const updateRiskScore = (category, value) => {
    setRiskScores((prev) => ({ ...prev, [category]: parseInt(value) }));
  };

  const toggleFormula = (formulaType) => {
    setExpandedFormulas((prev) => ({
      ...prev,
      [formulaType]: !prev[formulaType],
    }));
  };

  // Simple countdown effect
  useEffect(() => {
    if (!isCountdownActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (!prev) return null;

        const newSeconds = prev.seconds - 1;

        if (newSeconds < 0) {
          const newMinutes = prev.minutes - 1;
          if (newMinutes < 0) {
            // Time's up!
            setIsCountdownActive(false);
            return { minutes: 0, seconds: 0, total: 0 };
          }
          return {
            minutes: newMinutes,
            seconds: 59,
            total: newMinutes * 60 + 59,
          };
        }

        const total = prev.minutes * 60 + newSeconds;
        return { minutes: prev.minutes, seconds: newSeconds, total };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCountdownActive]);

  const startCountdown = () => {
    if (deadlineMinutes > 0) {
      setTimeLeft({
        minutes: deadlineMinutes,
        seconds: 0,
        total: deadlineMinutes * 60,
      });
      setIsCountdownActive(true);
    }
  };

  const stopCountdown = () => {
    setIsCountdownActive(false);
    setTimeLeft(null);
  };

  // Helper function to normalize decimal input (handle both comma and dot)
  const normalizeDecimalInput = (value) => {
    if (typeof value === "string") {
      // Replace comma with dot for consistent decimal handling
      return value.replace(",", ".");
    }
    return value;
  };

  // Helper function to format decimal for display (use comma for Danish users)
  const formatDecimalForDisplay = (value) => {
    if (typeof value === "string" || typeof value === "number") {
      return String(value).replace(".", ",");
    }
    return value;
  };

  // Advanced distance calculation that accounts for varying P and S wave velocities
  const calculateAdvancedDistance = (spTime) => {
    if (!spTime || spTime <= 0) return { distance: 0, isAdvanced: false };

    // Simple formula for short distances (what students see)
    const simpleDistance = calculateDistance(spTime);

    // Advanced calculation for longer distances
    // This accounts for:
    // - Varying P and S wave velocities with depth
    // - Earth's curvature effects
    // - More accurate travel time curves

    if (simpleDistance < 500) {
      // Use simple formula for short distances
      return { distance: simpleDistance, isAdvanced: false };
    } else {
      // Use advanced formula for longer distances
      // This is a simplified version of the actual advanced calculation
      // In reality, this would use travel time tables or more complex models

      // For demonstration, we'll use a correction factor that increases with distance
      const correctionFactor = 1 + (simpleDistance - 500) * 0.00015; // 0,015% korrektion per km over 500km
      const advancedDistance = simpleDistance * correctionFactor;

      return { distance: advancedDistance, isAdvanced: true };
    }
  };

  // Calculate uncertainties based on time uncertainty
  const calculateUncertainties = (station) => {
    const timeUncertainty = parseFloat(
      normalizeDecimalInput(station.timeUncertainty || "0")
    );

    if (timeUncertainty > 0 && station.spTime > 0) {
      // Distance uncertainty: proportional to time uncertainty
      // Using partial derivative of distance formula with respect to time
      const vP = 6.0; // P-wave velocity (km/s) - intern beregning bruger punktum
      const vS = 3.5; // S-wave velocity (km/s) - intern beregning bruger punktum

      // Uncertainty in distance due to time uncertainty
      const distanceUncertaintyFactor = 1 / (1 / vS - 1 / vP);
      station.distanceUncertainty = timeUncertainty * distanceUncertaintyFactor;

      // Magnitude uncertainty: depends on both distance and amplitude uncertainties
      // For simplicity, we'll use a proportional relationship
      if (station.amplitude && station.distance > 0) {
        const amplitudeUncertainty = 0; // Assuming amplitude is measured precisely
        const relativeDistanceUncertainty =
          station.distanceUncertainty / station.distance;
        station.magnitudeUncertainty = 1.66 * relativeDistanceUncertainty; // From magnitude formula (intern beregning)
      }
    } else {
      station.distanceUncertainty = 0;
      station.magnitudeUncertainty = 0;
    }
  };

  const renderPhase1 = () => (
    <div className="info-card">
      <h2 className="card-title">Fase 1: Seismisk dataanalyse</h2>

      <div
        className="info-box"
        style={{
          backgroundColor: "#e8f5e8",
          borderColor: "#c3e6c3",
          marginBottom: "1.5rem",
        }}
      >
        <h4 style={{ margin: "0 0 0.5rem 0", color: "#2e7d32" }}>
          Hvor henter I jeres seismiske data?
        </h4>
        <p style={{ margin: "0 0 0.5rem 0", color: "#2e7d32" }}>
          Brug <strong>GeoSeis-View</strong> til at analysere seismiske signaler
          fra målestationer baseret på jeres tildelte scenarie.
        </p>
        <p
          style={{ margin: "0 0 1rem 0", color: "#2e7d32", fontSize: "0.9rem" }}
        >
          Indtast derefter jeres data her i tabellen nedenfor for automatisk
          beregning af afstande og magnitude.
        </p>
        <div style={{ textAlign: "center" }}>
          <a
            href="https://geovidenskab.github.io/GEOseis_view/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#2e7d32",
              textDecoration: "none",
              backgroundColor: "white",
              padding: "0.5rem 1rem",
              borderRadius: "5px",
              border: "1px solid #2e7d32",
              display: "inline-block",
              fontWeight: "bold",
            }}
          >
            Åbn GeoSeis-View
          </a>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginBottom: "20px" }}>
        <div className="form-group">
          <label className="form-label">Gruppenavn:</label>
          <input
            className="form-input"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Indtast gruppenavn"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Scenario:</label>
          <input
            className="form-input"
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            placeholder="Hvilket scenario arbejder I med?"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Starttidspunkt:</label>
          <input
            className="form-input"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
      </div>

      <div className="collapsible">
        <div
          className="collapsible-header"
          onClick={() => toggleFormula("distance")}
        >
          <h3 className="collapsible-title">Formel for afstandsberegning</h3>
          <span
            className={`collapsible-icon ${
              expandedFormulas.distance ? "expanded" : ""
            }`}
          >
            ▼
          </span>
        </div>
        <div
          className={`collapsible-content ${
            expandedFormulas.distance ? "expanded" : ""
          }`}
        >
          <p style={{ marginBottom: "1rem" }}>
            Afstanden {`$d$`} til epicenteret kan beregnes ved hjælp af følgende
            formel:
          </p>

          <div
            style={{
              backgroundColor: "#fff3cd",
              border: "1px solid #ffeaa7",
              borderRadius: "4px",
              padding: "0.5rem",
              marginBottom: "1rem",
              fontSize: "0.9rem",
            }}
          >
            <strong>Note:</strong> For afstande over 500 km bruges en udvidet
            formel der tager højde for variationer i P- og S-bølgehastigheder
            med dybde. Disse beregninger markeres med en
            <span
              style={{ color: "#ff6b35", fontSize: "14px", margin: "0 2px" }}
            >
              *
            </span>{" "}
            i tabellen.
          </div>

          <div
            style={{
              marginBottom: "1rem",
              textAlign: "center",
              backgroundColor: "#f8f9fa",
              padding: "1rem",
              borderRadius: "6px",
              border: "1px solid #e9ecef",
            }}
          >
            {`$$d = \\frac{t_S - t_P}{\\frac{1}{v_S} - \\frac{1}{v_P}}$$`}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <strong>hvor:</strong>
            <ul style={{ margin: "0.5rem 0", paddingLeft: "1.5rem" }}>
              <li>{`$d$`} er afstanden til epicenteret (km)</li>
              <li>
                {`$t_S - t_P$`} er tidsforskellen mellem ankomsten af S- og
                P-bølger (sekunder)
              </li>
              <li>{`$v_P$`} er hastigheden af P-bølgerne (km/s)</li>
              <li>{`$v_S$`} er hastigheden af S-bølgerne (km/s)</li>
            </ul>
          </div>

          <div>
            <strong>
              Eksempel: Beregning af afstand til et jordskælvs epicenter
            </strong>
            <p style={{ margin: "0.5rem 0" }}>
              Antag, at et jordskælv registreres af en seismograf, og at
              P-bølgerne ankommer efter {`$t_P = 30$`} sekunder, mens S-bølgerne
              ankommer efter {`$t_S = 50$`} sekunder. Vi antager følgende
              hastigheder:
            </p>
            <ul style={{ margin: "0.5rem 0", paddingLeft: "1.5rem" }}>
              <li>P-bølgehastighed: {`$v_P = 6{,}0$`} km/s</li>
              <li>S-bølgehastighed: {`$v_S = 3{,}5$`} km/s</li>
            </ul>

            <p style={{ margin: "0.5rem 0" }}>
              Den målte tidsforskel er:{" "}
              {`$t_S - t_P = 50\\text{s} - 30\\text{s} = 20\\text{s}$`}
            </p>

            <div
              style={{
                marginTop: "0.5rem",
                textAlign: "center",
                backgroundColor: "#f8f9fa",
                padding: "0.75rem",
                borderRadius: "4px",
                border: "1px solid #e9ecef",
              }}
            >
              {`$$d = \\frac{20\\text{s}}{\\frac{1}{3{,}5 \\text{km/s}} - \\frac{1}{6{,}0\\text{km/s}}} = 168 \\text{ km}$$`}
            </div>
          </div>
        </div>
      </div>

      <div className="collapsible">
        <div
          className="collapsible-header"
          onClick={() => toggleFormula("magnitude")}
        >
          <h3 className="collapsible-title">Magnitude beregning (Ms)</h3>
          <span
            className={`collapsible-icon ${
              expandedFormulas.magnitude ? "expanded" : ""
            }`}
          >
            ▼
          </span>
        </div>
        <div
          className={`collapsible-content ${
            expandedFormulas.magnitude ? "expanded" : ""
          }`}
        >
          <div
            style={{
              marginBottom: "1rem",
              textAlign: "center",
              backgroundColor: "#f8f9fa",
              padding: "1rem",
              borderRadius: "6px",
              border: "1px solid #e9ecef",
            }}
          >
            {`$$M_s = \\log(A_{\\max}) + 1{,}66 \\cdot \\log(d) + 1{,}6$$`}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <strong>hvor:</strong>
            <ul style={{ margin: "0.5rem 0", paddingLeft: "1.5rem" }}>
              <li>{`$A_{\\max}$`} = maksimal amplitude (mm)</li>
              <li>{`$d$`} = afstand til epicenter (km)</li>
            </ul>
          </div>

          <div>
            <strong>Eksempel:</strong> {`$A_{\\max} = 50$`} mm, {`$d = 200$`} km
            <div
              style={{
                marginTop: "0.5rem",
                textAlign: "center",
                backgroundColor: "#f8f9fa",
                padding: "0.75rem",
                borderRadius: "4px",
                border: "1px solid #e9ecef",
              }}
            >
              {`$$M_s = \\log(50) + 1{,}66 \\cdot \\log(200) + 1{,}6 = 7{,}12$$`}
            </div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h3 style={{ margin: 0, color: "#2c3e50" }}>
            Seismiske Målestationer ({stations.length} stationer)
          </h3>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className="btn btn-secondary"
              onClick={addStation}
              style={{ fontSize: "0.9rem", padding: "0.5rem 1rem" }}
            >
              + Tilføj Station
            </button>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Station</th>
              <th>Navn</th>
              <th>Koordinater</th>
              <th>P-ankomst (s)</th>
              <th>S-ankomst (s)</th>
              <th>S-P tid</th>
              <th>Amplitude (mm)</th>
              <th>Afstand (km)</th>
              <th>Magnitude</th>
            </tr>
          </thead>
          <tbody>
            {stations.map((station) => (
              <tr key={station.id}>
                <td>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <strong>Station {station.id}</strong>
                    {stations.length > 1 && (
                      <button
                        className="btn btn-danger"
                        onClick={() => removeStation(station.id)}
                        style={{
                          fontSize: "0.7rem",
                          padding: "0.2rem 0.4rem",
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "3px",
                          cursor: "pointer",
                        }}
                        title="Fjern station"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </td>
                <td>
                  <input
                    className="form-input"
                    style={{ width: "100px" }}
                    value={station.name}
                    onChange={(e) =>
                      updateStation(station.id, "name", e.target.value)
                    }
                    placeholder="Stationsnavn"
                  />
                </td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                      flexDirection: "column",
                    }}
                  >
                    <input
                      className="form-input"
                      style={{ width: "80px", fontSize: "12px" }}
                      value={formatDecimalForDisplay(station.lat)}
                      onChange={(e) => {
                        const normalizedValue = normalizeDecimalInput(
                          e.target.value
                        );
                        updateStation(station.id, "lat", normalizedValue);
                      }}
                      placeholder="Br°"
                      type="text"
                      inputMode="decimal"
                    />
                    <input
                      className="form-input"
                      style={{ width: "80px", fontSize: "12px" }}
                      value={formatDecimalForDisplay(station.lon)}
                      onChange={(e) => {
                        const normalizedValue = normalizeDecimalInput(
                          e.target.value
                        );
                        updateStation(station.id, "lon", normalizedValue);
                      }}
                      placeholder="Læ°"
                      type="text"
                      inputMode="decimal"
                    />
                  </div>
                </td>
                <td>
                  <input
                    className="form-input"
                    style={{ width: "80px" }}
                    value={formatDecimalForDisplay(station.pTime)}
                    onChange={(e) => {
                      const normalizedValue = normalizeDecimalInput(
                        e.target.value
                      );
                      updateStation(station.id, "pTime", normalizedValue);
                    }}
                    type="text"
                    inputMode="decimal"
                  />
                </td>
                <td>
                  <input
                    className="form-input"
                    style={{ width: "80px" }}
                    value={formatDecimalForDisplay(station.sTime)}
                    onChange={(e) => {
                      const normalizedValue = normalizeDecimalInput(
                        e.target.value
                      );
                      updateStation(station.id, "sTime", normalizedValue);
                    }}
                    type="text"
                    inputMode="decimal"
                  />
                </td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      alignItems: "center",
                    }}
                  >
                    <strong style={{ fontSize: "12px" }}>
                      {(station.spTime || 0).toFixed(1)}
                    </strong>
                    <input
                      className="form-input"
                      style={{
                        width: "60px",
                        fontSize: "10px",
                        height: "20px",
                      }}
                      value={formatDecimalForDisplay(station.timeUncertainty)}
                      onChange={(e) => {
                        const normalizedValue = normalizeDecimalInput(
                          e.target.value
                        );
                        updateStation(
                          station.id,
                          "timeUncertainty",
                          normalizedValue
                        );
                      }}
                      placeholder="±s"
                      type="text"
                      inputMode="decimal"
                    />
                  </div>
                </td>
                <td>
                  <input
                    className="form-input"
                    style={{ width: "80px" }}
                    value={formatDecimalForDisplay(station.amplitude)}
                    onChange={(e) => {
                      const normalizedValue = normalizeDecimalInput(
                        e.target.value
                      );
                      updateStation(station.id, "amplitude", normalizedValue);
                    }}
                    type="text"
                    inputMode="decimal"
                  />
                </td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={station.useCustomDistance}
                        onChange={(e) =>
                          updateStation(
                            station.id,
                            "useCustomDistance",
                            e.target.checked
                          )
                        }
                        style={{ width: "16px", height: "16px" }}
                      />
                      <label style={{ fontSize: "10px", color: "#666" }}>
                        Egen beregning
                      </label>
                    </div>
                    {station.useCustomDistance ? (
                      <input
                        className="form-input"
                        style={{ width: "80px", fontSize: "12px" }}
                        value={formatDecimalForDisplay(station.customDistance)}
                        onChange={(e) => {
                          const normalizedValue = normalizeDecimalInput(
                            e.target.value
                          );
                          updateStation(
                            station.id,
                            "customDistance",
                            normalizedValue
                          );
                        }}
                        placeholder="km"
                        type="text"
                        inputMode="decimal"
                      />
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "1px",
                        }}
                      >
                        <strong style={{ fontSize: "12px" }}>
                          {(station.distance || 0).toFixed(0)} km
                          {station.isAdvancedCalculation && (
                            <span
                              style={{
                                color: "#ff6b35",
                                fontSize: "14px",
                                marginLeft: "2px",
                              }}
                            >
                              *
                            </span>
                          )}
                        </strong>
                        {station.distanceUncertainty > 0 && (
                          <span style={{ fontSize: "10px", color: "#666" }}>
                            ±{(station.distanceUncertainty || 0).toFixed(0)} km
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "1px",
                    }}
                  >
                    <strong style={{ color: "#1976d2", fontSize: "12px" }}>
                      {(station.magnitude || 0).toFixed(1)}
                    </strong>
                    {station.magnitudeUncertainty > 0 && (
                      <span style={{ fontSize: "10px", color: "#666" }}>
                        ±{(station.magnitudeUncertainty || 0).toFixed(2)}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="info-box"
        style={{ backgroundColor: "#fff3cd", borderColor: "#ffeaa7" }}
      >
        <strong>Gennemsnitlig magnitude: {getAverageMagnitude()}</strong>
      </div>
    </div>
  );

  const renderPhase2 = () => (
    <div className="info-card">
      <h2 className="card-title">Fase 2: Epicenter bestemmelse</h2>

      <div
        className="info-box"
        style={{ backgroundColor: "#e3f2fd", borderColor: "#bbdefb" }}
      >
        <h4 style={{ margin: "0 0 0.5rem 0", color: "#1976d2" }}>
          De tre hjemmesider I skal bruge:
        </h4>
        <div style={{ marginBottom: "1rem" }}>
          <p style={{ margin: "0.5rem 0", color: "#1976d2" }}>
            <strong>1. GeoSeis-tsunami</strong> (denne hjemmeside) - Bruges til
            at gennemføre beregninger og træffe beslutningerne
          </p>
          <p style={{ margin: "0.5rem 0", color: "#1976d2" }}>
            <strong>2. GeoSeis-view</strong> - Bruges til at analysere data fra
            målestationer
          </p>
          <p style={{ margin: "0.5rem 0", color: "#1976d2" }}>
            <strong>3. GeoSeis-epicenter</strong> - Bruges til at finde
            epicenter og analysere relevant kortinfo:
          </p>
        </div>
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <a
            href="https://geovidenskab.github.io/epicenter/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#1976d2",
              textDecoration: "none",
              backgroundColor: "white",
              padding: "0.5rem 1rem",
              borderRadius: "5px",
              border: "1px solid #1976d2",
              display: "inline-block",
              fontWeight: "bold",
            }}
          >
            Åbn GeoSeis-epicenter
          </a>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: "20px" }}>
        <div className="form-group">
          <label className="form-label">Epicenter Breddegrad:</label>
          <input
            className="form-input"
            value={formatDecimalForDisplay(epicenter.lat)}
            onChange={(e) => {
              const normalizedValue = normalizeDecimalInput(e.target.value);
              setEpicenter((prev) => ({ ...prev, lat: normalizedValue }));
            }}
            placeholder="Fra GeoSeis triangulering (fx: 55,676 eller 55.676)"
            type="text"
            inputMode="decimal"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Epicenter Længdegrad:</label>
          <input
            className="form-input"
            value={formatDecimalForDisplay(epicenter.lon)}
            onChange={(e) => {
              const normalizedValue = normalizeDecimalInput(e.target.value);
              setEpicenter((prev) => ({ ...prev, lon: normalizedValue }));
            }}
            placeholder="Fra GeoSeis triangulering (fx: 12,568 eller 12.568)"
            type="text"
            inputMode="decimal"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Kvalitet af triangulering:</label>
          <select
            className="form-input"
            value={epicenter.quality}
            onChange={(e) =>
              setEpicenter((prev) => ({ ...prev, quality: e.target.value }))
            }
          >
            <option value="">Hvor godt krydsede cirklerne?</option>
            <option value="excellent">Fremragende - lille krydspunkt</option>
            <option value="good">God - acceptabelt krydspunkt</option>
            <option value="fair">Acceptabel - stort krydspunkt</option>
            <option value="poor">Dårlig - cirkler krydser ikke pænt</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Hvor ligger epicenteret?</label>
          <select
            className="form-input"
            value={epicenter.location}
            onChange={(e) =>
              setEpicenter((prev) => ({ ...prev, location: e.target.value }))
            }
          >
            <option value="">Vælg placering</option>
            <option value="ocean">Under havbund</option>
            <option value="coastal">Tæt på kyst (&lt; 50 km)</option>
            <option value="near_ocean">Nær ocean (50-200 km fra kyst)</option>
            <option value="far_ocean">Langt fra kyst (&gt; 200 km)</option>
            <option value="land">På land</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Afstand til nærmeste kyst (km):</label>
          <input
            className="form-input"
            value={formatDecimalForDisplay(epicenter.distanceToCoast)}
            onChange={(e) => {
              const normalizedValue = normalizeDecimalInput(e.target.value);
              setEpicenter((prev) => ({
                ...prev,
                distanceToCoast: normalizedValue,
              }));
            }}
            placeholder="Anslå fra kort/Google Maps"
            type="text"
            inputMode="decimal"
          />
        </div>
      </div>

      <h3 style={{ color: "#1976d2", marginTop: "30px", marginBottom: "15px" }}>
        Ekstra oplysninger eller vurdering
      </h3>
      <div className="grid grid-2">
        <div className="form-group">
          <label className="form-label">Jordskælvets dybde (km):</label>
          <input
            className="form-input"
            value={formatDecimalForDisplay(extraInfo.depth)}
            onChange={(e) => {
              const normalizedValue = normalizeDecimalInput(e.target.value);
              setExtraInfo((prev) => ({ ...prev, depth: normalizedValue }));
            }}
            placeholder="Indtast dybde"
            type="text"
            inputMode="decimal"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Forkastningstype:</label>
          <select
            className="form-input"
            value={extraInfo.faultType}
            onChange={(e) =>
              setExtraInfo((prev) => ({ ...prev, faultType: e.target.value }))
            }
          >
            <option value="">Vælg type</option>
            <option value="subduction">
              Subduktion (havbund skubbes kraftigt op/ned)
            </option>
            <option value="uplift">
              Overskydning (bjergdannelse der kan løfte havbund)
            </option>
            <option value="strike-slip">
              Sideværtsforkastning (klippemasser glider vandret forbi hinanden)
            </option>
            <option value="volcanic">Vulkansk</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Havdybde ved epicenter (meter):</label>
          <input
            className="form-input"
            value={formatDecimalForDisplay(extraInfo.oceanDepth)}
            onChange={(e) => {
              const normalizedValue = normalizeDecimalInput(e.target.value);
              setExtraInfo((prev) => ({
                ...prev,
                oceanDepth: normalizedValue,
              }));
            }}
            placeholder="Fra GeoSeis-epicenter"
            type="text"
            inputMode="decimal"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Historiske data:</label>
          <input
            className="form-input"
            value={extraInfo.historicalData}
            onChange={(e) =>
              setExtraInfo((prev) => ({
                ...prev,
                historicalData: e.target.value,
              }))
            }
            placeholder="Tidligere tsunamier, jordskælv etc."
            type="text"
          />
        </div>
      </div>
    </div>
  );

  const renderPhase3 = () => {
    const totalScore = calculateTotalRiskScore();
    const decisionLevel = getDecisionLevel(totalScore);

    return (
      <div className="info-card">
        <h2 className="card-title">Fase 3: Tsunamirisiko vurdering</h2>

        <div
          className="info-box"
          style={{ backgroundColor: "#fff3cd", borderColor: "#ffeaa7" }}
        >
          <strong>VIGTIGT:</strong> Tsunamivarsler har store økonomiske
          omkostninger. Udsend kun det varsel der er nødvendigt!
        </div>

        {/* Magnitude Risk */}
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ color: "#1976d2", marginBottom: "10px" }}>
            1. Magnitude vurdering
          </h3>
          <select
            className="form-input"
            value={magnitudeRisk}
            onChange={(e) => {
              setMagnitudeRisk(e.target.value);
              updateRiskScore("magnitude", e.target.value);
            }}
            style={{
              marginBottom: "10px",
              color:
                magnitudeRisk === "5" || magnitudeRisk === "3"
                  ? "#dc3545"
                  : magnitudeRisk === "1"
                  ? "#fd7e14"
                  : magnitudeRisk === "0" || magnitudeRisk === "-2"
                  ? "#28a745"
                  : "#000",
              fontWeight: "bold",
            }}
          >
            <option value="">Vælg magnitude risiko</option>
            <option value="5" style={{ color: "#dc3545", fontWeight: "bold" }}>
              MEGET HØJ RISIKO: Magnitude over 7.9 (+5 point)
            </option>
            <option value="3" style={{ color: "#dc3545", fontWeight: "bold" }}>
              HØJ RISIKO: Magnitude 7.5-7.9 (+3 point)
            </option>
            <option value="1" style={{ color: "#fd7e14", fontWeight: "bold" }}>
              MODERAT RISIKO: Magnitude 7.0-7.4 (+1 point)
            </option>
            <option value="0" style={{ color: "#28a745", fontWeight: "bold" }}>
              LAV RISIKO: Magnitude 6.5-6.9 (0 point)
            </option>
            <option value="-2" style={{ color: "#28a745", fontWeight: "bold" }}>
              MEGET LAV: Magnitude &lt; 6.5 (-2 point)
            </option>
          </select>
        </div>

        {/* Depth Risk */}
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ color: "#1976d2", marginBottom: "10px" }}>
            2. Vurdering af dybde til jordskælvet fokus (ved epicenter)
          </h3>
          <select
            className="form-input"
            value={depthRisk}
            onChange={(e) => {
              setDepthRisk(e.target.value);
              updateRiskScore("depth", e.target.value);
            }}
            style={{
              marginBottom: "10px",
              color:
                depthRisk === "3" || depthRisk === "2"
                  ? "#dc3545"
                  : depthRisk === "1"
                  ? "#fd7e14"
                  : depthRisk === "0" || depthRisk === "-1"
                  ? "#28a745"
                  : "#000",
              fontWeight: "bold",
            }}
          >
            <option value="">Vælg dybde risiko</option>
            <option value="3" style={{ color: "#dc3545", fontWeight: "bold" }}>
              MEGET LAVT (0-10 km): Maksimal energioverførsel (+3 point)
            </option>
            <option value="2" style={{ color: "#dc3545", fontWeight: "bold" }}>
              LAVT (10-30 km): Høj energioverførsel (+2 point)
            </option>
            <option value="1" style={{ color: "#fd7e14", fontWeight: "bold" }}>
              MELLEM (30-70 km): Moderat energioverførsel (+1 point)
            </option>
            <option value="0" style={{ color: "#28a745", fontWeight: "bold" }}>
              DYBT (70-150 km): Lav energioverførsel (0 point)
            </option>
            <option value="-1" style={{ color: "#28a745", fontWeight: "bold" }}>
              MEGET DYBT (&gt;150 km): Minimal energioverførsel (-1 point)
            </option>
            <option value="0" style={{ color: "#6c757d", fontWeight: "bold" }}>
              VED IKKE: Usikker dybde (0 point)
            </option>
          </select>
        </div>

        {/* Location Risk */}
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ color: "#1976d2", marginBottom: "10px" }}>
            3. Placering vurdering
          </h3>
          <select
            className="form-input"
            value={locationRisk}
            onChange={(e) => {
              setLocationRisk(e.target.value);
              updateRiskScore("location", e.target.value);
            }}
            style={{
              marginBottom: "10px",
              color:
                locationRisk === "3" || locationRisk === "2"
                  ? "#dc3545"
                  : locationRisk === "1"
                  ? "#fd7e14"
                  : locationRisk === "0" || locationRisk === "-3"
                  ? "#28a745"
                  : "#000",
              fontWeight: "bold",
            }}
          >
            <option value="">Vælg placering risiko</option>
            <option value="3" style={{ color: "#dc3545", fontWeight: "bold" }}>
              UNDER HAVBUND: Direkte vandforskydning mulig (+3 point)
            </option>
            <option value="2" style={{ color: "#dc3545", fontWeight: "bold" }}>
              KYSTNÆR (&lt;50 km): Hurtig tsunamiankomst (+2 point)
            </option>
            <option value="1" style={{ color: "#fd7e14", fontWeight: "bold" }}>
              OCEANISK (50-200 km): Moderat risiko (+1 point)
            </option>
            <option value="0" style={{ color: "#28a745", fontWeight: "bold" }}>
              FJERNT (&gt;200 km): Længere varslingstid (0 point)
            </option>
            <option value="-3" style={{ color: "#28a745", fontWeight: "bold" }}>
              LANDBASERET: Ingen direkte tsunami (-3 point)
            </option>
          </select>
        </div>

        {/* Fault Type Risk */}
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ color: "#1976d2", marginBottom: "10px" }}>
            4. Forkastningstype
          </h3>
          <select
            className="form-input"
            value={faultTypeRisk}
            onChange={(e) => {
              setFaultTypeRisk(e.target.value);
              updateRiskScore("faultType", e.target.value);
            }}
            style={{
              marginBottom: "10px",
              color:
                faultTypeRisk === "3"
                  ? "#dc3545"
                  : faultTypeRisk === "1" || faultTypeRisk === "2"
                  ? "#fd7e14"
                  : faultTypeRisk === "-1"
                  ? "#28a745"
                  : "#000",
              fontWeight: "bold",
            }}
          >
            <option value="">Vælg forkastningstype</option>
            <option value="3" style={{ color: "#dc3545", fontWeight: "bold" }}>
              SUBDUKTION: Havbund skubbes kraftigt op/ned (+3 point)
            </option>
            <option value="1" style={{ color: "#fd7e14", fontWeight: "bold" }}>
              OVERSKYDNING: Bjergdannelse der kan løfte havbund (+1 point)
            </option>
            <option value="-1" style={{ color: "#28a745", fontWeight: "bold" }}>
              SIDEVÆRTSFORKASTNING: Klippemasser glider vandret forbi hinanden
              (-1 point)
            </option>
            <option value="2" style={{ color: "#fd7e14", fontWeight: "bold" }}>
              VULKANSK: Uforudsigelig, kan udløse landskred (+2 point)
            </option>
          </select>
        </div>

        {/* Total Score Display */}
        <div
          className="decision-box"
          style={{
            borderColor: decisionLevel.color.includes("red")
              ? "#dc3545"
              : decisionLevel.color.includes("orange")
              ? "#fd7e14"
              : decisionLevel.color.includes("yellow")
              ? "#ffc107"
              : "#28a745",
            backgroundColor: decisionLevel.bg
              ?.replace("text-", "bg-")
              .replace("-600", "-50"),
          }}
        >
          <h3 style={{ color: "#1976d2", marginBottom: "10px" }}>
            Total Risikoscore: {totalScore} point
          </h3>
          <h2
            style={{
              color: decisionLevel.color.includes("red")
                ? "#dc3545"
                : decisionLevel.color.includes("orange")
                ? "#fd7e14"
                : decisionLevel.color.includes("yellow")
                ? "#ffc107"
                : "#28a745",
            }}
          >
            {decisionLevel.level}
          </h2>
          <p style={{ marginTop: "10px", fontSize: "16px" }}>
            {decisionLevel.desc}
          </p>
        </div>

        {/* Final Decision */}
        <div style={{ marginTop: "30px" }}>
          <h3 style={{ color: "#1976d2", marginBottom: "15px" }}>
            Jeres Endelige Beslutning
          </h3>

          <div className="form-group">
            <label className="form-label">Varselsniveau:</label>
            <input
              className="form-input"
              value={decision.level}
              onChange={(e) =>
                setDecision((prev) => ({ ...prev, level: e.target.value }))
              }
              placeholder="F.eks. LOKAL VARSEL"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Geografisk område for varsel:</label>
            <input
              className="form-input"
              value={decision.area}
              onChange={(e) =>
                setDecision((prev) => ({ ...prev, area: e.target.value }))
              }
              placeholder="Hvilke områder skal advares?"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Skal der udsendes tsunamivarsel?
            </label>
            <div style={{ display: "flex", gap: "20px", marginTop: "8px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="warning"
                  value="yes"
                  onChange={(e) =>
                    setDecision((prev) => ({ ...prev, warning: true }))
                  }
                  style={{ transform: "scale(1.2)" }}
                />
                <span style={{ fontWeight: "500", color: "#dc3545" }}>
                  JA - Udsend varsel
                </span>
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="warning"
                  value="no"
                  onChange={(e) =>
                    setDecision((prev) => ({ ...prev, warning: false }))
                  }
                  style={{ transform: "scale(1.2)" }}
                />
                <span style={{ fontWeight: "500", color: "#28a745" }}>
                  NEJ - Ingen varsel
                </span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Begrundelse for jeres beslutning:
            </label>
            <textarea
              className="form-input"
              style={{ minHeight: "100px", resize: "vertical" }}
              value={decision.justification}
              onChange={(e) =>
                setDecision((prev) => ({
                  ...prev,
                  justification: e.target.value,
                }))
              }
              placeholder="Forklar hvorfor I træffer denne beslutning baseret på jeres data og risikovurdering..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Særlige overvejelser:</label>
            <div style={{ marginTop: "8px" }}>
              {[
                "Befolkede kystområder i nærheden?",
                "Tidspunkt på dagen (nat = værre evakuering)?",
                "Særlige begivenheder (festivaler, feriesæson)?",
                "Tidligere tsunamihistorik i området?",
              ].map((consideration, index) => (
                <div
                  key={index}
                  className="radio-option"
                  style={{ backgroundColor: "#f8f9fa", cursor: "pointer" }}
                  onClick={() => {
                    setCheckedConsiderations((prev) => ({
                      ...prev,
                      [index]: !prev[index],
                    }));
                  }}
                >
                  <input
                    type="checkbox"
                    style={{ transform: "scale(1.2)" }}
                    checked={checkedConsiderations[index] || false}
                    readOnly
                  />
                  <span style={{ cursor: "pointer" }}>{consideration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Communication Button */}
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            className="btn btn-primary"
            onClick={() => setShowCommunication(true)}
            style={{
              fontSize: "1.2rem",
              padding: "1rem 2rem",
              backgroundColor: "#dc3545",
              border: "none",
              borderRadius: "8px",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              animation: "pulse 2s infinite",
            }}
          >
            🚨 KOMMUNIKER VARSEL 🚨
          </button>
        </div>
      </div>
    );
  };

  const renderCommunication = () => {
    const totalScore = calculateTotalRiskScore();
    const decisionLevel = getDecisionLevel(totalScore);
    const averageMagnitude = getAverageMagnitude();

    return (
      <div
        className="info-card"
        style={{ maxWidth: "800px", margin: "0 auto" }}
      >
        <h2
          className="card-title"
          style={{ textAlign: "center", color: "#dc3545" }}
        >
          🚨 TSUNAMI VARSEL KOMMUNIKATION 🚨
        </h2>

        <div
          className="info-box"
          style={{
            backgroundColor: decisionLevel.bg,
            borderColor: decisionLevel.color,
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          <h3 style={{ color: decisionLevel.color, margin: "0 0 1rem 0" }}>
            VARSELSNIVEAU: {decisionLevel.level}
          </h3>
          <p style={{ margin: "0", fontSize: "1.1rem" }}>
            {decisionLevel.desc}
          </p>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "#1976d2", marginBottom: "1rem" }}>
            Begrundelse for varsel
          </h3>

          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "1.5rem",
              borderRadius: "8px",
            }}
          >
            <p style={{ marginBottom: "1rem" }}>
              <strong>Gruppe:</strong> {groupName || "Ikke angivet"}
            </p>
            <p style={{ marginBottom: "1rem" }}>
              <strong>Scenarie:</strong> Scenarie{" "}
              {teamData?.selectedScenario || "Ikke angivet"}
            </p>
            <p style={{ marginBottom: "1rem" }}>
              <strong>Beregnet magnitude:</strong> {averageMagnitude}
            </p>
            <p style={{ marginBottom: "1rem" }}>
              <strong>Samlet risikoscore:</strong> {totalScore} point
            </p>
            <p style={{ marginBottom: "1rem" }}>
              <strong>Epicenter lokalisering:</strong>{" "}
              {epicenter.lat && epicenter.lon
                ? `${epicenter.lat}°N, ${epicenter.lon}°E`
                : "Ikke bestemt"}
            </p>
            <p style={{ marginBottom: "1rem" }}>
              <strong>Havdybde ved epicenter:</strong>{" "}
              {extraInfo.oceanDepth || "Ikke angivet"} meter
            </p>
            <p style={{ marginBottom: "1rem" }}>
              <strong>Jordskælvets dybde:</strong>{" "}
              {extraInfo.depth || "Ikke angivet"} km
            </p>
            <p style={{ marginBottom: "1rem" }}>
              <strong>Forkastningstype:</strong>{" "}
              {extraInfo.faultType || "Ikke angivet"}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "#1976d2", marginBottom: "1rem" }}>
            Detaljerede argumenter
          </h3>

          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "1.5rem",
              borderRadius: "8px",
            }}
          >
            <p style={{ marginBottom: "1rem" }}>
              <strong>Magnitude vurdering:</strong> Baseret på seismiske data
              fra {stations.filter((s) => s.amplitude).length} stationer er den
              beregnede magnitude {averageMagnitude}. Dette indikerer en{" "}
              {getMagnitudeRiskLevel(averageMagnitude)}.
            </p>

            <p style={{ marginBottom: "1rem" }}>
              <strong>Epicenter usikkerhed:</strong>{" "}
              {epicenter.uncertainty || "Ikke beregnet"} km usikkerhed i
              epicenter lokalisering baseret på triangulering af seismiske
              stationer.
            </p>

            <p style={{ marginBottom: "1rem" }}>
              <strong>Geologiske forhold:</strong>{" "}
              {extraInfo.faultType && extraInfo.faultType !== ""
                ? `Forkastningstype: ${extraInfo.faultType}. `
                : ""}
              Havdybde på {extraInfo.oceanDepth || "ukendt"} meter
              {extraInfo.oceanDepth && extraInfo.oceanDepth < 1000
                ? " (lav dybde øger tsunamirisiko)"
                : extraInfo.oceanDepth && extraInfo.oceanDepth > 4000
                ? " (høj dybde reducerer tsunamirisiko)"
                : ""}
              .
            </p>

            <p style={{ marginBottom: "1rem" }}>
              <strong>Historisk kontekst:</strong>{" "}
              {extraInfo.historicalData || "Ingen historiske data tilgængelige"}
              .
            </p>

            <p style={{ marginBottom: "1rem" }}>
              <strong>Samlet vurdering:</strong> Med en risikoscore på{" "}
              {totalScore} point og magnitude på {averageMagnitude} konkluderer
              vi at {decisionLevel.desc.toLowerCase()}.
            </p>

            <p style={{ marginBottom: "1rem" }}>
              <strong>Yderligere overvejelser:</strong>{" "}
              {Object.keys(checkedConsiderations).filter(
                (key) => checkedConsiderations[key]
              ).length > 0
                ? Object.keys(checkedConsiderations)
                    .filter((key) => checkedConsiderations[key])
                    .map(
                      (key) =>
                        [
                          "Befolkede kystområder i nærheden?",
                          "Tidspunkt på dagen (nat = værre evakuering)?",
                          "Særlige begivenheder (festivaler, feriesæson)?",
                          "Tidligere tsunamihistorik i området?",
                        ][key]
                    )
                    .join(", ")
                : "Ingen yderligere overvejelser markeret"}
            </p>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            className="btn btn-primary"
            onClick={() => {
              // Hide everything except communication content
              const elementsToHide = document.querySelectorAll(
                ".header, .phase-navigation, .navigation-buttons, .global-deadline-section"
              );
              elementsToHide.forEach((el) => (el.style.display = "none"));

              // Print
              window.print();

              // Show elements again
              elementsToHide.forEach((el) => (el.style.display = ""));
            }}
            style={{
              fontSize: "1rem",
              padding: "0.8rem 1.5rem",
              backgroundColor: "#007bff",
              border: "none",
              borderRadius: "5px",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              marginRight: "1rem",
            }}
          >
            Print Rapport
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowCommunication(false)}
            style={{
              fontSize: "1rem",
              padding: "0.8rem 1.5rem",
              backgroundColor: "#6c757d",
              border: "none",
              borderRadius: "5px",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Tilbage til Analyse
          </button>
        </div>
      </div>
    );
  };

  const getMagnitudeRiskLevel = (magnitude) => {
    const mag = parseFloat(magnitude);
    if (mag >= 7.9) return "meget høj risiko";
    if (mag >= 7.5) return "høj risiko";
    if (mag >= 7.0) return "moderat risiko";
    if (mag >= 6.5) return "lav risiko";
    return "meget lav risiko";
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="tsunami-watch-container">
      {/* Global Deadline Section */}
      <div className="global-deadline-section">
        {!isCountdownActive && (
          <div
            className="info-box"
            style={{
              backgroundColor: "#fff3cd",
              borderColor: "#ffeaa7",
              marginBottom: "1rem",
            }}
          >
            <h4 style={{ margin: "0 0 0.5rem 0", color: "#856404" }}>
              Sæt jeres deadline
            </h4>
            <p style={{ margin: "0", color: "#856404" }}>
              Vurder hvor lang tid I vil bruge baseret på jeres strategi mellem
              hastighed og præcision. Vælg tid nedenfor og klik "Start
              nedtælling" for at aktivere den dramatiske nedtælling.
            </p>
          </div>
        )}
        {!isCountdownActive && (
          <div className="deadline-controls">
            <div className="form-group">
              <label className="form-label">Vælg tid (minutter):</label>
              <select
                className="form-input"
                value={deadlineMinutes}
                onChange={(e) => setDeadlineMinutes(parseInt(e.target.value))}
                style={{ marginBottom: "0.5rem" }}
              >
                <option value={15}>15 minutter</option>
                <option value={30}>30 minutter</option>
                <option value={45}>45 minutter</option>
                <option value={60}>60 minutter</option>
                <option value={75}>75 minutter</option>
                <option value={90}>90 minutter</option>
                <option value={105}>105 minutter</option>
                <option value={120}>120 minutter</option>
              </select>
              <div
                style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}
              >
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={startCountdown}
                >
                  Start nedtælling
                </button>
              </div>
            </div>
          </div>
        )}

        {isCountdownActive && timeLeft && (
          <div
            className={`deadline-countdown ${
              timeLeft.total < 300 ? "critical" : ""
            }`}
            style={{
              backgroundColor: timeLeft.total < 300 ? "#f8d7da" : "#d1ecf1",
              border: `1px solid ${
                timeLeft.total < 300 ? "#dc3545" : "#17a2b8"
              }`,
              borderRadius: "6px",
              padding: "0.3rem",
              marginTop: "0.3rem",
              textAlign: "center",
              animation: timeLeft.total < 300 ? "pulse 1s infinite" : "none",
            }}
          >
            <h3
              style={{
                color: timeLeft.total < 300 ? "#dc3545" : "#17a2b8",
                textAlign: "center",
                marginBottom: "0.2rem",
                fontSize: "0.8rem",
                fontWeight: "bold",
              }}
            >
              {timeLeft.total <= 0 ? "TIDEN ER UDE!" : "NEDTÆLLING"}
            </h3>
            <div
              className="countdown-display"
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.6rem",
                fontSize: "0.9rem",
                fontWeight: "bold",
              }}
            >
              <div className="countdown-item">
                <span
                  className="countdown-number"
                  style={{
                    color: timeLeft.total < 300 ? "#dc3545" : "#17a2b8",
                  }}
                >
                  {timeLeft.minutes.toString().padStart(2, "0")}
                </span>
                <span
                  className="countdown-label"
                  style={{ fontSize: "0.5rem", display: "block" }}
                >
                  Minutter
                </span>
              </div>
              <div className="countdown-item">
                <span
                  className="countdown-number"
                  style={{
                    color: timeLeft.total < 300 ? "#dc3545" : "#17a2b8",
                  }}
                >
                  {timeLeft.seconds.toString().padStart(2, "0")}
                </span>
                <span
                  className="countdown-label"
                  style={{ fontSize: "0.5rem", display: "block" }}
                >
                  Sekunder
                </span>
              </div>
            </div>
            <div style={{ marginTop: "0.2rem", textAlign: "right" }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={stopCountdown}
                style={{
                  fontSize: "0.6rem",
                  padding: "0.1rem 0.3rem",
                  opacity: 0.6,
                }}
              >
                Stop
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div className="status-item">
            <strong>Aktiv fase:</strong> Fase {activePhase}
          </div>
          <div className="status-item">
            <strong>Gruppe:</strong> {groupName || "Ikke angivet"}
          </div>
          <div className="status-item">
            <strong>Scenario:</strong> {scenario || "Ikke angivet"}
          </div>
        </div>

        {/* Team Information Section */}
        {teamData && (
          <div
            style={{
              backgroundColor: "#e3f2fd",
              border: "2px solid #2196f3",
              borderRadius: "10px",
              padding: "1.5rem",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            <h3 style={{ color: "#1976d2", margin: "0 0 1rem 0" }}>
              Team: {teamData.teamName}
            </h3>
            <div style={{ marginBottom: "1rem" }}>
              <strong>Team Medlemmer:</strong> {teamData.members.join(", ")}
            </div>
            <div
              style={{
                backgroundColor: "white",
                padding: "1rem",
                borderRadius: "8px",
                border: "2px solid #1976d2",
              }}
            >
              <strong>Valgt Scenarie: {teamData.selectedScenario}</strong>
              <div
                style={{
                  fontSize: "0.9rem",
                  color: "#666",
                  marginTop: "0.5rem",
                }}
              >
                {teamData.selectedScenario === 1 &&
                  "Scenarie 1 - Ukendt seismisk event"}
                {teamData.selectedScenario === 2 &&
                  "Scenarie 2 - Ukendt seismisk event"}
                {teamData.selectedScenario === 3 &&
                  "Scenarie 3 - Ukendt seismisk event"}
                {teamData.selectedScenario === 4 &&
                  "Scenarie 4 - Ukendt seismisk event"}
                {teamData.selectedScenario === 5 &&
                  "Scenarie 5 - Ukendt seismisk event"}
                {teamData.selectedScenario === 6 &&
                  "Scenarie 6 - Ukendt seismisk event"}
                {teamData.selectedScenario === 7 &&
                  "Scenarie 7 - Ukendt seismisk event"}
                {teamData.selectedScenario === 8 &&
                  "Scenarie 8 - Ukendt seismisk event"}
              </div>
            </div>
          </div>
        )}

        {/* Phase Navigation */}
        {!showCommunication && (
          <div className="phase-navigation">
            {[1, 2, 3].map((phase) => (
              <button
                key={phase}
                className={`phase-btn ${activePhase === phase ? "active" : ""}`}
                onClick={() => setActivePhase(phase)}
              >
                Fase {phase}
              </button>
            ))}
            <button className="phase-btn secondary" onClick={printReport}>
              Print
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="main-content">
        {showCommunication ? (
          renderCommunication()
        ) : (
          <>
            {activePhase === 1 && renderPhase1()}
            {activePhase === 2 && renderPhase2()}
            {activePhase === 3 && renderPhase3()}
          </>
        )}

        {/* Next/Previous buttons */}
        {!showCommunication && (
          <div className="navigation-buttons">
            <button
              className={`btn btn-secondary ${
                activePhase === 1 ? "disabled" : ""
              }`}
              onClick={() => activePhase > 1 && setActivePhase(activePhase - 1)}
              disabled={activePhase === 1}
              style={{
                backgroundColor: activePhase === 1 ? "#6c757d" : "#4A90E2",
                color: "white",
                border: "none",
                padding: "0.8rem 1.5rem",
                borderRadius: "5px",
                cursor: activePhase === 1 ? "not-allowed" : "pointer",
                fontWeight: "bold",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (activePhase > 1) {
                  e.target.style.backgroundColor = "#357ABD";
                }
              }}
              onMouseLeave={(e) => {
                if (activePhase > 1) {
                  e.target.style.backgroundColor = "#4A90E2";
                }
              }}
            >
              ← Forrige fase
            </button>
            <button
              className={`btn btn-primary ${
                activePhase === 3 ? "disabled" : ""
              }`}
              onClick={() => activePhase < 3 && setActivePhase(activePhase + 1)}
              disabled={activePhase === 3}
            >
              Næste fase →
            </button>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body { font-size: 12pt; color: black; background: white; }
          .no-print { display: none !important; }
          h1, h2, h3 { color: black !important; }
          div { break-inside: avoid-page; }
          table { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
};

export default GeoTsunamiWatch;
