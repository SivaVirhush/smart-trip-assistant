import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Container, Spinner, Alert, Button, Form } from "react-bootstrap";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import tt from "@tomtom-international/web-sdk-maps";
import {
  filterSitesByState,
  getNearbySites,
  getStateLabel,
  stateOptions,
} from "../../data/southIndiaSites";
import "./CulturalMaps.css";

const southIndiaCenter = [78.7, 13.2];

const CulturalMaps = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const routeLayerRef = useRef(null);
  const trafficLayerRef = useRef(null);
  const mapReadyRef = useRef(false);
  const apiKey = process.env.REACT_APP_TOMTOM_API_KEY;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedState, setSelectedState] = useState("all");
  const [nearbyMode, setNearbyMode] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyError, setNearbyError] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState(null);
  const [showTraffic, setShowTraffic] = useState(false);
  const routeMarkersRef = useRef([]);

  const visibleSites = useMemo(() => {
    const stateSites = filterSitesByState(selectedState);
    if (nearbyMode && userLocation) {
      return getNearbySites(userLocation, stateSites, 150);
    }
    return stateSites;
  }, [nearbyMode, selectedState, userLocation]);

  const clearRoute = useCallback(() => {
    if (!mapInstance.current) return;

    if (routeLayerRef.current) {
      const { sourceId, layerId } = routeLayerRef.current;
      if (mapInstance.current.getLayer(layerId)) {
        mapInstance.current.removeLayer(layerId);
      }
      if (mapInstance.current.getSource(sourceId)) {
        mapInstance.current.removeSource(sourceId);
      }
      routeLayerRef.current = null;
    }

    routeMarkersRef.current.forEach((marker) => marker.remove());
    routeMarkersRef.current = [];
    setRouteInfo(null);
    setRouteError(null);
    setRouteLoading(false);
  }, []);

  const createLocationMarker = (type) => {
    const marker = document.createElement("div");
    marker.className = `route-pin route-pin--${type}`;
    const inner = document.createElement("span");
    inner.className = "route-pin__icon";
    marker.appendChild(inner);
    return marker;
  };

  const drawRoute = useCallback((coordinates) => {
    if (!mapInstance.current || !coordinates.length) return;
    if (
      typeof mapInstance.current.isStyleLoaded === "function" &&
      !mapInstance.current.isStyleLoaded()
    ) {
      mapInstance.current.once("idle", () => drawRoute(coordinates));
      return;
    }

    clearRoute();

    const sourceId = `route-source-${Date.now()}`;
    const layerId = `route-layer-${Date.now()}`;

    mapInstance.current.addSource(sourceId, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates },
      },
    });

    mapInstance.current.addLayer({
      id: layerId,
      type: "line",
      source: sourceId,
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": "#1f78ff",
        "line-width": 6,
        "line-opacity": 0.92,
      },
    });

    routeLayerRef.current = { sourceId, layerId };

    const startMarker = new tt.Marker({
      element: createLocationMarker("start"),
    })
      .setLngLat(coordinates[0])
      .addTo(mapInstance.current);

    const endMarker = new tt.Marker({ element: createLocationMarker("end") })
      .setLngLat(coordinates[coordinates.length - 1])
      .addTo(mapInstance.current);

    routeMarkersRef.current = [startMarker, endMarker];

    const bounds = new tt.LngLatBounds();
    coordinates.forEach((coord) =>
      bounds.extend(new tt.LngLat(coord[0], coord[1])),
    );
    mapInstance.current.fitBounds(bounds, {
      padding: { top: 70, bottom: 70, left: 70, right: 70 },
      maxZoom: 14,
      duration: 900,
    });
  }, [clearRoute]);

  const calculateRoute = useCallback(async (destination) => {
    setNearbyError(null);
    setRouteError(null);
    setRouteLoading(true);

    if (!navigator.geolocation) {
      setRouteError("Location is not available in this browser.");
      setRouteLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const origin = [position.coords.longitude, position.coords.latitude];
          const locations = `${position.coords.latitude},${position.coords.longitude}:${destination.lat},${destination.lon}`;
          const url = `https://api.tomtom.com/routing/1/calculateRoute/${locations}/json?key=${apiKey}&traffic=true&travelMode=car`;
          const response = await fetch(url);
          const data = await response.json();
          const route = data.routes?.[0];
          const coordinates =
            route?.legs?.flatMap((leg) =>
              (leg.points || []).map((point) => [
                point.longitude,
                point.latitude,
              ]),
            ) || [];

          if (!coordinates.length) throw new Error("No route data");

          drawRoute(coordinates);
          setUserLocation({ lat: origin[1], lon: origin[0] });

          const travelTime =
            route?.summary?.travelTimeInSeconds ??
            route?.summary?.travelTime ??
            0;
          const lengthMeters = route?.summary?.lengthInMeters ?? 0;
          const distanceKm = lengthMeters
            ? (lengthMeters / 1000).toFixed(1)
            : null;
          const durationMinutes = Math.round(travelTime / 60);
          const hours = Math.floor(durationMinutes / 60);
          const minutes = durationMinutes % 60;
          const durationText = hours ? `${hours}h ${minutes}m` : `${minutes}m`;

          setRouteInfo({
            originLabel: "Current Location",
            destinationName: destination.name || "Destination",
            distance: distanceKm,
            duration: durationText,
          });
        } catch (routeError) {
          console.error("Route error:", routeError);
          setRouteError("Could not calculate the route. Please try again.");
        } finally {
          setRouteLoading(false);
        }
      },
      () => {
        setRouteError("Please allow location access to calculate a route.");
        setRouteLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }, [apiKey, drawRoute]);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
  }, []);

  const fitToSites = useCallback((sites) => {
    if (!mapInstance.current || !sites.length) return;
    const bounds = new tt.LngLatBounds();
    sites.forEach((site) => bounds.extend(new tt.LngLat(site.lon, site.lat)));
    mapInstance.current.fitBounds(bounds, {
      padding: { top: 90, bottom: 70, left: 60, right: 60 },
      maxZoom: selectedState === "all" ? 7 : 9,
      duration: 700,
    });
  }, [selectedState]);

  const addMarkers = useCallback((sites) => {
    if (!mapInstance.current) return;
    clearMarkers();

    sites.forEach((site) => {
      const marker = new tt.Marker({ color: "#7b4e2f" })
        .setLngLat([site.lon, site.lat])
        .addTo(mapInstance.current);

      const stateName = getStateLabel(site.state);

      const popup = new tt.Popup({ offset: 28 }).setHTML(`
        <div class="site-popup">
          <h5>${site.name}</h5>
          <p>${stateName}</p>
          <button id="route-${site.name.replace(/[^a-z0-9]/gi, "-")}" class="route-btn">Route from me</button>
        </div>
      `);

      marker.setPopup(popup);
      popup.on("open", () => {
        setTimeout(() => {
          const button = document.getElementById(
            `route-${site.name.replace(/[^a-z0-9]/gi, "-")}`,
          );
          if (button) button.onclick = () => calculateRoute(site);
        }, 0);
      });

      markersRef.current.push(marker);
    });

    fitToSites(sites);
  }, [calculateRoute, clearMarkers, fitToSites]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    if (!apiKey) {
      setError("TomTom API key is missing. Add REACT_APP_TOMTOM_API_KEY.");
      setLoading(false);
      return;
    }

    try {
      mapInstance.current = tt.map({
        key: apiKey,
        container: mapRef.current,
        center: southIndiaCenter,
        zoom: 5.6,
        stylesVisibility: { poi: true },
      });

      const initializeMapLayers = () => {
        const map = mapInstance.current;
        if (!map || mapReadyRef.current) return;

        if (typeof map.isStyleLoaded === "function" && !map.isStyleLoaded()) {
          map.once("idle", initializeMapLayers);
          return;
        }

        if (!map.getSource("traffic-flow")) {
          map.addSource("traffic-flow", {
            type: "raster",
            tiles: [
              `https://api.tomtom.com/traffic/map/4/tile/flow/relative/{z}/{x}/{y}.png?key=${apiKey}`,
            ],
            tileSize: 256,
            minzoom: 5,
            maxzoom: 18,
            attribution: "TomTom",
          });
        }

        if (!map.getLayer("traffic-flow-layer")) {
          map.addLayer({
            id: "traffic-flow-layer",
            type: "raster",
            source: "traffic-flow",
            layout: { visibility: "none" },
            paint: { "raster-opacity": 0.78 },
          });
        }

        trafficLayerRef.current = "traffic-flow-layer";
        mapReadyRef.current = true;
        setLoading(false);
      };

      mapInstance.current.on("load", initializeMapLayers);
      mapInstance.current.on("idle", initializeMapLayers);

      mapInstance.current.on("error", () => {
        setError(
          "There was an error loading the map. Please refresh the page.",
        );
        setLoading(false);
      });
    } catch (mapError) {
      console.error("Map initialization error:", mapError);
      setError("Failed to initialize map. Please refresh the page.");
      setLoading(false);
    }

    return () => {
      clearMarkers();
      clearRoute();
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
      mapReadyRef.current = false;
    };
  }, [apiKey, clearMarkers, clearRoute]);

  useEffect(() => {
    if (!loading && mapInstance.current) {
      addMarkers(visibleSites);
    }
  }, [addMarkers, loading, visibleSites]);

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setNearbyMode(false);
    setNearbyError(null);
  };

  const handleNearbySites = () => {
    setNearbyError(null);
    if (nearbyMode) {
      setNearbyMode(false);
      setUserLocation(null);
      return;
    }

    if (!navigator.geolocation) {
      setNearbyError("Location is not available in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setNearbyMode(true);
      },
      () =>
        setNearbyError(
          "Please allow location access to find nearby cultural sites.",
        ),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const toggleTrafficLayer = () => {
    if (!mapInstance.current || !trafficLayerRef.current) return;
    const next = !showTraffic;
    mapInstance.current.setLayoutProperty(
      trafficLayerRef.current,
      "visibility",
      next ? "visible" : "none",
    );
    setShowTraffic(next);
  };

  return (
    <Container fluid className="p-0 position-relative">
      {loading && (
        <div className="map-loading">
          <Spinner animation="border" role="status" variant="success" />
          <div className="mt-2">Loading Map...</div>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="map-error">
          {error}
        </Alert>
      )}
      {routeInfo && (
        <div className="route-summary-panel">
          <div className="route-summary-header">Route Planner</div>
          <div className="route-summary-field">
            <span className="route-summary-label">From</span>
            <span>{routeInfo.originLabel}</span>
          </div>
          <div className="route-summary-field">
            <span className="route-summary-label">To</span>
            <span>{routeInfo.destinationName}</span>
          </div>
          <div className="route-summary-field route-summary-mode">
            <span className="route-summary-label">Travel Mode</span>
            <span>By Car</span>
          </div>
          <div className="route-summary-boxes">
            {routeInfo.distance && (
              <div className="route-summary-box">
                <div className="route-summary-box-title">Distance</div>
                <div className="route-summary-box-value">
                  {routeInfo.distance} km
                </div>
              </div>
            )}
            {routeInfo.duration && (
              <div className="route-summary-box">
                <div className="route-summary-box-title">Est. Time</div>
                <div className="route-summary-box-value">
                  {routeInfo.duration}
                </div>
              </div>
            )}
          </div>
          <button className="route-clear-btn" onClick={clearRoute}>
            Clear Route
          </button>
        </div>
      )}
      {routeLoading && (
        <div className="route-loading">Calculating route...</div>
      )}
      {routeError && (
        <Alert variant="warning" className="route-error">
          {routeError}
        </Alert>
      )}

      <div className="map-toolbar">
        <Form.Select value={selectedState} onChange={handleStateChange}>
          {stateOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
        <Button
          variant={nearbyMode ? "primary" : "light"}
          onClick={handleNearbySites}
        >
          {nearbyMode ? "Show Selected State" : "Near Cultural Sites"}
        </Button>
        <Button
          variant={showTraffic ? "primary" : "light"}
          onClick={toggleTrafficLayer}
        >
          {showTraffic ? "Hide Traffic" : "Show Traffic"}
        </Button>
      </div>

      {nearbyError && (
        <Alert variant="warning" className="nearby-map-alert">
          {nearbyError}
        </Alert>
      )}

      <div className="site-count-pill">
        {nearbyMode ? "Nearby" : getStateLabel(selectedState)}:{" "}
        {visibleSites.length} sites
      </div>

      <div className="map-container" ref={mapRef}></div>
    </Container>
  );
};

export default CulturalMaps;
