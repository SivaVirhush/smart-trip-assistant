import { Link } from "react-router-dom";

const imageBase = "https://commons.wikimedia.org/wiki/Special:FilePath/";

const neutralSvgMarkup = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'><rect width='1200' height='800' fill='#f3efe9'/><g fill='#9b633b' transform='translate(260 160)'><rect x='80' y='220' width='120' height='200' rx='8'/><rect x='220' y='180' width='120' height='240' rx='8'/><rect x='360' y='220' width='120' height='200' rx='8'/><rect x='0' y='440' width='600' height='12' fill='#e6d7cc'/></g><text x='50%' y='92%' font-size='36' fill='#7b4e2f' text-anchor='middle' font-family='Arial, Helvetica, sans-serif'>Cultural Site</text></svg>`;
const neutralSvg = `data:image/svg+xml;utf8,${encodeURIComponent(neutralSvgMarkup)}`;
const heritageSites = [
  {
    title: "Brihadeeswarar Temple",
    location: "Thanjavur",
    image: `${imageBase}Brihadeeswarar%20Temple%20Tanjore.jpg?width=900`,
    text: "A Chola masterpiece crowned by one of India's grandest vimanas.",
  },
  {
    title: "Meenakshi Temple",
    location: "Madurai",
    image: `${imageBase}Meenakshi%20Temple.jpg?width=900`,
    text: "A living temple city known for its sculpted towers and sacred stories.",
  },
  {
    title: "Shore Temple",
    location: "Mahabalipuram",
    image: `${imageBase}Skyhigh%20Mahabalipuram%20Shore%20Temple.jpg?width=900`,
    text: "An 8th-century Pallava shrine looking toward the Bay of Bengal.",
  },
  {
    title: "Gangaikonda Cholapuram",
    location: "Ariyalur",
    image: `${imageBase}Gangaikonda%20Cholapuram%20-Ariyalur-Tamil%20Nadu-%20DSC002.jpg?width=900`,
    text: "Imperial Chola architecture with serene stonework and scale.",
  },
  {
    title: "Thirumalai Nayakkar Mahal",
    location: "Madurai",
    image: `${imageBase}Thirumalai%20Nayakkar%20Palace%20Madurai.jpg?width=900`,
    text: "A majestic 17th-century palace blending Dravidian and Rajput styles.",
  },
  {
    title: "Vellore Fort",
    location: "Vellore",
    image: `${imageBase}Vellore%20Fort.jpg?width=900`,
    text: "A sprawling fortress with temples, mosques, and museum galleries.",
  },
  {
    title: "Vadakkunnathan Temple",
    location: "Thrissur",
    image: `${imageBase}Vadakkunnathan%20Temple%20Thrissur.jpg?width=900`,
    text: "An ancient temple at the heart of Kerala's festival capital.",
  },
  {
    title: "Hampi Group of Monuments",
    location: "Hampi",
    image: `${imageBase}Hampi%20Group%20of%20Monuments.jpg?width=900`,
    text: "A dramatic UNESCO World Heritage site of Vijayanagara ruins.",
  },
];

function Home() {
  return (
    <main className="heritage-home">
      <section className="heritage-hero">
        <div className="hero-ornament" aria-hidden="true"></div>
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Celebrating Tamil Nadu's legacy</p>
            <h1>Preserving Heritage. Inspiring Journeys.</h1>
            <div className="title-rule" aria-hidden="true"></div>
            <p className="hero-lead">
              Explore temple towns, Chola marvels, coastal monuments, cultural
              stories, live routes, and visit planning with an AI heritage
              guide.
            </p>
            <div className="hero-actions">
              <Link to="/chat" className="btn btn-primary">
                Ask AI Guide <span aria-hidden="true">→</span>
              </Link>
              <Link to="/cultural-maps" className="btn btn-outline-primary">
                Explore Heritage Sites <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="hero-art" aria-label="Brihadeeswarar Temple">
            <img
              src={`${imageBase}Brihadeeswarar%20Temple%20Tanjore.jpg?width=1400`}
              alt="Brihadeeswarar Temple in Thanjavur"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = neutralSvg;
              }}
            />
            <div className="hero-image-wash" aria-hidden="true"></div>
          </div>
        </div>
      </section>

      <section className="promise-band">
        <div className="container">
          <p className="eyebrow text-center">Our promise</p>
          <h2>Honoring the Past. Enriching the Journey.</h2>
          <div className="promise-grid">
            <div>
              <span className="promise-icon">◇</span>
              <h3>Discover</h3>
              <p>Find historic sites, temple towns, monuments, and stories.</p>
            </div>
            <div>
              <span className="promise-icon">▣</span>
              <h3>Plan</h3>
              <p>Use the calendar assistant to shape your visit schedule.</p>
            </div>
            <div>
              <span className="promise-icon">◎</span>
              <h3>Navigate</h3>
              <p>Check maps, traffic, and route context before you leave.</p>
            </div>
            <div>
              <span className="promise-icon">✧</span>
              <h3>Learn</h3>
              <p>Follow heritage news, archaeology, literature, and culture.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-band">
        <div className="container about-grid">
          <div className="about-copy">
            <p className="eyebrow">About the guide</p>
            <h2>Guardians of Culture. Curators of Routes.</h2>
            <div className="title-rule light" aria-hidden="true"></div>
            <p>
              Incredible Heritage brings together heritage guidance, map context,
              current affairs, and visit planning for Tamil Nadu's timeless
              places.
            </p>
            <Link to="/features" className="btn btn-outline-light">
              View Tools <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="about-image">
            <img
              src={`${imageBase}Meenakshi%20temple%20madurai.jpg?width=1100`}
              alt="Meenakshi Temple in Madurai"
            />
          </div>
          <div className="about-stats">
            <div>
              <strong>25+</strong>
              <span>Featured cultural landmarks</span>
            </div>
            <div>
              <strong>4</strong>
              <span>Planning and discovery tools</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Guest AI heritage assistance</span>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-sites">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Explore our legacy</p>
              <h2>Featured Heritage Sites</h2>
            </div>
            <Link to="/cultural-maps" className="btn btn-outline-primary">
              View Map <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="site-card-grid">
            {heritageSites.map((site) => (
              <article className="heritage-site-card" key={site.title}>
                <img
                  src={site.image}
                  alt={site.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = neutralSvg;
                  }}
                />
                <div className="site-card-body">
                  <p>{site.location}</p>
                  <h3>{site.title}</h3>
                  <span>{site.text}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
