import React, { useState, useEffect } from 'react';

const GeoTsunamiWatch = () => {
  const [activePhase, setActivePhase] = useState(1);
  const [groupName, setGroupName] = useState('');
  const [scenario, setScenario] = useState('');
  const [startTime, setStartTime] = useState('');
  
  // Phase 1 - Seismic Analysis
  const [stations, setStations] = useState([
    { id: 'A', name: '', lat: '', lon: '', pTime: '', sTime: '', amplitude: '', spTime: 0, distance: 0, magnitude: 0 },
    { id: 'B', name: '', lat: '', lon: '', pTime: '', sTime: '', amplitude: '', spTime: 0, distance: 0, magnitude: 0 },
    { id: 'C', name: '', lat: '', lon: '', pTime: '', sTime: '', amplitude: '', spTime: 0, distance: 0, magnitude: 0 },
    { id: 'D', name: '', lat: '', lon: '', pTime: '', sTime: '', amplitude: '', spTime: 0, distance: 0, magnitude: 0 }
  ]);
  
  // Phase 2 - Epicenter
  const [epicenter, setEpicenter] = useState({ lat: '', lon: '', quality: '', location: '', distanceToCoast: '' });
  const [extraInfo, setExtraInfo] = useState({ depth: '', faultType: '' });
  
  // Phase 3 - Risk Assessment
  const [riskScores, setRiskScores] = useState({
    magnitude: 0,
    depth: 0,
    location: 0,
    faultType: 0
  });
  
  const [decision, setDecision] = useState({ level: '', warning: false, justification: '', area: '' });

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

  const updateStation = (stationId, field, value) => {
    setStations(prev => prev.map(station => {
      if (station.id === stationId) {
        const updated = { ...station, [field]: value };
        
        // Auto-calculate derived values
        if (field === 'pTime' || field === 'sTime') {
          const pTime = parseFloat(field === 'pTime' ? value : station.pTime);
          const sTime = parseFloat(field === 'sTime' ? value : station.sTime);
          if (!isNaN(pTime) && !isNaN(sTime)) {
            updated.spTime = sTime - pTime;
            updated.distance = calculateDistance(updated.spTime);
          }
        }
        
        if ((field === 'amplitude' || updated.distance > 0) && updated.amplitude && updated.distance) {
          updated.magnitude = calculateMagnitude(parseFloat(updated.amplitude), updated.distance);
        }
        
        return updated;
      }
      return station;
    }));
  };

  const getAverageMagnitude = () => {
    const magnitudes = stations
      .map(station => station.magnitude)
      .filter(mag => mag > 0);
    
    return magnitudes.length > 0 ? 
      (magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length).toFixed(1) : 
      '0.0';
  };

  const calculateTotalRiskScore = () => {
    return Object.values(riskScores).reduce((sum, score) => sum + score, 0);
  };

  const getDecisionLevel = (score) => {
    if (score >= 10) return { level: 'RØDT ALARM', color: 'text-red-600', bg: 'bg-red-50 border-red-200', desc: 'Øjeblikkelig regional tsunamivarsel' };
    if (score >= 7) return { level: 'ORANGE ALARM', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', desc: 'Lokal tsunamivarsel og overvågning' };
    if (score >= 4) return { level: 'GUL ADVARSEL', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200', desc: 'Øget overvågning, ingen varsel endnu' };
    if (score >= 1) return { level: 'GRØN OVERVÅGNING', color: 'text-green-600', bg: 'bg-green-50 border-green-200', desc: 'Fortsæt normal overvågning' };
    return { level: 'INGEN RISIKO', color: 'text-green-600', bg: 'bg-green-50 border-green-200', desc: 'Ingen tsunamirisiko' };
  };

  const updateRiskScore = (category, value) => {
    setRiskScores(prev => ({ ...prev, [category]: parseInt(value) }));
  };

  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      margin: 0,
      padding: 0
    },
    header: {
      backgroundColor: '#1976d2',
      color: 'white',
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    headerContent: {
      display: 'flex',
      flexDirection: 'column'
    },
    title: {
      fontSize: '24px',
      fontWeight: '600',
      marginBottom: '4px',
      margin: 0
    },
    subtitle: {
      fontSize: '12px',
      opacity: 0.8,
      fontWeight: '400',
      margin: 0
    },
    statusBar: {
      backgroundColor: 'white',
      borderBottom: '1px solid #e0e0e0',
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    phaseNav: {
      display: 'flex',
      gap: '8px'
    },
    phaseBtn: {
      backgroundColor: '#1976d2',
      color: 'white',
      border: 'none',
      padding: '6px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    phaseBtnInactive: {
      backgroundColor: 'rgba(25, 118, 210, 0.1)',
      color: '#1976d2'
    },
    mainContent: {
      padding: '24px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      border: '1px solid #e0e0e0',
      marginBottom: '24px'
    },
    cardTitle: {
      margin: '0 0 20px 0',
      color: '#1976d2',
      fontSize: '20px',
      fontWeight: '600',
      borderBottom: '2px solid #e3f2fd',
      paddingBottom: '12px'
    },
    formGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#333'
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      fontSize: '14px',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      backgroundColor: 'white'
    },
    inputFocus: {
      borderColor: '#1976d2',
      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
      outline: 'none'
    },
    btn: {
      backgroundColor: '#1976d2',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)'
    },
    btnSecondary: {
      backgroundColor: '#757575',
      boxShadow: '0 2px 4px rgba(117, 117, 117, 0.2)'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '16px'
    },
    th: {
      backgroundColor: '#f5f5f5',
      padding: '12px 8px',
      textAlign: 'left',
      fontSize: '14px',
      fontWeight: '600',
      borderBottom: '2px solid #e0e0e0'
    },
    td: {
      padding: '12px 8px',
      borderBottom: '1px solid #f0f0f0',
      fontSize: '14px'
    },
    riskOption: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px',
      margin: '4px 0',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    decisionBox: {
      padding: '20px',
      borderRadius: '8px',
      border: '2px solid',
      textAlign: 'center',
      marginTop: '20px'
    },
    resultCard: {
      backgroundColor: '#e3f2fd',
      border: '1px solid #bbdefb',
      borderRadius: '8px',
      padding: '16px',
      marginTop: '16px',
      fontSize: '14px'
    }
  };

  const renderPhase1 = () => (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>FASE 1: Seismisk Dataanalyse</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Gruppenavn:</label>
          <input 
            style={styles.input}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Indtast gruppenavn"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Scenario:</label>
          <input 
            style={styles.input}
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            placeholder="Hvilket scenario arbejder I med?"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Starttidspunkt:</label>
          <input 
            style={styles.input}
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
      </div>

      <div style={styles.resultCard}>
        <strong>Magnitude beregning (Ms):</strong><br/>
        Ms = log₁₀(A) + 1.66 × log₁₀(Δ) + 1.6<br/>
        hvor A = maksimal amplitude (mm) og Δ = afstand til epicenter (km)
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Station</th>
            <th style={styles.th}>Navn</th>
            <th style={styles.th}>Koordinater</th>
            <th style={styles.th}>P-ankomst (s)</th>
            <th style={styles.th}>S-ankomst (s)</th>
            <th style={styles.th}>S-P tid</th>
            <th style={styles.th}>Amplitude (mm)</th>
            <th style={styles.th}>Afstand (km)</th>
            <th style={styles.th}>Magnitude</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((station) => (
            <tr key={station.id}>
              <td style={styles.td}><strong>Station {station.id}</strong></td>
              <td style={styles.td}>
                <input 
                  style={{...styles.input, width: '100px'}}
                  value={station.name}
                  onChange={(e) => updateStation(station.id, 'name', e.target.value)}
                  placeholder="Stationsnavn"
                />
              </td>
              <td style={styles.td}>
                <div style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
                  <input 
                    style={{...styles.input, width: '80px', fontSize: '12px'}}
                    value={station.lat}
                    onChange={(e) => updateStation(station.id, 'lat', e.target.value)}
                    placeholder="Br°"
                    type="number"
                    step="0.01"
                  />
                  <input 
                    style={{...styles.input, width: '80px', fontSize: '12px'}}
                    value={station.lon}
                    onChange={(e) => updateStation(station.id, 'lon', e.target.value)}
                    placeholder="Læ°"
                    type="number"
                    step="0.01"
                  />
                </div>
              </td>
              <td style={styles.td}>
                <input 
                  style={{...styles.input, width: '80px'}}
                  value={station.pTime}
                  onChange={(e) => updateStation(station.id, 'pTime', e.target.value)}
                  type="number"
                  step="0.1"
                />
              </td>
              <td style={styles.td}>
                <input 
                  style={{...styles.input, width: '80px'}}
                  value={station.sTime}
                  onChange={(e) => updateStation(station.id, 'sTime', e.target.value)}
                  type="number"
                  step="0.1"
                />
              </td>
              <td style={styles.td}>
                <strong>{station.spTime.toFixed(1)}</strong>
              </td>
              <td style={styles.td}>
                <input 
                  style={{...styles.input, width: '80px'}}
                  value={station.amplitude}
                  onChange={(e) => updateStation(station.id, 'amplitude', e.target.value)}
                  type="number"
                  step="0.1"
                />
              </td>
              <td style={styles.td}>
                <strong>{station.distance.toFixed(0)}</strong>
              </td>
              <td style={styles.td}>
                <strong style={{ color: '#1976d2' }}>{station.magnitude.toFixed(1)}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ ...styles.resultCard, backgroundColor: '#fff3cd', borderColor: '#ffeaa7' }}>
        <strong>Gennemsnitlig magnitude: {getAverageMagnitude()}</strong>
      </div>
    </div>
  );

  const renderPhase2 = () => (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>FASE 2: Epicenter Bestemmelse</h2>
      
      <div style={styles.resultCard}>
        <strong>Brug GeoSeis triangulerings-hjemmesiden:</strong><br/>
        <a href="https://geovidenskab.github.io/epicenter/" target="_blank" rel="noopener noreferrer" 
           style={{ color: '#1976d2', textDecoration: 'none' }}>
          https://geovidenskab.github.io/epicenter/
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Epicenter Breddegrad:</label>
          <input 
            style={styles.input}
            value={epicenter.lat}
            onChange={(e) => setEpicenter(prev => ({ ...prev, lat: e.target.value }))}
            placeholder="Fra GeoSeis triangulering"
            type="number"
            step="0.001"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Epicenter Længdegrad:</label>
          <input 
            style={styles.input}
            value={epicenter.lon}
            onChange={(e) => setEpicenter(prev => ({ ...prev, lon: e.target.value }))}
            placeholder="Fra GeoSeis triangulering"
            type="number"
            step="0.001"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Kvalitet af triangulering:</label>
          <select 
            style={styles.input}
            value={epicenter.quality}
            onChange={(e) => setEpicenter(prev => ({ ...prev, quality: e.target.value }))}
          >
            <option value="">Hvor godt krydsede cirklerne?</option>
            <option value="excellent">Fremragende - lille krydspunkt</option>
            <option value="good">God - acceptabelt krydspunkt</option>
            <option value="fair">Acceptabel - stort krydspunkt</option>
            <option value="poor">Dårlig - cirkler krydser ikke pænt</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Hvor ligger epicenteret?</label>
          <select 
            style={styles.input}
            value={epicenter.location}
            onChange={(e) => setEpicenter(prev => ({ ...prev, location: e.target.value }))}
          >
            <option value="">Vælg placering</option>
            <option value="ocean">Under havbund</option>
            <option value="coastal">Tæt på kyst (< 50 km)</option>
            <option value="near_ocean">Nær ocean (50-200 km fra kyst)</option>
            <option value="far_ocean">Langt fra kyst (> 200 km)</option>
            <option value="land">På land</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Afstand til nærmeste kyst (km):</label>
          <input 
            style={styles.input}
            value={epicenter.distanceToCoast}
            onChange={(e) => setEpicenter(prev => ({ ...prev, distanceToCoast: e.target.value }))}
            placeholder="Anslå fra kort/Google Maps"
            type="number"
            step="1"
          />
        </div>
      </div>

      <h3 style={{ color: '#1976d2', marginTop: '30px', marginBottom: '15px' }}>Ekstra Oplysninger (fra lærer)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Jordskælvets dybde (km):</label>
          <input 
            style={styles.input}
            value={extraInfo.depth}
            onChange={(e) => setExtraInfo(prev => ({ ...prev, depth: e.target.value }))}
            placeholder="Oplyst af lærer"
            type="number"
            step="1"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Forkastningstype:</label>
          <select 
            style={styles.input}
            value={extraInfo.faultType}
            onChange={(e) => setExtraInfo(prev => ({ ...prev, faultType: e.target.value }))}
          >
            <option value="">Vælg type</option>
            <option value="subduction">Subduktion (havbund skubbes kraftigt op/ned)</option>
            <option value="uplift">Opdyrkelse (bjergdannelse der kan løfte havbund)</option>
            <option value="strike-slip">Sideforskydning (klippemasser glider vandret forbi hinanden)</option>
            <option value="volcanic">Vulkansk</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderPhase3 = () => {
    const totalScore = calculateTotalRiskScore();
    const decisionLevel = getDecisionLevel(totalScore);

    return (
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>FASE 3: Tsunamirisiko Vurdering</h2>
        
        <div style={{ ...styles.resultCard, backgroundColor: '#fff3cd', borderColor: '#ffeaa7' }}>
          <strong>VIGTIGT:</strong> Tsunamivarsler har store økonomiske omkostninger. Udsend kun det varsel der er nødvendigt!
        </div>

        {/* Magnitude Risk */}
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#1976d2', marginBottom: '10px' }}>1. Magnitude Vurdering</h3>
          {[
            { value: 5, label: 'MEGET HØJ RISIKO: Magnitude over 7.9 (+5 point)', color: '#dc3545' },
            { value: 3, label: 'HØJ RISIKO: Magnitude 7.5-7.9 (+3 point)', color: '#dc3545' },
            { value: 1, label: 'MODERAT RISIKO: Magnitude 7.0-7.4 (+1 point)', color: '#fd7e14' },
            { value: 0, label: 'LAV RISIKO: Magnitude 6.5-6.9 (0 point)', color: '#28a745' },
            { value: -2, label: 'MEGET LAV: Magnitude < 6.5 (-2 point)', color: '#28a745' }
          ].map((option) => (
            <div key={option.value} style={styles.riskOption}>
              <input 
                type="radio" 
                name="magnitude" 
                value={option.value}
                onChange={(e) => updateRiskScore('magnitude', e.target.value)}
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ color: option.color, fontWeight: '500' }}>{option.label}</span>
            </div>
          ))}
        </div>

        {/* Depth Risk */}
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#1976d2', marginBottom: '10px' }}>2. Dybde Vurdering</h3>
          {[
            { value: 3, label: 'MEGET LAVT (0-10 km): Maksimal energioverførsel (+3 point)', color: '#dc3545' },
            { value: 2, label: 'LAVT (10-30 km): Høj energioverførsel (+2 point)', color: '#dc3545' },
            { value: 1, label: 'MELLEM (30-70 km): Moderat energioverførsel (+1 point)', color: '#fd7e14' },
            { value: 0, label: 'DYBT (70-150 km): Lav energioverførsel (0 point)', color: '#28a745' },
            { value: -1, label: 'MEGET DYBT (>150 km): Minimal energioverførsel (-1 point)', color: '#28a745' }
          ].map((option) => (
            <div key={option.value} style={styles.riskOption}>
              <input 
                type="radio" 
                name="depth" 
                value={option.value}
                onChange={(e) => updateRiskScore('depth', e.target.value)}
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ color: option.color, fontWeight: '500' }}>{option.label}</span>
            </div>
          ))}
        </div>

        {/* Location Risk */}
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#1976d2', marginBottom: '10px' }}>3. Placering Vurdering</h3>
          {[
            { value: 3, label: 'UNDER HAVBUND: Direkte vandforskydning mulig (+3 point)', color: '#dc3545' },
            { value: 2, label: 'KYSTNÆR (<50 km): Hurtig tsunamiankomst (+2 point)', color: '#dc3545' },
            { value: 1, label: 'OCEANISK (50-200 km): Moderat risiko (+1 point)', color: '#fd7e14' },
            { value: 0, label: 'FJERNT (>200 km): Længere varslingstid (0 point)', color: '#28a745' },
            { value: -3, label: 'LANDBASERET: Ingen direkte tsunami (-3 point)', color: '#28a745' }
          ].map((option) => (
            <div key={option.value} style={styles.riskOption}>
              <input 
                type="radio" 
                name="location" 
                value={option.value}
                onChange={(e) => updateRiskScore('location', e.target.value)}
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ color: option.color, fontWeight: '500' }}>{option.label}</span>
            </div>
          ))}
        </div>

        {/* Fault Type Risk */}
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#1976d2', marginBottom: '10px' }}>4. Forkastningstype</h3>
          {[
            { value: 3, label: 'SUBDUKTION: Havbund skubbes kraftigt op/ned (+3 point)', color: '#dc3545' },
            { value: 1, label: 'OPDYRKELSE: Bjergdannelse der kan løfte havbund (+1 point)', color: '#fd7e14' },
            { value: -1, label: 'SIDEFORSKYDNING: Klippemasser glider vandret forbi hinanden (-1 point)', color: '#28a745' },
            { value: 2, label: 'VULKANSK: Uforudsigelig, kan udløse landskred (+2 point)', color: '#fd7e14' }
          ].map((option) => (
            <div key={option.value} style={styles.riskOption}>
              <input 
                type="radio" 
                name="faultType" 
                value={option.value}
                onChange={(e) => updateRiskScore('faultType', e.target.value)}
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ color: option.color, fontWeight: '500' }}>{option.label}</span>
            </div>
          ))}
        </div>

        {/* Total Score Display */}
        <div style={{ 
          ...styles.decisionBox, 
          borderColor: decisionLevel.color.includes('red') ? '#dc3545' : 
                       decisionLevel.color.includes('orange') ? '#fd7e14' : 
                       decisionLevel.color.includes('yellow') ? '#ffc107' : '#28a745',
          backgroundColor: decisionLevel.bg?.replace('text-', 'bg-').replace('-600', '-50')
        }}>
          <h3 style={{ color: '#1976d2', marginBottom: '10px' }}>Total Risikoscore: {totalScore} point</h3>
          <h2 style={{ color: decisionLevel.color.includes('red') ? '#dc3545' : 
                             decisionLevel.color.includes('orange') ? '#fd7e14' : 
                             decisionLevel.color.includes('yellow') ? '#ffc107' : '#28a745' }}>
            {decisionLevel.level}
          </h2>
          <p style={{ marginTop: '10px', fontSize: '16px' }}>{decisionLevel.desc}</p>
        </div>

        {/* Final Decision */}
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ color: '#1976d2', marginBottom: '15px' }}>Jeres Endelige Beslutning</h3>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Varselsniveau:</label>
            <input 
              style={styles.input}
              value={decision.level}
              onChange={(e) => setDecision(prev => ({ ...prev, level: e.target.value }))}
              placeholder="F.eks. LOKAL VARSEL"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Geografisk område for varsel:</label>
            <input 
              style={styles.input}
              value={decision.area}
              onChange={(e) => setDecision(prev => ({ ...prev, area: e.target.value }))}
              placeholder="Hvilke områder skal advares?"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Skal der udsendes tsunamivarsel?</label>
            <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="warning" 
                  value="yes"
                  onChange={(e) => setDecision(prev => ({ ...prev, warning: true }))}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span style={{ fontWeight: '500', color: '#dc3545' }}>JA - Udsend varsel</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="warning" 
                  value="no"
                  onChange={(e) => setDecision(prev => ({ ...prev, warning: false }))}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span style={{ fontWeight: '500', color: '#28a745' }}>NEJ - Ingen varsel</span>
              </label>
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Begrundelse for jeres beslutning:</label>
            <textarea 
              style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
              value={decision.justification}
              onChange={(e) => setDecision(prev => ({ ...prev, justification: e.target.value }))}
              placeholder="Forklar hvorfor I træffer denne beslutning baseret på jeres data og risikovurdering..."
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Særlige overvejelser:</label>
            <div style={{ marginTop: '8px' }}>
              {[
                'Befolkede kystområder i nærheden?',
                'Tidspunkt på dagen (nat = værre evakuering)?',
                'Særlige begivenheder (festivaler, feriesæson)?',
                'Tidligere tsunamihistorik i området?'
              ].map((consideration, index) => (
                <div key={index} style={{ ...styles.riskOption, backgroundColor: '#f8f9fa' }}>
                  <input type="checkbox" style={{ transform: 'scale(1.2)' }} />
                  <span>{consideration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const printReport = () => {
    window.print();
  };

  const downloadData = () => {
    const data = {
      groupInfo: { groupName, scenario, startTime },
      stations: stations.filter(s => s.name || s.lat || s.lon),
      epicenter,
      extraInfo,
      riskScores,
      totalScore: calculateTotalRiskScore(),
      decision,
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tsunami-analysis-${groupName || 'group'}-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>GEO-tsunami watch</h1>
          <p style={styles.subtitle}>Analyser jordskælv og træf beslutning om tsunamivarsel</p>
        </div>
        <div style={{ fontSize: '12px', opacity: '0.8', border: '1px solid rgba(255,255,255,0.3)', padding: '4px 8px', borderRadius: '4px' }}>
          v1.0
        </div>
      </div>

      {/* Status Bar */}
      <div style={styles.statusBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ fontSize: '14px', color: '#666' }}>
            <strong style={{ color: '#1976d2' }}>Aktiv fase:</strong> Fase {activePhase}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            <strong style={{ color: '#1976d2' }}>Gruppe:</strong> {groupName || 'Ikke angivet'}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            <strong style={{ color: '#1976d2' }}>Scenario:</strong> {scenario || 'Ikke angivet'}
          </div>
        </div>
        
        {/* Phase Navigation */}
        <div style={styles.phaseNav}>
          {[1, 2, 3].map((phase) => (
            <button 
              key={phase}
              style={{
                ...styles.phaseBtn,
                ...(activePhase !== phase ? styles.phaseBtnInactive : {})
              }}
              onClick={() => setActivePhase(phase)}
            >
              Fase {phase}
            </button>
          ))}
          <button 
            style={{ ...styles.phaseBtn, ...styles.btnSecondary }}
            onClick={printReport}
          >
            Print
          </button>
          <button 
            style={{ ...styles.phaseBtn, ...styles.btnSecondary }}
            onClick={downloadData}
          >
            Download
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {activePhase === 1 && renderPhase1()}
        {activePhase === 2 && renderPhase2()}
        {activePhase === 3 && renderPhase3()}

        {/* Next/Previous buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
          <button 
            style={{
              ...styles.btn,
              ...styles.btnSecondary,
              ...(activePhase === 1 ? { opacity: 0.5, cursor: 'not-allowed' } : {})
            }}
            onClick={() => activePhase > 1 && setActivePhase(activePhase - 1)}
            disabled={activePhase === 1}
          >
            ← Forrige Fase
          </button>
          <button 
            style={{
              ...styles.btn,
              ...(activePhase === 3 ? { opacity: 0.5, cursor: 'not-allowed' } : {})
            }}
            onClick={() => activePhase < 3 && setActivePhase(activePhase + 1)}
            disabled={activePhase === 3}
          >
            Næste Fase →
          </button>
        </div>
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