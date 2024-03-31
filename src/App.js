import { useEffect, useState } from "react";

export default function App() {
  const [query, setQuery] = useState("");
  const [emoji, setEmoji] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const KEY = "dc6a26e9f6980c0335f49f5251f78c42cf2f0492";

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchEmojis() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `https://emoji-api.com/emojis?search=${query}&access_key=${KEY}`,
            { signal: controller.signal }
          );
          if (!res.ok) throw new Error(`something went wrong fetching  emojis`);
          const data = await res.json();
          if (data.status === "error") throw new Error(`emoji not found`);

          setEmoji(data);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length === 0 || query === "" || query.length === 0) {
        setEmoji([]);
        return;
      }
      fetchEmojis();
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <div className="app">
      <>
        <Navbar>
          <Search setQuery={setQuery} query={query} />
          <NumResult emoji={emoji} />
        </Navbar>
        {(query === "" || query.length === 0) && (
          <h1 className="error"> Please search an emoji</h1>
        )}
        {isloading && <Loader />}
        {!isloading && !error && <Main emoji={emoji} query={query} />}
        {error && <ErrorMessage messsage={error} />}
      </>
    </div>
  );
}

function Loader() {
  return <p className="error">💿 Loading...</p>;
}
function ErrorMessage({ messsage }) {
  return (
    <div className="error">
      <span> ⛔️</span>
      <p className="error-message">{messsage}</p>
    </div>
  );
}
function Navbar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />

      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">👻</span>
      <h1> Emoji App</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      placeholder="search an emoji...."
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResult({ emoji }) {
  return (
    <p className="result">
      Found <strong> {emoji.length}</strong> result
    </p>
  );
}

function Main({ emoji, query }) {
  let filteredEmoji = emoji;
  if (query) {
    filteredEmoji = emoji.filter((addEmoji) =>
      addEmoji.slug.toLowerCase().includes(query.toLowerCase())
    );
  } else {
    filteredEmoji = [];
  }
  return (
    <section className="main">
      <div>
        <div className="main-list">
          {filteredEmoji.map((addEmoji) => (
            <EmojiList addEmoji={addEmoji} key={addEmoji.slug} />
          ))}
        </div>
      </div>
    </section>
  );
}

function EmojiList({ addEmoji }) {
  return (
    <div className="man-list">
      <div className="list">
        <p>{addEmoji.character}</p>
      </div>
    </div>
  );
}
