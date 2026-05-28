import React, { useCallback, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Form,
} from "react-bootstrap";
import "./CurrentAffairs.css";

const categoryQueries = {
  archaeology: "archaeology India",
  heritage: "South India heritage monument temple UNESCO",
  temples: "South India temple architecture Chola Hoysala Pallava",
  literature: "Tamil Telugu Kannada Malayalam literature Sangam history",
  all: "South India heritage archaeology temple culture",
};

const CurrentAffairs = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("archaeology");
  const newsApiKey = process.env.REACT_APP_NEWS_API_KEY;

  const fetchNews = useCallback(async () => {
    setLoading(true);
    if (!newsApiKey) {
      setError("NewsAPI key is missing. Add REACT_APP_NEWS_API_KEY.");
      setNews([]);
      setLoading(false);
      return;
    }

    try {
      const searchQuery = categoryQueries[category] || categoryQueries.all;

      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          searchQuery
        )}&pageSize=20&sortBy=publishedAt&language=en&apiKey=${newsApiKey}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch updates: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "ok") {
        const articles = data.articles || [];
        setNews(articles);
        setError(null);
      } else {
        throw new Error(data.message || "Failed to fetch updates");
      }
    } catch (error) {
      console.error("Error fetching updates:", error);
      setError(
        "Failed to load current affairs updates. Please try again later."
      );
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, [category, newsApiKey]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Filter news based on search term
  const filteredNews = news.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.description &&
        article.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Format publication date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle category change
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };

  return (
    <Container fluid className="current-affairs-container">
      <h1 className="text-center main-title mb-4">
        South India Current Affairs
      </h1>

      <div className="affairs-controls mb-4">
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Search current affairs..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <div className="category-filters">
              <button
                className={`category-btn ${
                  category === "archaeology" ? "active" : ""
                }`}
                onClick={() => handleCategoryChange("archaeology")}
              >
                Archaeology
              </button>
              <button
                className={`category-btn ${
                  category === "heritage" ? "active" : ""
                }`}
                onClick={() => handleCategoryChange("heritage")}
              >
                Heritage
              </button>
              <button
                className={`category-btn ${
                  category === "literature" ? "active" : ""
                }`}
                onClick={() => handleCategoryChange("literature")}
              >
                Literature
              </button>
              <button
                className={`category-btn ${
                  category === "temples" ? "active" : ""
                }`}
                onClick={() => handleCategoryChange("temples")}
              >
                Temples
              </button>
              <button
                className={`category-btn ${category === "all" ? "active" : ""}`}
                onClick={() => handleCategoryChange("all")}
              >
                All
              </button>
            </div>
          </Col>
        </Row>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="success" />
          <div className="mt-2">Loading updates...</div>
        </div>
      ) : error ? (
        <Alert variant="danger" className="my-4">
          {error}
        </Alert>
      ) : filteredNews.length === 0 ? (
        <Alert variant="info" className="my-4">
          No articles found. Try a different search or category.
        </Alert>
      ) : (
        <Row className="articles-grid">
          {filteredNews.map((article, index) => (
            <Col key={index} lg={4} md={6} sm={12} className="mb-4">
              <Card className="article-card h-100">
                <div className="article-image-container">
                  <Card.Img
                    variant="top"
                    src={
                      article.urlToImage ||
                      "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={article.title}
                    className="article-image"
                  />
                  <div className="source-badge">{article.source.name}</div>
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="article-title">
                    {article.title}
                  </Card.Title>
                  <div className="article-date">
                    {formatDate(article.publishedAt)}
                  </div>
                  <Card.Text className="article-description">
                    {article.description
                      ? article.description.length > 150
                        ? article.description.substring(0, 150) + "..."
                        : article.description
                      : "No description available"}
                  </Card.Text>
                  <div className="mt-auto">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="read-more-btn"
                    >
                      Read More
                    </a>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <div className="attribution-note text-center mt-4 mb-5">
        <small>Powered by NewsAPI.org</small>
      </div>
    </Container>
  );
};

export default CurrentAffairs;
