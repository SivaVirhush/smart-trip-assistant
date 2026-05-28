import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Container,
  Spinner,
  Alert,
  Form,
  Button,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import {
  filterSitesByState,
  getStateLabel,
  getTrafficLocationsForSite,
  stateOptions,
} from "../../data/southIndiaSites";
import "./LiveTrafficData.css";

const LiveTrafficData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trafficData, setTrafficData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedSite, setSelectedSite] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const apiKey = process.env.REACT_APP_TOMTOM_API_KEY;

  const sites = useMemo(
    () => filterSitesByState(selectedState),
    [selectedState],
  );

  function getTrafficLevel(current, freeFlow) {
    const ratio = current / freeFlow;
    if (ratio >= 0.8) return "Low";
    if (ratio >= 0.5) return "Medium";
    return "High";
  }

  const fetchTrafficData = useCallback(async (lat, lon) => {
    if (!apiKey) return null;

    try {
      const url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${lat},${lon}&unit=KMPH&key=${apiKey}`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      return data.flowSegmentData;
    } catch (fetchError) {
      console.error("Error fetching traffic data:", fetchError);
      return null;
    }
  }, [apiKey]);

  useEffect(() => {
    let isMounted = true;

    async function loadTrafficData() {
      setLoading(true);
      setError(null);
      setSelectedSite(null);

      if (!apiKey) {
        setError("TomTom API key is missing. Add REACT_APP_TOMTOM_API_KEY.");
        setLoading(false);
        return;
      }

      try {
        const siteEntries = await Promise.all(
          sites.map(async (site) => {
            const locations = await Promise.all(
              getTrafficLocationsForSite(site).map(async (loc) => {
                const data = await fetchTrafficData(loc.lat, loc.lon);
                if (!data) {
                  return { ...loc, error: "Could not load data" };
                }

                return {
                  ...loc,
                  trafficData: data,
                  trafficLevel: getTrafficLevel(
                    data.currentSpeed,
                    data.freeFlowSpeed,
                  ),
                  error: null,
                };
              }),
            );

            return [site.name, { site, locations }];
          }),
        );

        const results = Object.fromEntries(siteEntries);

        if (isMounted) {
          setTrafficData(results);
          setLoading(false);
        }
      } catch (loadError) {
        console.error("Error loading traffic data:", loadError);
        if (isMounted) {
          setError("Failed to load traffic data. Please try again later.");
          setLoading(false);
        }
      }
    }

    loadTrafficData();

    return () => {
      isMounted = false;
    };
  }, [apiKey, fetchTrafficData, refreshKey, sites]);

  const getSiteOverallTraffic = (locations) => {
    const validLocations = locations.filter((loc) => !loc.error);
    if (validLocations.length === 0) return "Unknown";

    const levels = { Low: 0, Medium: 0, High: 0 };
    validLocations.forEach((loc) => {
      levels[loc.trafficLevel]++;
    });

    if (levels.High > 0) return "High";
    if (levels.Medium > 0) return "Medium";
    return "Low";
  };

  const filteredSites = Object.entries(trafficData).filter(
    ([siteName, entry]) => {
      const term = searchTerm.toLowerCase();
      return (
        siteName.toLowerCase().includes(term) ||
        getStateLabel(entry.site.state).toLowerCase().includes(term)
      );
    },
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setSelectedSite(null);
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setSearchTerm("");
  };

  const selectedEntry = selectedSite ? trafficData[selectedSite] : null;

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status" variant="success" />
        <div className="mt-2">Loading Traffic Data...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="traffic-data-container">
      <h1 className="text-center mb-4">
        Traffic Around South India Cultural Sites
      </h1>

      <div className="traffic-filter-bar">
        <Form.Select value={selectedState} onChange={handleStateChange}>
          {stateOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
        <Form.Control
          type="text"
          placeholder="Search for a cultural site or state..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <div className="traffic-context text-center">
        Showing {filteredSites.length} sites for {getStateLabel(selectedState)}
      </div>

      <div className="traffic-legend">
        <h3>Parameter Guide</h3>
        <ul>
          <li>
            <strong>Traffic Rate</strong>: estimated traffic severity based on
            current speed versus free-flow speed.
          </li>
          <li>
            <strong>Free Flow Speed</strong>: expected normal speed when traffic
            is light.
          </li>
          <li>
            <strong>Current Speed</strong>: actual measured speed on the road
            segment.
          </li>
          <li>
            <strong>Road Closure</strong>: whether the road is currently closed
            (Yes/No).
          </li>
          <li>
            <strong>Popup / Details Panel</strong>: click a site card to open
            the detailed traffic view for that location.
          </li>
        </ul>
      </div>

      {filteredSites.length === 0 ? (
        <div className="text-center my-5">
          <Alert variant="info">No sites match your search criteria.</Alert>
        </div>
      ) : (
        <div className="traffic-content-wrapper">
          <div
            className={`main-content-area ${selectedSite ? "with-sidebar" : ""}`}
          >
            <Row className="site-cards-container">
              {filteredSites.map(([siteName, entry]) => {
                const overallTraffic = getSiteOverallTraffic(entry.locations);
                return (
                  <Col
                    key={siteName}
                    lg={selectedSite ? 4 : 3}
                    md={selectedSite ? 6 : 4}
                    sm={6}
                    xs={12}
                    className="mb-4"
                  >
                    <Card
                      className={`site-card ${selectedSite === siteName ? "selected" : ""}`}
                      onClick={() =>
                        setSelectedSite(
                          selectedSite === siteName ? null : siteName,
                        )
                      }
                    >
                      <Card.Body className="text-center">
                        <div className="state-tag">
                          {getStateLabel(entry.site.state)}
                        </div>
                        <Card.Title className="site-card-title">
                          {siteName}
                        </Card.Title>
                        <div className={`traffic-indicator ${overallTraffic}`}>
                          Traffic Level: {overallTraffic}
                        </div>
                        <div className="card-instruction">
                          Click to view details
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </div>

          {selectedEntry && (
            <div className="location-details-sidebar">
              <div className="sidebar-header">
                <h2>{selectedSite}</h2>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="close-sidebar-btn"
                  onClick={() => setSelectedSite(null)}
                >
                  &times;
                </Button>
              </div>

              <div className="sidebar-content">
                {selectedEntry.locations.map((loc, index) => (
                  <div className="location-card" key={index}>
                    <h3>{loc.name}</h3>
                    {loc.error ? (
                      <p className="error-message">Traffic data unavailable</p>
                    ) : (
                      <>
                        <div className={`rate ${loc.trafficLevel}`}>
                          Traffic Rate: {loc.trafficLevel}
                        </div>
                        <p>
                          Free Flow Speed: {loc.trafficData.freeFlowSpeed} km/h
                        </p>
                        <p>
                          Current Speed: {loc.trafficData.currentSpeed} km/h
                        </p>
                        <p>
                          Road Closure:{" "}
                          {loc.trafficData.roadClosure ? "Yes" : "No"}
                        </p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="refresh-container text-center mb-5">
            <Button
              variant="outline-primary"
              onClick={() => setRefreshKey((key) => key + 1)}
              className="refresh-button"
            >
              Refresh Traffic Data
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default LiveTrafficData;
